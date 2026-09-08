<template>
  <div class="error-page">
    <div class="error-card">

      <div class="staff-lines"></div>

      <div class="logo-wrap">
        <img src="/logovibeer-black.png" alt="Vibeer" class="logo-img" />
      </div>

      <div class="error-code">404</div>

      <div class="wave-deco">〜♩〜♪〜♫〜</div>

      <div class="error-title">Página no encontrada</div>

      <p class="error-msg">
        Esta nota no existe en nuestra partitura.<br />
        Regresa y sigue disfrutando la música.
      </p>

      <q-btn
        unelevated
        to="/"
        label="Volver al Inicio"
        class="back-btn"
        no-caps
      />

    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Error404'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;700&display=swap');

.error-page {
  min-height: 100vh;
  background: #eef2f7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 52px 56px 48px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 12px 48px rgba(9, 79, 171, 0.12);
  position: relative;
  overflow: hidden;
}

.error-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 6px;
  background: #1c2331;
}

.error-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1c2331, #094FAB, #FF78A5, #094FAB, #1c2331);
}

.staff-lines {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
}

.staff-lines::before {
  content: '';
  position: absolute;
  top: 28%; left: 0; right: 0;
  height: 56px;
  opacity: 0.04;
  background: repeating-linear-gradient(
    to bottom,
    #094FAB 0px, #094FAB 1px,
    transparent 1px, transparent 13px
  );
}

.logo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 24px;
  width: 100%;
}

.logo-img {
  width: 200px;
  height: auto;
  object-fit: contain;
  display: block;
}

.error-code {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 112px;
  line-height: 1;
  color: #094FAB;
  margin-bottom: 2px;
}

.wave-deco {
  font-size: 18px;
  letter-spacing: -1px;
  color: #FF78A5;
  margin-bottom: 14px;
  opacity: 0.85;
}

.error-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #1c2331;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.error-msg {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  color: #6b7a99;
  line-height: 1.75;
  margin-bottom: 32px;
}

.back-btn {
  background: #1c2331 !important;
  color: #ffffff !important;
  border-radius: 50px !important;
  padding: 12px 44px !important;
  font-family: 'Space Grotesk', sans-serif !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 1.5px !important;
  transition: background 0.2s ease !important;
}

.back-btn:hover {
  background: #094FAB !important;
}
</style>
