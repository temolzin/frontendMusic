<template>
  <img src="~assets/wave.png" class="wave" alt="login-wave" />
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center">
      <img src="~assets/login.svg" class="responsive" alt="login-image" />
    </div>
    <div
      v-bind:class="{
        'justify-center': $q.screen.md || $q.screen.sm || $q.screen.xs,
      }"
      class="col-12 col-md-6 flex content-center"
    >
      <q-card
        v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '50%' }"
      >
        <q-card-section>
          <q-avatar size="103px" class="absolute-center shadow-10">
            <img src="~assets/avatar.svg" alt="avatar" />
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <h2 class="text-h2 text-uppercase q-my-none text-weight-regular">
                Login
              </h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="submitForm">
            <q-input label="email" v-model="login.email"> </q-input>
            <q-input
              label="Password"
              type="password"
              v-model="login.password"
            ></q-input>

            <div>
              <q-btn
                class="full-width"
                color="primary"
                label="Login"
                type="submit"
                rounded
              ></q-btn>
              <div class="text-center q-mt-sm q-gutter-lg">
                <router-link class="text-dark" to="/login">
                  Olvide mi contraseña
                </router-link>
                <router-link class="text-dark" to="/register">
                  Crear cuenta
                </router-link>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions } from "vuex";
import { ref } from "vue";
import { mapGetters } from "vuex";

let $q;

export default {
  name: "Login",
  data() {
    return {
      login: {
        email: "angel@gmail.com",
        password: "angel",
      },
    };
  },
  methods: {
    ...mapActions("auth", ["doLogin"]),
    async submitForm() {
      if (!this.login.email || !this.login.password) {
        $q.notify({
          type: "negative",
          message: "Los datos no son validos.",
        });
      } else if (this.login.password.length < 4) {
        $q.notify({
          type: "negative",
          message: "La contraseña debe de ser mayor a 6 carácteres.",
        });
      } else {
        try {
          await this.doLogin(this.login);
          const toPath = this.$route.query.to || "/dashboard/home";

          this.$router.push(toPath);
        } catch (err) {
          if (err.response.data.error) {
            $q.notify({
              type: "negative",
              message: err.response.data.error,
            });
          }
        }
      }
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
  },
};
</script>

<style scoped>
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
</style>
