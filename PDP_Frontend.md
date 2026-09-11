# PDP — Plan Deploy Production

## Vibeer Frontend (Quasar 2 + Vue 3 + Webpack)

> **Estrategia aprobada:** desplegar en un VPS con **Docker** (`Dockerfile.prod` multi-stage + `docker-compose.prod.yml`), build dentro de un contenedor `node:18-alpine` (no se usa Node local) y servido por nginx con HTTPS. El backend del proyecto NO se toca en este repo más allá de las variables que se listan en §2.2.

---

## Índice

1. [Pre-requisitos](#1-pre-requisitos)
2. [Configuración: Dev → Prod](#2-configuración-dev--prod)
3. [Parametrizar con variables de entorno (hecho)](#3-parametrizar-con-variables-de-entorno-hecho)
4. [Certificados: staging (local) vs producción (real)](#4-certificados-staging-local-vs-producción-real)
5. [Build y servidor de producción (Docker)](#5-build-y-servidor-de-producción-docker)
6. [Coordinación con el stack del backend](#6-coordinación-con-el-stack-del-backend)
7. [Comandos de despliegue (one-off)](#7-comandos-de-despliegue-one-off)
8. [Verificación post-deploy](#8-verificación-post-deploy)
9. [Checklist de seguridad](#9-checklist-de-seguridad)
10. [Resumen de archivos](#10-resumen-de-archivos)

---

## 1. Pre-requisitos

| Requisito | Especificación |
|-----------|---------------|
| VPS | Linux (Debian/Ubuntu), 1+ GB RAM, IP pública |
| Docker | Docker Engine 20.10+ y Docker Compose v2 (build en contenedor — **sin Node local**) |
| Puertos | `80` y `443` abiertos en el firewall |
| Dominio | `vibeer.com` con DNS A → IP del VPS |
| Certificado | Let's Encrypt (gratis, renovable) o comprado por la empresa |
| Backend | API Laravel accesible en `https://api.vibeer.com` con CORS habilitado para `https://vibeer.com` |

---

## 2. Configuración: Dev → Prod

### 2.1 URLs del backend

| Ubicación | Valor dev | Valor prod | Estado |
|-----------|-----------|------------|--------|
| `src/boot/axios.js` (baseURL) | `http://localhost:8000/` (fallback) | `VUE_APP_API_URL` (build) | ✅ parametrizado |
| `quasar.conf.js` (backendUrl para imágenes) | `http://localhost:8000` (fallback) | `apiUrl` (build) | ✅ parametrizado |
| `src/pages/Admin/SupportTickets/show.vue:269` (fallback) | `http://localhost:8000` | `https://api.vibeer.com` | opcional |

> **Nota:** `axios.js` (llamadas API) y `quasar.conf.js` (`backendUrl` → URLs de imágenes) son independientes. Con la parametrización de §3 ambos vienen de la misma variable.

### 2.2 Variables del backend que afectan al frontend (OBLIGATORIO)

| Variable backend | Dev | Prod | Impacto en frontend |
|------------------|-----|------|---------------------|
| `APP_URL` | `http://localhost:8000` | `https://api.vibeer.com` | URLs generadas, storage links |
| `FRONTEND_APP` | `http://localhost:8080` | `https://vibeer.com` | Permisos CORS (`config/cors.php`), links de reset |
| `GOOGLE_REDIRECT_URL` | `http://localhost:8080/authorize/google/callback` | `https://vibeer.com/authorize/google/callback` | Callback OAuth Google |
| `FACEBOOK_REDIRECT_URL` | `http://localhost:8080/authorize/facebook/callback` | `https://vibeer.com/authorize/facebook/callback` | Callback OAuth Facebook |

> Deben coincidir **exactamente** con las URIs registradas en Google Cloud Console y Facebook Developer (`src/router/routes.js`).

### 2.3 Lo que NO se toca (resuelto en runtime)

| Ítem | Cómo se resuelve |
|------|-------------------|
| OpenPay Keys | `GET /api/openpay-keys/public` (placeholders en `quasar.conf.js` muertos) |
| Google Maps API Key | `GET /api/google-maps-key` + inyección dinámica |
| OAuth | Flujo server-driven (`redirect` a `/api/authorize/...`) |
| SDK OpenPay JS | CDN hardcodeado en `src/index.template.html` |

---

## 3. Parametrizar con variables de entorno (hecho)

### 3.1 Fixes ya aplicados y verificados en el repo

| Cambio | Archivo |
|--------|---------|
| `baseURL` desde `process.env.VUE_APP_API_URL` | `src/boot/axios.js` |
| `build.env.VUE_APP_API_URL` + `framework.config.backendUrl` desde `apiUrl` | `quasar.conf.js` |
| Credenciales demo vacías (`email:""`, `password:""`) | `src/pages/Auth/Login.vue`, `src/pages/Auth/Register.vue` |
| Token parseado con `JSON.parse` (era JSON string) | `src/App.vue` |
| `.env.development` / `.env.production` | raíz (documentación + build) |

### 3.2 Hallazgo de la simulación: cómo se inyecta la URL en este CLI

⚠️ `@quasar/app` va en `^3.0.0` (resuelto **3.2.6**), el CLI nuevo. Dos particularidades que rompían el login (405 con URL `%22https://api.vibeer.test%22/api/login`):

1. **No lee `.env.*` automáticamente** (a diferencia de `@quasar/app-webpack` v3 clásico). `process.env.VUE_APP_API_URL` NO viene de `.env.production`.
2. **`build.env` ya serializa con `JSON.stringify`** (`node_modules/@quasar/app/lib/helpers/parse-build-env.js:7`): **no pasar `JSON.stringify()`** → doble-codifica (comillas literales) y la URL queda rota.

Implementación verificada (valor **crudo**, nunca `JSON.stringify`):

```js
// quasar.conf.js
const apiUrl = process.env.VUE_APP_API_URL ||
  (ctx.prod ? "https://api.vibeer.com" : "http://localhost:8000");
build: { env: { VUE_APP_API_URL: apiUrl } },
framework: { config: { backendUrl: apiUrl } }
```

En el build Docker la URL se pasa como `--build-arg VUE_APP_API_URL=...` (el `Dockerfile.prod` la mapea a `ENV`; ver §5.1). Los `.env.production`/`.env.development` quedan como documentación, no son leídos por este CLI.

---

## 4. Certificados: staging (local) vs producción (real)

| | Staging (local, `vibeer.test`) | Producción (`vibeer.com`) |
|---|---|---|
| Certificado | Self-signed (openssl) — **solo para simular HTTPS en local** | Let's Encrypt o comprado por la empresa |
| DNS | `C:\Windows\...\hosts` → `127.0.0.1 vibeer.test` | DNS real → IP del VPS |
| Ruta nginx | `/certs/server.crt` (eliminados tras la simulación) | `/certs/real/fullchain.pem` + `/certs/real/privkey.pem` |

**No hay conflicto**: en producción el nginx apunta a `/certs/real`. Flujo (en el VPS):

```bash
sudo certbot certonly --webroot -w Docker/certs/real -d vibeer.com --register-unsafely-without-email --agree-tos
# (o cert comprado → colocar los .pem en Docker/certs/real/)
```

El folder `Docker/certs/real/` está montado como `/certs/real` dentro del nginx de producción; la renovación de certbot solo reescribe los `.pem` y nginx los recarga.

---

## 5. Build y servidor de producción (Docker)

### 5.1 `Dockerfile.prod` (multi-stage — build sin Node local)

```dockerfile
# -------- Etapa 1: build --------
FROM node:18-alpine AS build
WORKDIR /app

ARG VUE_APP_API_URL=https://api.vibeer.com
ENV VUE_APP_API_URL=$VUE_APP_API_URL

COPY package*.json ./
RUN npm ci --no-audit --no-fund || npm install

COPY . .
RUN npx quasar build -m spa

# -------- Etapa 2: servidor estático --------
FROM nginx:1.25-alpine
COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY Docker/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
```

> Los certs **no** se copian a la imagen (`.dockerignore` los excluye): se montan en runtime vía volumen (§5.3).

### 5.2 `Docker/nginx/default.conf` (SPA + HTTPS real)

```nginx
# HTTP -> HTTPS
server {
    listen 80;
    server_name vibeer.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vibeer.com;
    root /usr/share/nginx/html;
    index index.html;

    ssl_certificate     /certs/real/fullchain.pem;
    ssl_certificate_key /certs/real/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / { try_files $uri $uri/ /index.html; }   # SPA fallback (history mode)

    location ~* \.(js|css|woff2?|png|jpe?g|gif|svg|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    client_max_body_size 100M;
}
```

### 5.3 `docker-compose.prod.yml` — de imagen 100% estática.

```yaml
name: vibeer-frontend-prod
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.prod
      args:
        VUE_APP_API_URL: https://api.vibeer.com
    image: vibeer-frontend:prod
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./Docker/certs:/certs:ro
    restart: unless-stopped
```

> **En el VPS único (topología fusionada) este compose solo se usa para CONSTRUIR** la imagen con el `dist` (`docker compose -f docker-compose.prod.yml build`). El nginx público del `backendMusic` sirve la SPA desde `root /var/www/spa` (el `dist` se extrae de la imagen, ver §6). Si se corriera este compose en una máquina sin el backend, sí publica 80/443 por su cuenta.

---

## 6. Coordinación con el stack del backend (VPS único)

| Dominio | Quién lo sirve | Puerto |
|---------|----------------|--------|
| `vibeer.com` (SPA) | **nginx del `backendMusic`** → `server_name vibeer.com; root /var/www/spa` | 80/443 |
| `api.vibeer.com` (API) | **nginx del `backendMusic`** → fastcgi a `backend:9000` | 80/443 |

**Un solo nginx público (SNI por dominio)** — topología aprobada. El contenedor del frontend **no publica puertos**: su imagen solo aporta el `dist`.

**Puntos de integración:**

1. **CORS**: `FRONTEND_APP=https://vibeer.com` en `backendMusic/.env`.
2. **OAuth**: callbacks → `https://vibeer.com/authorize/...` en el `.env` del backend.
3. **Imágenes**: `backendUrl` (build) = `https://api.vibeer.com`.
4. **Cert**: un solo cert real para ambos dominios en `/certs/real` (certbot `-d api.vibeer.com -d vibeer.com`).

**Cómo se sirve la SPA (sin contenedor corriendo):**

```bash
# 1. Construir la imagen (fuera del VPS):
docker compose -f docker-compose.prod.yml build
# 2. Llevarla: docker save vibeer-frontend:prod | gzip > ... y docker load en el VPS
# 3. Extraer el dist al volumen del nginx del backend:
docker run --rm -v /var/www/backendMusic/spa:/out vibeer-frontend:prod \
  sh -c "cp -r /usr/share/nginx/html/. /out/"
```

El nginx del backend ya tiene el `server block SPA` (`root /var/www/spa`, `try_files ... /index.html`) y monta `./spa:/var/www/spa:ro`. Un deploy nuevo del frontend = re-extraer `dist` + `docker compose restart nginx` (el `index.html` se sirve sin cache → visible al instante).

**Rendimiento en 512MB:** no se corre ningún proceso extra del frontend; la SPA es puro nginx estático del backend.

---

## 7. Comandos de despliegue (one-off)

> Sin scripts `.sh`. El build se hace **fuera del VPS** (512MB no dan para node+webpack); la imagen se transfiere con `docker save`/`load` y el `dist` se extrae en el volumen del nginx del backend.

```bash
# ---------- En tu MAQUINA (build + tranferir) ----------
cd frontendMusic
docker compose -f docker-compose.prod.yml build          # arg VUE_APP_API_URL incluido
docker save vibeer-frontend:prod | gzip > vibeer-frontend.tar.gz
scp vibeer-frontend.tar.gz root@IP:/var/www/

# ---------- En el VPS ----------
cd /var/www && gzip -dc vibeer-frontend.tar.gz | sudo docker load

# Extraer el dist a /var/www/backendMusic/spa (montado por el nginx del backend):
docker run --rm -v /var/www/backendMusic/spa:/out vibeer-frontend:prod \
  sh -c "cp -r /usr/share/nginx/html/. /out/"

# Nginx del backend ya sirve la SPA: recargar para asegurar cert/estáticos
docker compose -f /var/www/backendMusic/docker-compose.yml restart nginx

# Verificar
curl -sI https://vibeer.com | head -1
curl -sI https://vibeer.com/login | head -1        # 200 (SPA fallback)
```

**Actualización futura:** `git pull` → rebuild local → `docker save`/`scp`/`docker load` → re-extraer `dist` → `docker compose restart nginx`.

---

## 8. Verificación post-deploy

```bash
# HTTPS + nginx
curl -sI https://vibeer.com | head -1
curl -s https://vibeer.com/ | grep -o "<title>[^<]*</title>"

# SPA fallback (rutas internas no dan 404)
curl -sI https://vibeer.com/login | head -1
curl -sI https://vibeer.com/client/shopping-cart | head -1

# HTTP -> HTTPS
curl -sI http://vibeer.com | grep -i "301\|location"

# CORS del backend
curl -s -H "Origin: https://vibeer.com" -I https://api.vibeer.com/api/me | grep -i "access-control"
```

Pruebas funcionales manuales:

- [ ] Login con `admin@vibeer.com`.
- [ ] `GET /api/me` con el perfil correcto (JWT + CORS).
- [ ] OAuth Google/Facebook vuelven a `https://vibeer.com/authorize/...`.
- [ ] Imágenes de artistas cargan (confirmar `backendUrl` = prod).
- [ ] Recarga en `/client/shopping-cart` sin 404 (history mode).
- [ ] DevTools → todas las peticiones API apuntan a `https://api.vibeer.com`, no a `localhost`.

### Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| URL del API rota (405, `%22...%22`) | `JSON.stringify` en `build.env` (CLI ya serializa) | Pasar valor crudo (§3.2) |
| Login 405 | `VUE_APP_API_URL` con comillas literales | Rebuild con `--build-arg` correcto |
| Página en blanco / `app.js` 404 | `dist/spa` no generado | Verificar `npx quasar build -m spa` en la etapa 1 |
| 404 en rutas internas | Falta SPA fallback | `try_files $uri $uri/ /index.html;` |
| CORS error | `FRONTEND_APP` no coincide | `FRONTEND_APP=https://vibeer.com` en backend `.env` |
| Imágenes rotas | `backendUrl` a localhost | `backendUrl` = `https://api.vibeer.com` (§3.2) |
| `redirect_uri_mismatch` | URI OAuth no registrada | Sincronizar Consolas + `.env` backend |

---

## 9. Checklist de seguridad

- [ ] HTTPS activo con cert **real** (no self-signed).
- [ ] HTTP→HTTPS en nginx (`return 301`).
- [ ] `VUE_APP_API_URL` = `https://api.vibeer.com` (sin `http://` plano).
- [ ] Headers de seguridad en nginx (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- [ ] Credenciales demo vacías (no `angel@gmail.com`/`password`).
- [ ] Token JWT solo en `localStorage`.
- [ ] Sin secretos commiteados (verificado).
- [ ] Rotar secrets del backend (OAuth, `JWT_SECRET`, nueva `APP_KEY`).
- [ ] `APP_DEBUG=false` en el backend.
- [ ] CORS restringido solo a `https://vibeer.com`.
- [ ] Imagen multi-stage: runtime final = `dist/spa` + nginx, sin `node_modules` ni código fuente.
- [ ] En el VPS único: **no hay contenedor frontend corriendo** — solo el `dist` extraído en `/var/www/backendMusic/spa` (ahorro de RAM en 512MB).
- [ ] Certs fuera de la imagen (`/certs` montado en runtime).
- [ ] Cache de `index.html` deshabilitado.

---

## 10. Resumen de archivos

| Archivo | Acción | Estado | Descripción |
|---------|--------|--------|-------------|
| `.env.production` | CREAR | ✅ hecho | `VUE_APP_API_URL=https://api.vibeer.com` (documentación) |
| `.env.development` | CREAR | ✅ hecho | `VUE_APP_API_URL=http://localhost:8000` |
| `quasar.conf.js` | MODIFICAR | ✅ hecho | `build.env` + `backendUrl` desde `apiUrl` (§3.2) |
| `src/boot/axios.js` | MODIFICAR | ✅ hecho | `baseURL` desde env (fallback localhost) |
| `src/App.vue` | MODIFICAR | ✅ hecho | `JSON.parse` del token |
| `src/pages/Auth/Login.vue` / `Register.vue` | MODIFICAR | ✅ hecho | credenciales vacías |
| `Dockerfile.prod` | CREAR | ✅ hecho | multi-stage node:18 → nginx:1.25 con `dist` (§5.1) |
| `Docker/nginx/default.conf` | CREAR | ✅ hecho | SPA fallback + HTTPS (imagen; en el VPS la SPA la sirve el nginx del backend, §6) |
| `docker-compose.prod.yml` | CREAR | ✅ hecho | Build-only en el VPS único (80/443 si se corre standalone) (§5.3) |
| `Docker/certs/real/.gitkeep` | CREAR | ✅ hecho | Montaje de certs reales (certbot) |
| `.dockerignore` | CREAR | ✅ hecho | Excluye `node_modules`, `dist`, `Docker/certs` |
| Backend `.env` | MODIFICAR | en deploy | `APP_URL`, `FRONTEND_APP`, redirects OAuth |

> **Sin scripts**: todo el despliegue son comandos one-off de §7. No hay `.sh`, cron ni tareas programadas (el frontend solo sirve estáticos; el scheduler/cola del backend se manejan según `PDP_Vibeer.md`).