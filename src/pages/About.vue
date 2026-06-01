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
            <div class="responsive-text" id="text">
              No pierdas esta oportunidad de hacer realidad tus sueños y contratar a
              tu artista favorito para un evento inolvidable. Regístrate ahora y comienza a planificar tu experiencia única con nosotros.
              ¡No esperes más, el escenario está listo para ti!
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" :to="isLoggedIn ? '/artist-list' : '/register'"/>
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
            <div class="responsive-text" id="text">
              ¡Si tienes un talento musical excepcional, nosotros tenemos la plataforma perfecta para
              impulsar tu carrera artística y hacerte conocido en todo el mundo! Contáctanos hoy mismo y
              te registraremos para darle alas a tu sueño musical.
            </div>
            <q-btn v-if="!isLoggedIn" outline label="Ver más" class="q-mt-md" to="/login" />
            <q-btn v-if="isLoggedIn && userRole === 'artista'" outline label="Ver más" class="q-mt-md" @click="scrollToGrupo" />
          </div>
      </q-carousel-slide>
    </q-carousel>
  </div>

  <div class="q-pa-md row items-start q-gutter-md">

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Paso 1</div>
          <div class="text-h6 q-mt-sm q-mb-xs">Regístrate con nosostros</div>
          <div class="text-caption">
              Ingresa a nuestra app y regístrate de manera rápida y sencilla.
              Solo necesitas unos minutos  para crear tu cuenta y estará todo listo.
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.pixabay.com/photo/2018/07/12/21/32/subscribe-3534409_1280.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />
      <q-card-actions v-if="!isLoggedIn">
        <q-btn flat color="primary" to="/register">
          Ir
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Paso 2</div>
          <div class="text-h6 q-mt-sm q-mb-xs">Explora Nuestro Catálogo</div>
          <div class="text-caption">
            Descubre a tus artistas favoritos en nuestro amplio catálogo. Tenemos a los mejores exponentes de la música en un solo lugar, desde los más famosos hasta tus próximos grandes descubrimientos.
          </div>
        </q-card-section>
        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_1280.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />
      <q-card-actions>
        <q-btn flat color="primary" :to="getRouteFor(2)">
          Ir
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Paso 3</div>
          <div class="text-h6 q-mt-sm q-mb-xs">Selecciona a tu Artista</div>
          <div class="text-caption">
            Elige a tu artista favorito Ya sea un concierto privado, una aparición especial o una charla exclusiva, nosotros lo haremos posible.
          </div> 
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.pixabay.com/photo/2018/09/20/15/35/directory-3691159_1280.jpg"
          />
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat color="primary" :to="getRouteFor(3)">
          Ir
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Paso 4</div>
          <div class="text-h6 q-mt-sm q-mb-xs">Contrata a tu Artista Favorito!</div>
          <div class="text-caption">
            Una vez que estés completamente satisfecho con todos los detalles,
            confirma desde nuestra aplicación de forma rápida y segura.
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.pixabay.com/photo/2015/11/26/07/47/hands-1063442_1280.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />
      <q-card-actions>
        <q-btn flat color="primary" :to="getRouteFor(4)">
          Ir
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card id="register-group" class="groupMusical" v-if="userRole === 'artista'">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.pixabay.com/photo/2020/10/20/09/25/band-5669941_1280.jpg">
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
          src="https://cdn.pixabay.com/photo/2018/03/31/23/27/people-3279617_1280.jpg"
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
          Reservar
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { mapState } from "vuex"; 

export default {
  data() {
    return {
      slide: ref('style'),
      isLoggedIn: Boolean(localStorage.getItem('token')) 
    };
  },
  computed: {
    ...mapState({
      authState: (state) => state.auth || {}
    }),
    userRole() {
      return this.authState?.me?.role?.[0]
        ? String(this.authState.me.role[0]).trim().toLowerCase() 
        : '';
    }
  },
  methods: {
    scrollToGrupo() {
      document.getElementById('register-group')?.scrollIntoView({ behavior: 'smooth' });
    },
    getRouteFor(Step) {
      const ruoteClient = {
        2: '/client/musical-genders',
        3: '/client/store',
        4: '/client/shopping-cart'
      };

      const routeOtherRole = {
        2: '/artist-list',
        3: '/artist-list',
        4: '/artist-list'
      };

      return !this.isLoggedIn 
        ? '/login' 
        : (this.userRole === 'cliente' ? ruoteClient[Step] : routeOtherRole[Step]);
    }
  }
};
</script>

<style lang="css" scoped>
.my-card {
  height: 100%;
  max-width: 323px;
  margin: 5px;
}
  
.groupMusical {
  width: 800px;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 767px) {
  #text {
    font-size: 11px;
  }
}
  
</style>
