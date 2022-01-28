<template>
  <div
    v-bind:class="{
      'justify-center': $q.screen.md || $q.screen.sm || $q.screen.xs,
    }"
    class="col-12 col-md-6 flex content-center bg-primary"
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
          <div class="col-6 text-right q-px-md" style="font-size: 2em">
            <q-btn round color="primary" icon="shopping_cart" to="/" />
          </div>
          <q-form
            class="q-gutter-md q-px-lg q-py-lg q-px-xl"
            @submit.prevent="submitForm"
          >
            <h3 class="text-center text-weight-medium">Create your account</h3>
            <p class="text-center q-mb-lg text-weight-light">
              In the example below, when using the icon-selected prop.
            </p>

            <q-input label="Name" v-model="user.name"> </q-input>
            <q-input label="Email Adress" v-model="user.email"> </q-input>
            <q-input
              v-model="user.password"
              :type="isPwd ? 'password' : 'text'"
              hint="Password with toggle"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="q-pt-lg">
              <q-btn
                class="full-width"
                color="primary"
                label="Create my account"
                type="submit"
                rounded
              ></q-btn>

              <div class="q-mt-md text-center">
                <p><u>Or</u></p>
                <div class="col-12 col-sm-6 col-md-6">
                  <q-btn outline style="color: red" no-caps>
                    <q-icon left size="1.5em" name="email" />
                    <label>Sign Up with Google</label>
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
                <router-link
                  class="text-dark col-12 col-sm-12 col-md-6 q-mt-sm"
                  to="/login"
                >
                  Already have an account? Sign in
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
        password: "angel",
      },
    };
  },
  methods: {
    ...mapActions("auth", ["registerUser"]),
    async submitForm() {
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
            message: "User added",
          });
          const toPath = this.$route.query.to || "/login";
          this.$router.push(toPath);
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

<style lang="sass" scoped>
.shadow-box
  margin: 25px
  border-radius: 20px
  font-size: 12px
</style>
