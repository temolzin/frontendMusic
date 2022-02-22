<template>
  <div class="q-ma-none">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide
        :name="1"
        img-src="https://cdn.pixabay.com/photo/2017/03/13/17/26/ecommerce-2140603_960_720.jpg"
      >
        <div class="absolute-center custom-caption">
          <div class="text-h2">Observa tus ventas</div>
          <div class="text-subtitle1">
            Ve tus ventas generadas a lo largo del tiempo y las que aún te
            faltan.
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" />
        </div>
      </q-carousel-slide>

      <q-carousel-slide
        :name="2"
        img-src="https://cdn.pixabay.com/photo/2017/08/14/04/48/ceiling-2639360_960_720.jpg"
      >
        <div class="absolute-center custom-caption">
          <div class="text-h2">Obten tu membrecía</div>
          <div class="text-subtitle1">
            Con la membrecía puedes hacer más, <b>¡Generar más!</b>
            Con ella puedes obtener beneficios como aparecer en las primeras
            opciones de búsqueda, descuentos y mucho más.
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" />
        </div>
      </q-carousel-slide>

      <q-carousel-slide
        :name="3"
        img-src="https://cdn.pixabay.com/photo/2021/11/25/14/37/singer-6823783_960_720.png"
      >
        <div class="absolute-center custom-caption">
          <div class="text-h2">Manten actulizada tu información</div>
          <div class="text-subtitle1">
            Recuerda siempre tener la información de tu maneger actualizada para
            que puedan contactarlos de manera rápida y efectiva.
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" />
        </div>
      </q-carousel-slide>

      <q-carousel-slide
        :name="4"
        img-src="https://cdn.pixabay.com/photo/2017/07/10/23/43/question-mark-2492009_960_720.jpg"
      >
        <div class="absolute-center custom-caption">
          <div class="text-h2">¿Tienes alguna duda?</div>
          <div class="text-subtitle1">
            Cualquier duda o aclaración mándanos mensaje al correo info@root.com
            o al teléfono +52 55 43 22 32.
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      slide: ref(1),
      autoplay: ref(true),
    };
  },
};
</script>

<style lang="sass" scoped>
.custom-caption
  width: 90%
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)
  border-radius:10px
</style>
