<template>
  <div class="q-mt-xl q-mb-lg" v-if="showGallery == false">
    <h3 :class="mode ? 'tipogra-white' : 'tipogra'" class="q-mb-md">
      Galería de Fotos
      <q-btn round color="primary" icon="edit" size="md" @click="formGallery = true" class="q-ml-md" />
    </h3>
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded class="bg-orange text-white text-left">
        No has creado ninguna galería de imágenes. Recuerda que la galería ayudará
        a que los clientes puedan conocerte y confiar más en tu servicio.
        <template v-slot:action>
          <q-btn flat label="¡Vamos!" @click="formGallery = true" />
        </template>
      </q-banner>
    </div>

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

  <div v-if="showGallery == true" class="q-mt-xl q-mb-lg">
    <h3 :class="mode ? 'tipogra-white' : 'tipogra'" class="q-mb-md">
      Galería de Fotos
      <q-btn
        round
        color="primary"
        icon="edit"
        size="md"
        class="q-ml-md"
        @click="formGalleryEdit = true"
      />
    </h3>
    <div>
      <q-carousel
        class="q-mt-md"
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
          v-for="(gallery, index) in imageList"
          :key="index"
          :name="index + 1"
          :img-src="gallery.original_url"
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
                Puedes agregar imágenes nuevas o eliminar las existentes una por una.
                Máximo 5 imágenes en total.
              </div>

              <div class="row q-col-gutter-sm q-mb-md" v-if="imageList.length > 0">
                <div v-for="img in imageList" :key="img.id" class="col-4 relative-position">
                  <q-img :src="img.original_url" style="height: 100px; border-radius: 8px;" fit="cover" />
                  <q-btn
                    round dense color="negative" icon="delete" size="sm"
                    class="absolute-top-right q-ma-xs" style="z-index: 1;"
                    @click="confirmDeleteImage(img.id)"
                  />
                </div>
              </div>
              <q-uploader
                v-if="imageList.length < 5"
                ref="uploaderEdit"
                :label="`Agregar imágenes (Max ${5 - imageList.length})`"
                :max-files="5 - imageList.length"
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
              <div v-else class="text-center text-orange q-pa-md" style="border: 1px dashed orange; border-radius: 8px;">
                Has alcanzado el límite máximo de 5 imágenes.
              </div>
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
      <q-btn
        v-if="artistVideos && artistVideos.length < 3"
        round
        color="primary"
        icon="edit"
        size="md"
        class="q-ml-md"
        @click="openVideoModal"
      />
    </h3>
    <div class="q-pa-md q-gutter-sm" v-if="!artistVideos || artistVideos.length === 0">
      <q-banner inline-actions rounded class="bg-orange text-white text-left">
        No has agregado ningún video de YouTube. Recuerda que mostrar tu talento en video ayudará
        a que los clientes puedan conocerte y contratar tu servicio musical.
        <template v-slot:action>
          <q-btn flat label="¡Vamos!" @click="openVideoModal" />
        </template>
      </q-banner>
    </div>
    <div v-if="artistVideos && artistVideos.length >= 3" class="row justify-center q-mb-md">
      <q-chip outline color="orange" text-color="orange" icon="info">
        Has alcanzado el límite máximo de 3 videos. Elimina alguno y reemplázalo por uno nuevo.
      </q-chip>
    </div>
    <div v-if="artistVideos && artistVideos.length > 0">
      <div class="q-pa-md">
        <q-carousel
          swipeable
          animated
          infinite
          v-model="slideVideo"
          v-model:fullscreen="fullscreenVideo"
          arrows
          :autoplay="autoplay"
          :disable="!!playingVideoId"
          transition-prev="slide-right"
          transition-next="slide-left"
          class="q-mt-md"
          style="min-height: 400px; background: transparent;"
        >
          <q-carousel-slide
            v-for="(video, index) in artistVideos"
            :key="video.id"
            :name="index + 1"
            class="column no-wrap flex-center q-pa-none"
          >
            <div class="video-card q-pa-md">
              <div v-if="playingVideoId === video.id" class="video-embed-wrapper">
                <div :id="`yt-player-${video.id}`" class="yt-player"></div>
                <div v-if="ytErrors[video.id]" class="text-center q-mt-sm">
                  <a
                    :href="`https://youtu.be/${getVideoId(video.youtube_url)}`"
                    target="_blank"
                    rel="noopener"
                    class="text-primary text-weight-bold"
                  >
                    Mirar en YouTube <q-icon name="open_in_new" size="sm" />
                  </a>
                </div>
              </div>
              <div v-else class="video-thumb-wrapper">
                <q-img
                  :src="`https://img.youtube.com/vi/${getVideoId(video.youtube_url)}/hqdefault.jpg`"
                  class="video-thumb"
                  fit="cover"
                >
                  <div class="video-overlay">
                    <q-btn
                      round
                      color="red"
                      text-color="white"
                      icon="play_arrow"
                      size="lg"
                      @click="playVideo(video)"
                    />
                    <q-btn
                      round
                      dense
                      color="negative"
                      text-color="white"
                      icon="delete"
                      size="sm"
                      class="delete-btn"
                      @click="confirmDeleteVideo(video.id)"
                    />
                  </div>
                </q-img>
              </div>
              <div
                class="text-subtitle1 text-center q-mt-sm text-weight-bold ellipsis"
                :class="mode ? 'text-white' : 'text-dark'"
              >
                {{ video.title }}
              </div>
            </div>
          </q-carousel-slide>

          <template v-slot:control>
            <q-carousel-control position="bottom-right" :offset="[18, 18]">
              <q-btn
                push
                round
                dense
                color="white"
                text-color="primary"
                :icon="fullscreenVideo ? 'fullscreen_exit' : 'fullscreen'"
                @click="fullscreenVideo = !fullscreenVideo"
              />
            </q-carousel-control>
          </template>
        </q-carousel>
        <div class="row justify-center q-gutter-sm q-mt-md" v-if="artistVideos.length > 1">
          <div
            v-for="(video, index) in artistVideos"
            :key="video.id"
            class="thumbnail-nav-item cursor-pointer"
            :class="{ 'thumbnail-nav-item--active': slideVideo === index + 1 }"
            @click="slideVideo = index + 1"
          >
            <q-img
              :src="`https://img.youtube.com/vi/${getVideoId(video.youtube_url)}/hqdefault.jpg`"
              style="width: 120px; height: 68px; border-radius: 6px;"
            />
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="formVideo" persistent>
      <q-card style="min-width: 400px; max-width: 600px;">
        <q-card-section>
          <div class="text-h6">Agregar videos de YouTube</div>
          <div class="text-caption text-grey">
            Puedes subir hasta {{ 3 - (artistVideos?.length || 0) }} video(s) en total.
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none q-gutter-y-sm">
          <div
            v-for="(url, index) in newVideoUrls"
            :key="index"
            class="row items-center q-mb-sm"
          >
            <div class="col">
              <q-input
                v-model="newVideoUrls[index]"
                label="URL del video (ej: https://youtu.be/xxxxx)"
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    color="negative"
                    class="cursor-pointer"
                    @click="newVideoUrls[index] = ''"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Agregar" color="primary" @click="submitVideo" :disable="!hasAtLeastOneVideo" />
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
      newVideoUrls: [],
      sub_files_paths: null,
      slide: ref(1),
      autoplay: ref(true),
      fullscreen: ref(false),
      slideVideo: ref(1),
      fullscreenVideo: ref(false),
      playingVideoId: null,
      showGallery: null,
      ytPlayers: {},
      ytErrors: {},
    };
  },
  methods: {
    playVideo(video) {
      this.autoplay = false;
      this.playingVideoId = video.id;
      this.$nextTick(() => {
        this.initPlayer(video);
      });
    },

    initPlayer(video) {
      const videoId = this.getVideoId(video.youtube_url);
      if (!videoId) return;
      if (this.ytPlayers[video.id]) {
        this.ytPlayers[video.id].loadVideoById(videoId);
        return;
      }
      this.loadYTAPI(() => this.createPlayer(video.id, videoId));
    },

    loadYTAPI(callback) {
      if (window.YT && window.YT.Player) {
        callback();
        return;
      }
      if (this._ytCallbacks) {
        this._ytCallbacks.push(callback);
        return;
      }
      this._ytCallbacks = [callback];
      window.onYouTubePlayerAPIReady = () => {
        this._ytCallbacks.forEach((cb) => cb());
        this._ytCallbacks = [];
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/player_api";
      const first = document.getElementsByTagName("script")[0];
      first.parentNode.insertBefore(tag, first);
      if (window.YT && window.YT.Player) {
        window.onYouTubePlayerAPIReady();
      }
    },

    createPlayer(videoId, youtubeId) {
      try {
        const player = new YT.Player(`yt-player-${videoId}`, {
          videoId: youtubeId,
          width: "100%",
          height: 350,
          playerVars: {
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
          },
          events: {
            onError: (event) => {
              this.ytErrors = { ...this.ytErrors, [videoId]: event.data };
            },
            onReady: () => {
              this.ytErrors = { ...this.ytErrors, [videoId]: false };
            },
          },
        });
        this.ytPlayers = { ...this.ytPlayers, [videoId]: player };
      } catch (e) {
        this.ytErrors = { ...this.ytErrors, [videoId]: true };
      }
    },
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
        await this.gettGalleryArtist();
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
        await this.gettGalleryArtist();
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
        this.showGallery = this.imageList.length > 0;
      } catch (err) {
        this.$q.notify({
          type: "negative",
          message: err.message || "Error al obtener la galería",
        });
        this.showGallery = false;
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

    confirmDeleteImage(id) {
      this.$q.dialog({
        title: "Confirmar eliminación",
        message: "¿Estás seguro de que quieres eliminar esta imagen?",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await this.deleteGalleryArtist({ media_id: id });
          this.$q.notify({
            type: "positive",
            message: "Imagen eliminada",
          });
          await this.gettGalleryArtist();
          if (this.imageList.length === 0) {
            this.formGalleryEdit = false;
            this.showGallery = false;
          }
        } catch (err) {
          this.$q.notify({
            type: "negative",
            message: err?.response?.data?.message || "Error al eliminar la imagen",
          });
        }
      });
    },
    
    getVideoId(value) {
      if (!value) return '';
      if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;
      const match = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : value;
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

    openVideoModal() {
      const count = 3 - (this.artistVideos?.length || 0);
      this.newVideoUrls = Array.from({ length: count }, () => '');
      this.formVideo = true;
    },

    async submitVideo() {
      const validUrls = this.newVideoUrls.filter(url => url.trim() !== '');
      if (validUrls.length === 0) return;
      try {
        await this.createArtistVideo({ youtube_urls: validUrls });
        await this.getArtistVideos();
        this.$q.notify({
          type: "positive",
          message: "Video(s) agregado(s) correctamente",
        });
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
          if (this.slideVideo > this.artistVideos.length) {
            this.slideVideo = this.artistVideos.length;
          }
          this.$q.notify({
            type: "positive",
            message: "Video eliminado",
            timeout: 2000,
          });
        } catch (err) {
          this.$q.notify({
            type: "negative",
            message: "Error al eliminar el video",
            timeout: 3000,
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

    imageList() {
      const gallery = this.galleryArtist?.artistGallery || this.galleryArtist;
      return Array.isArray(gallery) ? gallery : [];
    },

    hasAtLeastOneVideo() {
      return this.newVideoUrls.some(url => url.trim() !== '');
    }
  },
  watch: {
    slideVideo() {
      this.playingVideoId = null;
      this.autoplay = true;
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

.video-card {
  width: 100%;
  max-width: 700px;
  box-sizing: border-box;
}

.video-link {
  display: block;
  text-decoration: none;
}

.video-embed-wrapper {
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  overflow: hidden;
}

.yt-player {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.video-thumb-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.video-thumb {
  width: 100%;
  height: 100%;
}

.thumbnail-nav-item {
  border: 3px solid transparent;
  border-radius: 9px;
  transition: border-color 0.2s;
  opacity: 0.6;
  transition: opacity 0.2s, border-color 0.2s;
}

.thumbnail-nav-item:hover {
  opacity: 0.9;
}

.thumbnail-nav-item--active {
  border-color: var(--q-primary);
  opacity: 1;
}

.video-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.18);
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

@media (max-width: 600px) {
  .video-card {
    max-width: 100%;
  }
}
</style>
