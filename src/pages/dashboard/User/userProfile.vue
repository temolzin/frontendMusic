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
        <q-card class="my-card" flat :class="mode?'bg-dark':'bg-white'">
          <q-card-section horizontal>
            <q-card-section class="col-2 flex flex-center">
              <q-btn round>
                <q-avatar size="80px">
                  <img :src="getBackendImageUrl(getMe.image)" />
                </q-avatar>
              </q-btn>
            </q-card-section>
            <q-card-section class="col-10 q-pt-xs">
              <q-form @submit="onSubmitImageProfle" @reset="onResetDetails">
                <div class="text-overline">Subir nuevo avatar</div>
                <div class="q-mt-sm q-mb-xs">
                  <q-file
                    v-model="image_profile"
                    label="Seleccionar"
                    accept=".jpg, image/*"
                    class="q-mt-sm"
                    max-file-size="1000000"
                    counter
                    @rejected="onRejected"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop="image_profile = null"
                        class="cursor-pointer"
                      />
                    </template>

                    <template v-slot:hint>
                      La imagen puede ser jpg/jpeg/png
                    </template>
                  </q-file>
                </div>
                <div class="text-caption text-grey">
                  El tamaño máximo de archivo permitido es de 1MB.
                </div>
                <div class="float-right">
                  <q-btn color="primary" label="Actualizar" type="submit" />
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
      <div class="col-12 col-sm-8 col-md-8 q-pa-md " :class="mode?'bg-dark':'bg-white'" style="border-radius: 5px;">
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
      <div class="col-12 col-sm-8 col-md-8 q-pa-md"  :class="mode?'bg-dark':'bg-white'"  style="border-radius: 5px;">
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
      image_profile: [],
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
    ...mapActions("auth", ["updateImageProfile"]),
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
    async onSubmitImageProfle() {
      try {
        if (this.image_profile.length == 0) {
          this.$q.notify({
            type: "negative",
            message: `Ningún archivo seleccionado`,
          });
        } else {
          if (this.image_profile.size > 1000000) {
            this.$q.notify({
              type: "negative",
              message: `El tamaño de la imagen excede de lo permitido`,
            });
          } else {
            let InstFormData = new FormData();
            InstFormData.append("image_profile", this.image_profile);

            await this.updateImageProfile(InstFormData);
            this.image_profile = null;
            this.$q.notify({
              type: "positive",
              message: `Información actualizada`,
            });
          }
        }
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
      this.formUpdatePassword.newPassword = null;
      this.formUpdatePassword.confirmPassword = null;
      this.formUpdatePassword.currentPassword = null;
    },
    onResetImageProfile() {
      this.image_profile = null;
    },
    onRejected() {
      $q.notify({
        type: "negative",
        message: `El archivo no ha superado las restricciones de validación`,
      });
      this.image_profile = [];
    },
    getBackendImageUrl(image) {
      if (image) {
        const rutaCompleta = image;
        const partes = rutaCompleta.split("/");
        const nombreImagen = partes[partes.length - 1];
        return `http://127.0.0.1:8000/storage/user_profile/${nombreImagen}`;
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    mode: function () {
      return this.$q.dark.isActive;
    },
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
