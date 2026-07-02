<template>
  <div class="q-pa-md q-gutter-sm q-mt-md" v-if="showGallery == false">
     <h3 :class="mode ? 'tipogra-white' : 'tipogra'" class="q-mb-md">
      Galería de Fotos
    </h3>
    <q-banner inline-actions rounded class="bg-orange text-white q-mt-xl q-mb-lg">
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
              <div class="text-h6">Crear galería de imágenes</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-uploader
                ref="uploaderCreate"
                label="Selecciona las imágenes (Máx. 5)"
                max-files="5"
                multiple
                accept=".jpg, .jpeg, .png, .jpe"
                :factory="uploadSubImages"
                @added="(files) => validateAddedFiles(files, 'uploaderCreate')"
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
  <div v-if="showGallery == true" class="q-mt-lg q-mb-none">
    <h3 :class="mode?'tipogra-white':'tipogra'" class="q-mb-lg">
      Galeria de Imagenes
      <q-btn
        round
        color="primary"
        icon="edit"
        @click="formGalleryEdit = true"
      />
    </h3>
    <div>
      <q-carousel
        class="q-mt-xl"
        :style="fullscreen ? 'height: 100vh' : 'height: 400px'"
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
        @keyup.esc="fullscreen = false"
      >
        <q-carousel-slide
          v-for="(gallery, index) in galleryArtist"
          :key="index"
          :name="index + 1"
          :img-src="gallery.image"
        />

        <template v-slot:control>
          <q-carousel-control position="top-right" :offset="[18, 18]">
            <q-btn
              push
              round
              dense
              color="white"
              text-color="primary"
              size="lg"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </div>

    <section>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="formGalleryEdit" persistent>
          <q-card style="min-width: 360px; max-width: 760px">
            <q-card-section class="row items-center q-pb-sm">
              <div class="text-h6">Editar galería de imágenes</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-caption text-grey q-mb-md">
                Puedes agregar imágenes nuevas o eliminar todas y empezar de nuevo.
                Máximo 5 imágenes en total.
              </div>
              <q-uploader
                ref="uploaderEdit"
                label="Agregar imágenes (Max 5)"
                max-files="5"
                multiple
                accept=".jpg, .jpeg, .png, .jpe"
                :factory="updateSubImages"
                @added="(files) => validateAddedFiles(files, 'uploaderEdit')"
                @rejected="onRejected"
                color="accent"
                max-file-size="20971520"
                max-total-size="104857600"
                class="q-mb-md full-width"
              />
              <q-btn
                outline
                rounded
                color="negative"
                icon="delete_sweep"
                label="Eliminar todas las imágenes"
                class="full-width"
                @click="formDelete"
              />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right" class="q-pa-sm">
              <q-btn flat label="Cerrar" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </section>
    <!-- Fin de Formulario para editar galeria de imagenes -->
  </div>

  <div class="q-mt-xl q-mb-lg">
    <h3 :class="mode ? 'tipogra-white' : 'tipogra'" class="q-mb-md">
      Galería de Videos
    </h3>
    <div class="q-pa-md q-gutter-sm q-mt-md" v-if="!artistVideos || artistVideos.length === 0">
      <q-banner inline-actions rounded class="bg-orange text-white text-left">
        No has agregado ningún video de YouTube. Recuerda que mostrar tu talento en video ayudará
        a que los clientes puedan conocerte y contratar tu servicio musical.
        <template v-slot:action>
          <q-btn flat label="¡Vamos!" @click="formVideo = true" />
        </template>
      </q-banner>
    </div>
    <div v-if="artistVideos && artistVideos.length > 0" class="row q-gutter-md q-mb-lg justify-center">
      <div
        v-for="video in artistVideos"
        :key="video.id"
        class="col-12 col-md-5 relative-position"
      >
        <q-card class="video-card">
          <a :href="`https://www.youtube.com/watch?v=${video.youtube_url}`" target="_blank">
            <img :src="`https://img.youtube.com/vi/${video.youtube_url}/hqdefault.jpg`" class="video-thumb" />
            <q-icon name="play_circle" class="play-icon" color="white" size="4rem" />
          </a>
          <q-card-section class="q-py-sm">
            <div class="text-subtitle2 ellipsis">{{ video.title }}</div>
          </q-card-section>
        </q-card>
        <q-btn
          round
          dense
          color="negative"
          icon="delete"
          class="absolute-top-right q-ma-sm"
          @click="confirmDeleteVideo(video.id)"
        />
      </div>
    </div>
    <q-dialog v-model="formVideo" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar video de YouTube</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="newVideoUrl"
            label="URL del video (ej: https://youtu.be/xxxxx)"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="newVideoUrl = ''" />
          <q-btn label="Agregar" color="primary" @click="submitVideo" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      formVideo: false,
      newVideoUrl: "",
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
    ...mapActions("videoArtist", ["getArtistVideos", "createArtistVideo", "deleteArtistVideo"]),
    
    async uploadSubImages(files) {
      try {
        this.sub_files_paths = files[0];
        let InstFormData = new FormData();
        InstFormData.append("sub_files_paths", this.sub_files_paths);
        
        await this.createGalleryArtist(InstFormData);
        
        this.showGallery = true;
        this.$q.notify({
          type: "positive",
          message: "Imagen subida correctamente",
        });
        this.sub_files_paths = null;
      } catch (err) {
          if (this.$refs.uploaderCreate) {
            this.$refs.uploaderCreate.reset(); 
          }
          this.$q.notify({ 
            type: "negative",
            message: "Revisa que el formato de la imagen sea el esperado (jpg, png, jpeg, jpe) y que el tamaño no supere lo permitido.",
          });
        }
    },
  async updateSubImages(files) {
    try {
      this.sub_files_paths = files[0];
      let InstFormData = new FormData();
      InstFormData.append("sub_files_paths", files[0]);
      
      await this.upDateGalleryArtist(InstFormData);
      
      this.showGallery = true;
      this.$q.notify({ 
        type: "positive",
        message: "Imagen subida correctamente",
      });
      this.btnDelete = false;
      this.formGalleryShow = true;
      this.formGalleryEdit = false;
    } catch (err) {
      if (this.$refs.uploaderEdit) {
        this.$refs.uploaderEdit.reset();
      }

      this.$q.notify({
        type: "negative",
        message: "Revisa que el formato de la imagen sea el esperado (jpg, png, jpeg, jpe) y que el tamaño no supere lo permitido.",
      });
      this.formGalleryEdit = false;
      await this.gettGalleryArtist();
    }
  },

  async gettGalleryArtist() {
    try {
      await this.getGalleryArtist();
      this.showGallery = (this.galleryArtist && this.galleryArtist[0] != null);
    } catch (err) {
      this.$q.notify({
        type: "negative",
        message: err.message || "Error al obtener la galería",
      });
    }
  },
  validateAddedFiles(files, uploaderRef) {
    const uploader = this.$refs[uploaderRef];
    if (!uploader) return;

    const validExtensions = ['jpg', 'jpeg', 'png', 'jpe'];

    files.forEach((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        uploader.removeFile(file);
        this.$q.notify({
          type: "negative",
          message: `El archivo "${file.name}" no tiene un formato válido (Solo jpg, jpeg, png, jpe).`,
        });
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        if (img.width <= img.height) {
          uploader.removeFile(file);
          this.$q.notify({
            type: "negative",
            message: `"${file.name}" debe ser horizontal (ancho mayor que alto).`,
          });
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        uploader.removeFile(file);
      };
      img.src = url;
    });
  },
    formDelete() {
      this.$q
        .dialog({
          title: "Mensaje de confirmación",
          message: `¿Estás seguro de que quieres eliminar todas las imágenes?`,
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            let option = "Yes";
            await this.deleteGalleryArtist(option);
            this.showGallery = false;
            this.formGalleryEdit = false;
            this.$q.notify({
              type: "positive",
              message: `Eliminado correctamente`,
            });
          } catch (err) {
            this.$q.notify({
              type: "negative",
              message: err?.response?.data?.message || "Error al eliminar",
            });
          }
        });
    },
    extractYouTubeId(url) {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname.includes("youtu.be")) {
          return parsedUrl.pathname.replace("/", "");
        }
        if (parsedUrl.searchParams.has("v")) {
          return parsedUrl.searchParams.get("v");
        }
      } catch (error) {
        return null;
      }
      return null;
    },
    async submitVideo() {
      if (!this.newVideoUrl.trim()) return;

      try {
        await this.createArtistVideo({ youtube_url: this.newVideoUrl });
        await this.getArtistVideos();
        this.$q.notify({
          type: "positive",
          message: "Video agregado correctamente",
        });
        this.newVideoUrl = "";
        this.formVideo = false;
      } catch (err) {
        this.$q.notify({
          type: "negative",
          message: err?.response?.data?.message || "Error al agregar el video",
        });
      }
    },
    confirmDeleteVideo(id) {
      this.$q.dialog({
        title: "Confirmar",
        message: "¿Eliminar este video?",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await this.deleteArtistVideo(id);
          await this.getArtistVideos();
          this.$q.notify({
            type: "positive",
            message: "Video eliminado",
          });
        } catch (err) {
          this.$q.notify({
            type: "negative",
            message: "Error al eliminar el video",
          });
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
      artistVideos: (state) => state.videoArtist.artistVideos,
    }),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
  mounted() {
    $q = useQuasar();
    this.gettGalleryArtist();
    this.getArtistVideos().catch((err) => {
      this.$q.notify({
        type: "negative",
        message: err.response?.data?.message ?? "No se pudieron cargar los videos",
      });
    });
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
.tipogra-white {
  font-family: "Josefin Sans", sans-serif;
  font-weight: normal;
  font-style: normal;
  margin-top: 3em;
  font-size: 50px;
  font-weight: 400;
  margin-bottom: 0;
  margin-top: 0px;
  font-family: "Josefin Sans", sans-serif;
  color: #e2e2e2;
  text-align: center;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.yt-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.video-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.video-thumb {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  opacity: 0.85;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
}
</style>
