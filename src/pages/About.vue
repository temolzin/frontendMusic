<q-page padding></q-page>
<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="white"
      navigation
      padding
      arrows
      height="300px"
      class="bg-primary text-white shadow-1 rounded-borders"
    >

      <q-carousel-slide name="style" class="column no-wrap flex-center"
      img-src="https://cdn.pixabay.com/photo/2016/01/10/21/05/mic-1132528_1280.jpg">
        <div class="absolute-center custom-caption">
            <div class="responsive-text">
              No pierdas esta oportunidad de hacer realidad tus sueños y contratar a
              tu artista favorito para un evento inolvidable. Regístrate ahora y comienza a planificar tu experiencia única con nosotros.
              ¡No esperes más, el escenario está listo para ti!
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" to="/login"/>
          </div>
      </q-carousel-slide>

      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/kOkQ4T5WO9E"
        />

      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center"
      img-src="https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_1280.jpg">

        <div class="absolute-center custom-caption">
            <div class="text-subtitle1">
              ¡Si tienes un talento musical excepcional, nosotros tenemos la plataforma perfecta para
              impulsar tu carrera artística y hacerte conocido en todo el mundo! Contáctanos hoy mismo y
              te registraremos para darle alas a tu sueño musical.
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" to="/login"/>
          </div>
      </q-carousel-slide>
    </q-carousel>
  </div>

  <div class="q-pa-md row items-start q-gutter-md">

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Paso 1</div>
          <div class="text-h5 q-mt-sm q-mb-xs">Regístrate</div>
          <div class="text-caption text-black">
               Ingresa a nuestra plataforma y regístrate de manera rápida y sencilla.
               Solo necesitas unos minutos para crear tu cuenta y estarás listo para comenzar.
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.pixabay.com/photo/2018/07/12/21/32/subscribe-3534409_640.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />
      <q-card-actions>
        <q-btn flat color="primary" to="/register">
          GO
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Paso 2</div>
          <div class="text-h5 q-mt-sm q-mb-xs">Explora Nuestro Catálogo</div>
          <div class="text-caption text-black">
            Descubre a tus artistas favoritos en nuestro amplio catálogo.
            Tenemos a todos tus artistas favoritos en un solo lugar..
          </div>
        </q-card-section>
        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_640.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />
      <q-card-actions>
        <q-btn flat color="primary" to="/login">
          GO
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Paso 3</div>
          <div class="text-h5 q-mt-sm q-mb-xs">Selecciona a tu Artista</div>
          <div class="text-caption text-black">
            Elige a tu artista favorito Ya sea un concierto privado, una aparición especial o una charla exclusiva, nosotros lo haremos posible.
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.pixabay.com/photo/2018/09/20/15/35/directory-3691159_640.jpg"
          />
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat color="primary" to="/login">
          GO
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Paso 4</div>
          <div class="text-h5 q-mt-sm q-mb-xs">Contrata a tu Artista Favorito!</div>
          <div class="text-caption text-black">
            Una vez que estés completamente satisfecho con todos los detalles,
             confirma desde nuestra aplicación, donde puedes realizar el pago de forma rápida y segura.
             Desde ese momento, puedes relajarte y dejar el resto en nuestras manos
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.pixabay.com/photo/2015/11/03/08/58/meeting-1019875_640.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />
      <q-card-actions>
        <q-btn flat color="primary" to="/login">
          GO
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="my-card" id="groupMusic">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.pixabay.com/photo/2020/10/20/09/25/band-5669941_640.jpg">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Registrar Grupo musical</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section horizontal>
        <q-img
          class="col-5"
          src="https://cdn.pixabay.com/photo/2018/03/31/23/27/people-3279617_640.jpg"
        />
        <q-card-section>
          ¡Potencia tu carrera musical con nuestra innovadora aplicación para grupos musicales!
          ¿Eres un grupo musical en busca de nuevas oportunidades para llevar tu música al siguiente nivel?
          ¡No busques más! Nuestra aplicación está diseñada para impulsar tu éxito y conectar contigo a tus seguidores como nunca antes.
        </q-card-section>
      </q-card-section>
      <q-separator />

      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat>
          Comunicate con nosotros
        </q-btn>
        <q-btn flat>
          7715678903
        </q-btn>
        <q-btn flat color="primary">
          Reserve
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      slide: ref('style'),
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 400px
  margin: 5
  display: inline-block

#groupMusic
  display: inline-block
  width: 100%
  max-width: 600px
  margin:  auto
</style>
