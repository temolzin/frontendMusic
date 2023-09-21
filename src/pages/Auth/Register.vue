<template>
  <div
    class="col-12 col-md-6 flex content-center justify-center"
    :class="mode ? 'bg-modedark' : 'bg-primary'"
    v-bind:style="{ height: '63em' }"
  >
    <q-card
      class="my-card shadow-box shadow-2"
      :class="`shadow-10`"
      flat
      v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '60%' }"
    >
      <q-card-section horizontal>
        <q-img
          class="col-5 col-sm-1 col-md-5"
          src="https://cdn.pixabay.com/photo/2021/01/29/08/10/musician-5960112_960_720.jpg"
          v-bind:style="$q.screen.lt.sm ? { width: '0%' } : { width: '40%' }"
        />

        <q-card-section
          class="col-7 col-sm-12 col-md-7"
          v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '60%' }"
        >
          <div class="row">
            <div class="col-6 text-left q-px-md" style="font-size: 2em">
              <q-btn round flat icon="fas fa-arrow-left" to="/" />
            </div>
            <div class="col-6 text-right q-px-md" style="font-size: 2em">
              <q-btn
                round
                color="primary"
                icon="fas fa-solid fa-cloud-moon"
                to="/"
              />
            </div>
          </div>
          <q-form
            class="q-gutter-md q-px-lg q-py-lg q-px-xl"
            @submit.prevent="submitForm"
          >
            <p class="text-center q-mb-lg text-weight-regular text-h3">
              Regístrate
            </p>
            <p class="text-center q-mb-sm text-weight-light">
              Se parte de esta nueva experiencia de contratación de servicios
              musicales
            </p>

            <q-input
              label="Nombre *"
              v-model="user.name"
              hint="Incluye tus apellidos"
            >
            </q-input>
            <q-input
              label="Correo electrónico *"
              v-model="user.email"
              hint="Incluye un correo que uses frecuentemente"
            >
            </q-input>
            <q-input
              v-model="user.password"
              :type="isPwd ? 'password' : 'text'"
              hint=""
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="q-pt-sm">
              <q-btn
                class="full-width"
                color="primary"
                label="Crear mi cuenta"
                type="submit"
                v-if="loading"
              >
              </q-btn>
              <q-btn
                class="full-width"
                color="primary"
                label="Cargando..."
                disable
                type="button"
                v-else
              >
              </q-btn>

              <div class="q-mt-md text-center">
                <p><u>O</u></p>
                <div class="col-12">
                  <q-btn
                    class="full-width"
                    v-if="loadingGmail"
                    outline
                    style="color: red"
                    no-caps
                    @click="loginGmail"
                  >
                    <!-- Fin de icono Gmail-->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      height="24"
                      width="24"
                    >
                      <path
                        fill="#4285f4"
                        d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"
                      ></path>
                      <path
                        fill="#34a853"
                        d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"
                      ></path>
                      <path
                        fill="#fbbc02"
                        d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"
                      ></path>
                      <path
                        fill="#ea4335"
                        d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"
                      ></path>
                    </svg>
                    <!-- Fin de icono -->
                    <label>Continuar con Google</label>
                  </q-btn>

                  <q-btn outline disable style="color: red" no-caps v-else>
                    <q-icon left size="1.5em" name="email" />
                    <label>Cargando...</label>
                  </q-btn>
                </div>
                <div class="col-12">
                  <q-btn
                    outline
                    color="primary"
                    no-caps
                    class="q-mt-md full-width"
                    v-if="loadingFacebook"
                    @click="loginFacebook"
                  >
                    <!-- Inicio icono Facebook-->
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.5 12.058c0-5.28-4.253-9.558-9.5-9.558s-9.5 4.279-9.5 9.558c0 4.771 3.473 8.725 8.016 9.442v-6.68H8.104v-2.762h2.412V9.952c0-2.395 1.417-3.718 3.588-3.718 1.04 0 2.126.186 2.126.186v2.352h-1.198c-1.18 0-1.548.738-1.548 1.494v1.792h2.635l-.421 2.763h-2.214V21.5c4.543-.717 8.016-4.67 8.016-9.442z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <!-- fin de icono -->

                    <label>Continuar con Facebook</label>
                  </q-btn>
                </div>
              </div>

              <p class="text-center q-mt-md">
                Al continuar, estás aceptando los
                <u>Términos y condiciones de uso</u>. Consulta nuestra
                <u>Política de privacidad</u>.
              </p>

              <div class="text-center">
                ¿Ya tienes una cuenta?
                <router-link class="text-primary" to="/login">
                  Iniciar sesión
                </router-link>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { useQuasar } from "quasar";
import { mapActions } from "vuex";
import { ref } from "vue";
import { mapGetters } from "vuex";

let $q;

export default {
  name: "Register",
  data() {
    return {
      isPwd: ref(true),
      user: {
        name: "Miguel Angel Gómez Gómez",
        email: "angel@gmail.com",
        password: "password",
      },
      loading: true,
      loadingGmail: true,
      loadingFacebook: true,
    };
  },
  methods: {
    ...mapActions("auth", ["registerUser"]),
    ...mapActions("auth", ["doLoginGmail"]),
    ...mapActions("auth", ["doLoginFacebook"]),
    async submitForm() {
      this.loading = false;
      if (!this.user.email || !this.user.password || !this.user.name) {
        $q.notify({
          type: "negative",
          message: "Los datos no son validos.",
        });
      } else if (this.user.password.length < 4) {
        $q.notify({
          type: "negative",
          message: "La contraseña debe de ser mayor a 6 carácteres.",
        });
      } else {
        try {
          await this.registerUser(this.user);
          $q.notify({
            type: "positive",
            message: "Usuario registrado",
          });
          const toPath = this.$route.query.to || "/login";
          this.$router.push(toPath);
          this.loading = true;
        } catch (err) {
          $q.notify({
            type: "negative",
            message: err.response.data.errors.email,
          });

          if (err.response.data.error) {
            $q.notify({
              type: "negative",
              message: err.response.data.error,
            });
          }
          this.loading = true;
        }
      }
    },

    async loginGmail() {
      this.loadingGmail = false;
      await this.doLoginGmail();
      this.loadingGmail = true;
    },
    async loginFacebook() {
      this.loadingFacebook = false;
      await this.doLoginFacebook();
      this.loadingFacebook = true;
    },
  },
  mounted() {
    $q = useQuasar();
  },
  created() {
    if (this.isAuthenticated) {
      const toPath = this.$route.query.to || "/product";
      this.$router.push(toPath);
      //console.log("SESSION");
    }
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
};
</script>

<style lang="sass" scoped>
.shadow-box
  margin: 25px
  border-radius: 20px
  font-size: 12px
</style>
