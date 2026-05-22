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
        img-src="https://cdn.pixabay.com/photo/2017/01/18/17/14/girl-1990347_960_720.jpg"
      >
        <div class="absolute-center custom-caption">
          <div class="text-h2">Ofertas Imperdibles</div>
          <div class="text-subtitle1">
            ¡Haz que tu evento brille sin gastar de más! Descubre agrupaciones 
            con descuentos.
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" to="/artist-list"/>
        </div>
      </q-carousel-slide>

      <q-carousel-slide
        :name="2"
        img-src="https://cdn.pixabay.com/photo/2014/12/25/17/33/mariachis-579814_960_720.jpg"
      >
        <div class="absolute-center custom-caption">
          <div class="text-h2">¿Mariachis?</div>
          <div class="text-subtitle1">
            ¡Activa la fiesta!. No esperes más... Aquí encontraras los mejores
            mariachis de la región
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" to="/client/musical-genders/mariachi"/>
        </div>
      </q-carousel-slide>

      <q-carousel-slide
        :name="3"
        img-src="https://cdn.pixabay.com/photo/2014/05/21/15/18/musician-349790_960_720.jpg"
      >
        <div class="absolute-center custom-caption">
          <div class="text-h2">Mis Compras</div>
          <div class="text-subtitle1">
            Revisa el historial de los 
            artistas y agrupaciones que ya contrataste.
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" to="/client/shopping-cart/view-my-order-details"/>
        </div>
      </q-carousel-slide>

      <q-carousel-slide
        :name="4"
        img-src="https://cdn.pixabay.com/photo/2019/10/03/21/17/bandoneon-4524437_960_720.jpg"
      >
        <div class="absolute-center custom-caption">
          <div class="text-h2">Música para cada momento</div>
          <div class="text-subtitle1">
            Explora nuestra amplia variedad 
            de géneros y encuentra al artista que hará vibrar a tus invitados.
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" to="/client/musical-genders"/>
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
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)
  border-radius:10px
</style>
