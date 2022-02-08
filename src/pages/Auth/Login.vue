<template>
  <div
    v-bind:class="{
      'justify-center': $q.screen.md || $q.screen.sm || $q.screen.xs,
    }"
    class="col-12 col-md-6 flex content-center bg-primary"
    v-bind:style="{ height: '52em' }"
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
          src="https://cdn.pixabay.com/photo/2019/12/18/04/11/dj-4702977_960_720.jpg"
          v-bind:style="$q.screen.lt.sm ? { width: '0%' } : { width: '40%' }"
        />

        <q-card-section
          class="col-7 col-sm-12 col-md-7"
          v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '60%' }"
        >
          <div class="col-6 text-right q-px-md" style="font-size: 2em">
            <q-btn round color="primary" icon="shopping_cart" to="/" />
          </div>

          <q-form
            class="q-gutter-md q-px-lg q-py-lg q-px-xl"
            @submit.prevent="submitForm"
          >
            <h3 class="text-center text-weight-medium">Sign Up</h3>
            <p class="text-center q-mb-lg text-weight-light">
              In the example below, when using the icon-selected prop.
            </p>

            <q-input label="Email Adress" v-model="login.email"> </q-input>
            <q-input label="Password" type="password" v-model="login.password">
            </q-input>

            <div class="q-pt-lg">
              <q-btn
                class="full-width"
                color="primary"
                label="Login"
                type="submit"
                v-if="loading"
                rounded
              ></q-btn>
              <q-btn
                class="full-width"
                color="primary"
                label="Loading..."
                disable
                type="button"
                v-else
                rounded
              ></q-btn>

              <div class="q-mt-md text-center">
                <p><u>Or</u></p>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-btn
                    v-if="loadingGmail"
                    outline
                    style="color: red"
                    no-caps
                    @click="loginGmail"
                  >
                    <q-icon left size="1.5em" name="email" />
                    <label>Sign Up with Google</label>
                  </q-btn>
                  <q-btn outline disable style="color: red" no-caps v-else>
                    <q-icon left size="1.5em" name="email" />
                    <label>Loading...</label>
                  </q-btn>
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-btn outline style="color: blue" no-caps class="q-mt-md">
                    <q-icon left size="1.5em" name="facebook" />
                    <label>Sign Up with Facebook</label>
                  </q-btn>
                </div>
              </div>

              <div class="text-center q-mt-lg q-mb-lg q-gutter-lg">
                <div class="row">
                  <router-link
                    class="text-dark col-12 col-sm-12 col-md-6 q-mt-sm"
                    to="/login"
                  >
                    Olvide mi contraseña
                  </router-link>
                  <router-link
                    class="text-dark col-12 col-sm-12 col-md-6 q-mt-sm"
                    to="/register"
                  >
                    Crear cuenta
                  </router-link>
                </div>
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
import { mapGetters } from "vuex";

let $q;

export default {
  name: "LoginIn",
  data() {
    return {
      login: {
        email: "angel@gmail.com",
        password: "angel",
      },
      loading: true,
      loadingGmail: true,
    };
  },
  methods: {
    ...mapActions("auth", ["doLogin"]),
    ...mapActions("auth", ["doLoginGmail"]),
    async submitForm() {
      this.loading = false;
      if (!this.login.email || !this.login.password) {
        $q.notify({
          type: "negative",
          message: "Los datos no son validos.",
        });
        this.loading = true;
      } else if (this.login.password.length < 4) {
        $q.notify({
          type: "negative",
          message: "La contraseña debe de ser mayor a 6 carácteres.",
        });
        this.loading = true;
      } else {
        try {
          await this.doLogin(this.login).then(() => {
            const toPath = this.$route.query.to || "/authorize/login";
            this.$router.push(toPath);
          });
        } catch (err) {
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
  },
  mounted() {
    $q = useQuasar();
  },
  created() {
    if (this.isAuthenticated) {
      // const toPath = this.$route.query.to || "/product";
      // this.$router.push(toPath);
      console.log("SESSION");
    }
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
  },
};
</script>

<style lang="sass" scoped>
.shadow-box
  margin: 25px
  border-radius: 20px
  font-size: 12px
</style>
