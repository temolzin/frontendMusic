<template>
  <q-page padding>
    <!-- Inicio de seccion Avatar público-->
    <div class="row q-pa-md">
      <div class="col-12 col-sm-4 col-md-4">
        <h6 class="q-mb-sm q-mt-sm">Avatar público</h6>
        <p class="q-mt-none">
          Aquí puedes subir tu avatar o cambiarlo en
          <a href="https://es.gravatar.com/">gravatar.com</a>
        </p>
      </div>
      <div class="col-12 col-sm-8 col-md-8">
        <q-card class="my-card" flat>
          <q-card-section horizontal>
            <q-card-section class="col-2 flex flex-center">
              <q-btn round>
                <q-avatar size="80px">
                  <img :src="getMe.image" />
                </q-avatar>
              </q-btn>
            </q-card-section>
            <q-card-section class="col-10 q-pt-xs">
              <q-form>
                <div class="text-overline">Subir nuevo avatar</div>
                <div class="q-mt-sm q-mb-xs">
                  <q-btn
                    dark-percentage
                    color="accent"
                    text-color="grey-9"
                    icon="cloud_upload"
                    style="width: 100px"
                  />
                </div>
                <div class="text-caption text-grey">
                  El tamaño máximo de archivo permitido es de 200KB.
                </div>
                <div class="float-right">
                  <q-btn label="Actualizar" type="submit" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- Fin de seccion Avatar público-->

    <!-- Inicio de seccion Información principal-->
    <div class="row q-pa-md">
      <div class="col-12 col-sm-4 col-md-4">
        <h6 class="q-mb-sm q-mt-sm">Configuración principal</h6>
        <p class="q-mt-none">Esta información aparecerá en su perfil</p>
      </div>
      <div class="col-12 col-sm-8 col-md-8">
        <div class="q-pa-md">
          <q-form
            @submit="onSubmitDetails"
            @reset="onResetDetails"
            class="q-gutter-md"
          >
            <q-input
              v-model="formUpdateMain.name"
              label="Nombre completo*"
              hint="Introduce tu nombre completo, para que la gente pueda reconocerte"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Por favor, escriba algo',
              ]"
            />

            <q-input
              type="email"
              v-model="formUpdateMain.email"
              label="Correo electrónico *"
              hint="Introduce tu correo electrónico."
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Por favor, escriba algo',
              ]"
            />

            <div class="float-right">
              <q-btn
                label="Cancelar"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
              <q-btn
                label="Actualizar"
                type="submit"
                color="primary"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>
    <!-- Fin de seccion Información principal-->

    <!-- Inicio de seccion Cambio de contraseña-->
    <div class="row q-pa-md">
      <div class="col-12 col-sm-4 col-md-4">
        <h6 class="q-mb-sm q-mt-sm">Cambio de contraseña</h6>
        <p class="q-mt-none">
          Al cambiar su contraseña se le pedirá ingresar la actual.
        </p>
      </div>
      <div class="col-12 col-sm-8 col-md-8">
        <div class="q-pa-md">
          <q-form
            @submit="onSubmitPassword"
            @reset="onResetPassword"
            class="q-gutter-md"
          >
            <q-input
              v-model="formUpdatePassword.newPassword"
              label="Ingresa la nueva contraseña"
              :type="isPwd ? 'password' : 'text'"
              hint="Recuerda usar caracteres especiales"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Por favor, escriba algo',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-input
              v-model="formUpdatePassword.confirmPassword"
              label="Confirmación de contraseña"
              :type="isPwdC ? 'password' : 'text'"
              hint="Ingresa la misma contraseña"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Por favor, escriba algo',
                (val) =>
                  (val && val == formUpdatePassword.newPassword) ||
                  'Las contraseñas no coinciden',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdC ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdC = !isPwdC"
                />
              </template>
            </q-input>

            <q-input
              v-model="formUpdatePassword.currentPassword"
              label="Ingresa la contraseña actual"
              :type="isPwdN ? 'password' : 'text'"
              hint="Ingresa la contraseña actual"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Por favor, escriba algo',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdN ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdN = !isPwdN"
                />
              </template>
            </q-input>

            <div class="float-right">
              <q-btn
                label="Cancelar"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
              <q-btn
                label="Actualizar"
                type="submit"
                color="primary"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>
    <!-- Fin de seccion Cambio de contraseña-->

    <!-- <div class="q-pa-md row items-center justify-center">
      <q-card class="my-card col-12 col-sm-12 col-md-6 col-lg-6">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section class="q-pa-sm">
            <q-item-label class="text-h6 q-mt-sm">
              {{ getMe.name }}
              <q-btn round color="primary" icon="edit" />
            </q-item-label>
            <q-item-label caption>{{ getMe.email }}</q-item-label>
          </q-item-section>
        </q-item>
        <hr />
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-mb-sm">
          {{ getMe }}
        </q-card-section>
      </q-card>
    </div> -->
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapGetters, mapActions } from "vuex";
let $q;

export default {
  name: "userProfile",
  data() {
    return {
      formUpdateMain: {
        name: "",
        email: "",
      },

      formUpdatePassword: {
        newPassword: "",
        confirmPassword: "",
        currentPassword: "",
      },
      isPwd: true,
      isPwdC: true,
      isPwdN: true,
    };
  },
  methods: {
    ...mapActions("auth", ["updateDetails"]),
    ...mapActions("auth", ["updatePassword"]),
    async onSubmitDetails() {
      try {
        await this.updateDetails(this.formUpdateMain);
        this.$q.notify({
          type: "positive",
          message: `Información actualizada`,
        });
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async onSubmitPassword() {
      try {
        await this.updatePassword(this.formUpdatePassword);
        this.$q.notify({
          type: "positive",
          message: `Contraseña actualizada`,
        });
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    onResetDetails() {
      this.formUpdateMain.name = this.getMe.name;
      this.formUpdateMain.email = this.getMe.email;
    },
    onResetPassword() {
      this.formUpdatePassword.newPassword = "";
      this.formUpdatePassword.confirmPassword = "";
      this.formUpdatePassword.currentPassword = "";
    },
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
  },
  created() {
    this.formUpdateMain.name = this.getMe.name;
    this.formUpdateMain.email = this.getMe.email;
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style scoped></style>
