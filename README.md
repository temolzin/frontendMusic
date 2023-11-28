# Quasar App(proyecto-musica)

Proyecto FRONT-END del Sistema Gestión de Música, es un sistema híbrido que pueda ser usado en aplicación web como en una aplicación para teléfonos inteligentes Android, su finalidad es una aplicación que de publicidad a grupos musicales y puedan ser contratados por cualquier persona a través del sistema, obteniendo ganancias por cada contratación.

Para su ejecutación se deben de crear las siguientes dependencias:

## Configuración de OpenPay

En el archivo quasar.conf.js configurar con sus llaves propias las credenciales de OpenPay, las cuales se obtienen registrandote en OpenPay y scrolleando.
Las variables a rellenar son:
    - OpenPayID: 'tu-openpay-id',
    - OpenPayKey: 'tu-openpay-key(la que inicia con pk)', 
    - OpenPaySanboxMode: true(Si se usa el ambiente de pruebas o el de producción)

## npm install

Este comando nos sirve para instalar paquetes. Los paquetes se descargarán y se meterán automáticamente en una carpeta llamada node_modules.

## quasar dev

Nos ayuda a compilar y se abrirá el proyecto en el navegador predeterminado.

## Configuración de Axios

1. Entrar a la carpeta src.
2. Dirigirse a la subcarpeta boot.
3. Abrir el archivo axios.js.
4. Cambiar el parametro "const api = axios.create({ baseURL: "http://127.0.0.1:8000/" });", al nuevo servidor.

## - curl -fsSL https://kool.dev/install | bash

Para ejecutar correctamente el proyecto correctamente se necesita tener instalado kool, el cual se instala con el comando.

Este comando solo sirve en linux, por lo que para usarse en windows necesitamos instalar Windows Subsistem Linux(WSL) e instalar una versión de Linux, además tenemos que tener Docker instalado en nuestro subsistema de linux y docker compose.

## kool run setup

Este comando ejecutará la creación del contenedor de docker, instalación de dependencias e inicialización del proyecto.

## kool start

Enciende el contenedor

## kool stop

Apaga el contenedor