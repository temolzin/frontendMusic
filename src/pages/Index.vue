<template>
  <!-- Inicio Parallax Banner  -->
  <div class="q-pa-none">
    <q-parallax :speed="0.5">
      <template v-slot:media>
        <img
          src="https://cdn.pixabay.com/photo/2020/02/06/08/19/band-4823341_960_720.jpg"
          class="image-banner"
        />
      </template>
      <div class="text-h1 text-grey-2 text-center text-weight-bold">
        Música GSM
      </div>
      <div
        class="line"
        :style="
          mode ? 'background-color: #FF78A5;' : 'background-color: #094FAB;'
        "
      ></div>
      <div class="text-grey-3 text-center text-weight-regular">
        Disfruta la nueva experiencia de contratación de servicios musicales
        rapida y segura.
      </div>
      <q-separator />
    </q-parallax>
  </div>
  <!-- Fin Parallax Banner  -->

  <!-- Inicio de presupuesto -->
  <div class="row justify-center up-card">
    <q-card class="my-card shadow-8" style="width: 950px">
      <q-card-section class="row justify-center">
        <div class="col-12 col-xs-6 col-sm-3 col-md-3 q-pa-sm">
          <h6 class="q-ma-none">¿Qué necesitas?</h6>
          <q-select filled :options="options" label="Seccionar" />
        </div>
        <div class="col-12 col-xs-6 col-sm-3 col-md-3 q-pa-sm">
          <h6 class="q-ma-none">¿Cuándo?</h6>
          <q-input filled type="date" />
        </div>
        <div class="col-12 col-xs-6 col-sm-4 col-md-4 q-pa-sm">
          <h6 class="q-ma-none">¿Doné será el evento?</h6>
          <q-input filled label="Ejemplo: Ciudad de México, Puebla ,México" />
        </div>
        <div class="col-12 col-xs-6 col-sm-2 col-md-2 q-pa-sm">
          <h6 class="q-ma-none">ㅤㅤ</h6>
          <q-btn v-ripple class="" color="primary" label="Pedir Presupuesto" />
        </div>
      </q-card-section>
    </q-card>
  </div>
  <!-- Fin de presupuesto -->

  <!-- Inicio de Últimos Registrados -->
  <div class="row justify-center">
    <div class="text-center col-12 q-mt-lg">
      <h6 class="q-mt-xl q-mb-sm" style="letter-spacing: 3px">
        <small class="text-primary">NUESTROS ÚLTIMOS</small>
      </h6>
      <h4 class="q-mt-none text-weight-bolder" style="letter-spacing: 3px">
        GRUPOS REGISTRADOS
      </h4>
    </div>

    <div class="col-12 col-xs-12 col-sm-3 col-md-3 q-mt-md">
      <q-card class="my-card q-ma-md">
        <q-img
          src="https://cdn.pixabay.com/photo/2016/09/27/23/03/guitar-1699501_960_720.jpg"
          class="card-img"
        >
          <div class="absolute-bottom">
            <div class="strech">
              <div class="text-h6 text-weight-bolder title-card text-grey-3">
                Grupo México vivo
              </div>
              <div class="q-gutter-md q-mb-md">
                <q-badge outline color="primary" label="Outline" />
                <q-badge outline color="orange" label="Outline" />
                <q-badge outline color="secondary" label="Outline" />
              </div>
              <div class="text-subtitle2 text-weight-light text-grey-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </div>
            </div>
          </div>
        </q-img>
        <q-btn
          color="primary"
          icon="arrow_forward"
          class="absolute"
          style="top: 0; right: 0px; transform: translateY(1120%)"
        />
      </q-card>
    </div>

    <div class="col-12 col-xs-12 col-sm-3 col-md-3 q-mt-md">
      <q-card class="my-card q-ma-md">
        <q-img
          src="https://cdn.pixabay.com/photo/2020/07/23/11/58/man-5431169_960_720.jpg"
          class="card-img"
        >
          <div class="absolute-bottom">
            <div class="strech">
              <div class="text-h6 text-weight-bolder title-card text-grey-3">
                Grupo México vivo
              </div>
              <div class="q-gutter-md q-mb-md">
                <q-badge outline color="primary" label="Outline" />
                <q-badge outline color="orange" label="Outline" />
                <q-badge outline color="secondary" label="Outline" />
              </div>
              <div class="text-subtitle2 text-weight-light text-grey-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </div>
            </div>
          </div>
        </q-img>
        <q-btn
          color="primary"
          icon="arrow_forward"
          class="absolute"
          style="top: 0; right: 0px; transform: translateY(1120%)"
        />
      </q-card>
    </div>

    <div class="col-12 col-xs-12 col-sm-3 col-md-3 q-mt-md">
      <q-card class="my-card q-ma-md">
        <q-img
          src="https://cdn.pixabay.com/photo/2016/11/21/13/36/man-1845432_960_720.jpg"
          class="card-img"
        >
          <div class="absolute-bottom">
            <div class="strech">
              <div class="text-h6 text-weight-bolder title-card text-grey-3">
                Grupo México vivo
              </div>
              <div class="q-gutter-md q-mb-md">
                <q-badge outline color="primary" label="Outline" />
                <q-badge outline color="orange" label="Outline" />
                <q-badge outline color="secondary" label="Outline" />
              </div>
              <div class="text-subtitle2 text-weight-light text-grey-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </div>
            </div>
          </div>
        </q-img>
        <q-btn
          color="primary"
          icon="arrow_forward"
          class="absolute"
          style="top: 0; right: 0px; transform: translateY(1120%)"
        />
      </q-card>
    </div>
  </div>
  <!-- Fin de Últimos Registrados -->

  <!-- Inicio de aviso -->
  <div class="row justify-center">
    <div class="col-12 col-xs-12 col-sm-6 col-md-9 q-ma-md">
      <q-banner :class="mode ? 'bg-dark-3 ' : 'bg-grey-3 '" rounded>
        <template v-slot:avatar>
          <q-icon name="health_and_safety" color="primary" />
        </template>
        <span class="text-weight-bold text-info">Reserva con Seguridad</span>,
        si cancelas por COVID-19 te devolvemos el dinero. Musica GSM vela por
        <span class="text-weight-bold"> tu seguridad y la de los tuyos</span>
      </q-banner>
    </div>
  </div>
  <!-- Fin de aviso -->

  <!-- Inicio de aviso para registrar email -->
  <div
    class="row justify-center text-white q-mb-xs"
    :style="mode ? 'background-color: #1c2331' : 'background-color: #094FAB'"
  >
    <div class="col-2" v-if="$q.screen.gt.sm">
      <q-icon name="email" size="200px" class="q-mt-xl" />
    </div>
    <div class="col-12 col-xs-12 col-md-6">
      <div class="text-h6 text-weight-bold q-mt-xl q-mb-xl q-pa-lg">
        ¿QUIERES SER EL PRIMERO EN LA LÍNEA?
        <div class="row q-mt-md">
          <q-input
            :bg-color="mode ? 'dark' : 'white'"
            label="Ingresa tu correo electrónico"
            rounded
            outlined
            class="col-12 col-xs-6 col-sm-8 col-md-8 q-mr-md q-mt-md"
            dense
            :label-color="mode ? 'white' : 'dark'"
            v-model="email"
          >
            <template v-slot:prepend>
              <q-icon v-if="email === ''" name="search" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="email = ''"
              />
            </template>
          </q-input>
          <q-btn
            label="REGÍSTRATE"
            color="primary"
            class="col-12 col-xs-6 col-sm-4 col-md-3 q-mt-md"
            rounded
          />
        </div>
        <p class="q-mt-lg text-weight-bold" style="font-size: 14px">
          Política de privacidad
        </p>
        <p class="text-weight-regular" style="font-size: 12px">
          The Ticket Factory es un nombre comercial del Grupo NEC . El Grupo NEC
          desea enviarle boletines informativos y otros correos electrónicos
          sobre nuestros gares y eventos que creemos que pueden interesarle . Al
          registrarse , acepta recibirlos .
        </p>
        <p class="text-weight-regular" style="font-size: 12px">
          Para obtener más información sobre las empresas de The NEC Group y
          cómo utilizamos su información , consulte nuestra Política de
          privacidad .
        </p>
      </div>
    </div>
  </div>
  <!-- Fin de aviso para registrar email -->
</template>
<script>
export default {
  setup() {
    return {
      options: ["Google", "Facebook", "Twitter", "Apple", "Oracle"],
      email: "",
    };
  },
  computed: {
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
};
</script>

<style scoped>
.image-banner {
  object-fit: cover;
  height: 100vh;
  width: 100vw;
}
.up-card {
  z-index: 2;
  margin-top: -80px;
}
.card-img {
  min-height: 450px;
  max-height: 450px;
  object-fit: cover;
}
.title-card {
  font-size: 30px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.strech {
  margin: 25px;
}
.line {
  width: 40%;
  height: 3px;
  background-color: white;
  margin-bottom: 5px;
}
</style>
