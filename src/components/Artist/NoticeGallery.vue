<template>
  <div class="q-pa-md q-gutter-sm q-mt-md" v-if="showGallery == false">
    <q-banner inline-actions rounded class="bg-orange text-white">
      No has creado ninguna galería de imágenes. Recuerda que la galería ayudará
      a que los clientes puedan conocerte y confiar más en tu servicio.
      <template v-slot:action>
        <q-btn flat label="¡Vamos!" @click="formGallery = true" />
      </template>
    </q-banner>

    <!-- Inicio de Formulario galeria de imagenes -->
    <section>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="formGallery" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Crear galeria de imagenes</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-uploader
                label="Selecciona las imagenes (Max 5)"
                max-files="5"
                multiple
                accept=".jpg, image/*"
                :factory="uploadSubImages"
                @rejected="onRejected"
                color="accent"
                max-file-size="1000000"
                max-total-size="5000000"
                lazy-rules
              />
              <q-card-actions align="right" class="text-primary q-mt-md">
                <q-btn
                  label="Cancelar"
                  type="reset"
                  color="primary"
                  flat
                  v-close-popup
                  class="q-ml-sm"
                />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </section>
    <!-- Fin de Formulario galeria de imagenes -->
  </div>
  <div v-if="showGallery == true" class="q-mt-lg">
    <h3 class="tipogra">
      Galeria de Imagenes
      <q-btn
        round
        color="primary"
        icon="edit"
        @click="formGalleryEdit = true"
      />
    </h3>
    <div class="q-pa-md">
      <q-carousel
        swipeable
        animated
        thumbnails
        infinite
        v-model="slide"
        v-model:fullscreen="fullscreen"
        :autoplay="autoplay"
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
      >
        <q-carousel-slide
          v-for="(gallery, index) in galleryArtist"
          :key="index"
          :name="index + 1"
          :img-src="gallery.image"
        />

        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[18, 18]">
            <q-btn
              push
              round
              dense
              color="white"
              text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </div>

    <!-- Inicio de Formulario para editar galeria de imagenes -->
    <section>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="formGalleryEdit" persistent>
          <q-card style="max-width: 360px">
            <q-card-section>
              <div class="text-h6">Editar galeria de imagenes</div>
              <p class="">
                Todas las imagenes anteriores serán eliminadas y sustituidas por
                las que seleccione.
              </p>
              Estas seguro de eliminar las imagenes anteriores
              <q-btn
                :disable="btnDelete"
                label="Confirmar"
                color="red"
                @click="formDelete"
              />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-uploader
                :disable="formGalleryShow"
                label="Selecciona las imagenes (Max 5)"
                max-files="5"
                multiple
                accept=".jpg, image/*"
                :factory="updateSubImages"
                @rejected="onRejected"
                color="accent"
                max-file-size="1000000"
                max-total-size="5000000"
              />
              <q-card-actions align="right" class="text-primary q-mt-md">
                <q-btn
                  label="Cancelar"
                  type="reset"
                  color="primary"
                  flat
                  v-close-popup
                  class="q-ml-sm"
                />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </section>
    <!-- Fin de Formulario para editar galeria de imagenes -->
  </div>
</template>

<script>
import { ref } from "vue";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";

let $q = useQuasar();
export default {
  name: "ComponentNoticeGallery",
  data() {
    return {
      btnDelete: false,
      formGalleryShow: true,
      formGallery: false,
      formGalleryEdit: false,
      sub_files_paths: null,
      slide: ref(1),
      autoplay: ref(true),
      fullscreen: ref(false),
      showGallery: null,
    };
  },
  methods: {
    ...mapActions("galleryArtist", ["getGalleryArtist"]),
    ...mapActions("galleryArtist", ["createGalleryArtist"]),
    ...mapActions("galleryArtist", ["upDateGalleryArtist"]),
    ...mapActions("galleryArtist", ["deleteGalleryArtist"]),
    async gettGalleryArtist() {
      try {
        await this.getGalleryArtist();
        //console.log(this.galleryArtist);
        if (this.galleryArtist[0] != null) {
          this.showGallery = true;
        } else this.showGallery = false;
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.message,
          });
        }
      }
    },

    async uploadSubImages(files) {
      try {
        this.sub_files_paths = files[0];
        let InstFormData = new FormData();
        InstFormData.append("sub_files_paths", this.sub_files_paths);
        await this.createGalleryArtist(InstFormData).then(() => {
          this.showGallery = true;
          $q.notify({
            type: "positive",
            message: "Imagen subida correctamente",
          });
        });
        this.sub_files_paths = null;
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async updateSubImages(files) {
      try {
        this.sub_files_paths = files[0];
        let InstFormData = new FormData();
        InstFormData.append("sub_files_paths", files[0]);
        await this.upDateGalleryArtist(InstFormData).then(() => {
          this.showGallery = true;
          $q.notify({
            type: "positive",
            message: "Imagen subida correctamente",
          });
          this.btnDelete = false;
          this.formGalleryShow = true;
          this.formGalleryEdit = false;
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
    formDelete() {
      this.$q
        .dialog({
          title: "Mensaje de confirmación",
          message: `¿Estás seguro de que quieres actualizar tu galería de imágenes?`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          try {
            this.btnDelete = true;
            this.formGalleryShow = false;
            let option = "Yes";
            this.deleteGalleryArtist(option);
            this.$q.notify({
              type: "positive",
              message: `Eliminado correctamente`,
            });
          } catch (err) {
            if (err.response.data.message) {
              $q.notify({
                type: "negative",
                message: err.response.data.message,
              });
            }
          }
        });
    },
    onRejected(rejectedEntries) {
      this.$q.notify({
        type: "negative",
        message: `${rejectedEntries.length} archivo(s) no han superado las restricciones de validación`,
      });
    },
  },
  computed: {
    ...mapState({
      galleryArtist: (state) => state.galleryArtist.galleryArtist,
    }),
  },
  mounted() {
    $q = useQuasar();
    this.gettGalleryArtist();
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Josefin+Sans:300,300i,400,400i,600,700|Muli:300,300i,400,400i,600,600i,700,700i,900&display=swap");

.tipogra {
  font-family: "Josefin Sans", sans-serif;
  font-weight: normal;
  font-style: normal;
  margin-top: 3em;
  font-size: 50px;
  font-weight: 400;
  margin-bottom: 0;
  margin-top: 0px;
  font-family: "Josefin Sans", sans-serif;
  color: #001d38;
  text-align: center;
}
</style>
