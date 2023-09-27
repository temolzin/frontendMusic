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
          img-src="https://cdn.pixabay.com/photo/2017/08/02/21/01/macbook-2573421_640.jpg"
        >
          <div class="absolute-center custom-caption">
            <div class="text-h2">Usuarios</div>
            <div class="text-subtitle1">
                Para mantener los registros actualizados y garantizar una gestión eficiente
                 de usuarios, te invitamos a administrar tu lista de usuarios o agregar nuevos.
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" to="/admin/users"/>
          </div>
        </q-carousel-slide>
  
        <q-carousel-slide
          :name="2"
          img-src="https://cdn.pixabay.com/photo/2018/07/12/21/32/subscribe-3534409_640.jpg"
        >
          <div class="absolute-center custom-caption">
            <div class="text-h2">Roles</div>
            <div class="text-subtitle1">
                Para garantizar una mayor seguridad, es esencial mantener actualizados y
                 gestionar de manera adecuada los roles en el sistema.
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" to="/admin/roles"/>
          </div>
        </q-carousel-slide>
  
        <q-carousel-slide
          :name="3"
          img-src="https://cdn.pixabay.com/photo/2014/05/21/15/18/musician-349790_960_720.jpg"
        >
          <div class="absolute-center custom-caption">
            <div class="text-h2">Generos Musicales</div>
            <div class="text-subtitle1">
                ¡Agrega nuevos géneros musicales y amplía nuestra increíble lista!
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" to="/admin/musical-genders/index"/>
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
  
  