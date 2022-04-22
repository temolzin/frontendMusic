<template>
  <q-page>
    <q-card flat style="max-width: 300vw" v-if="loadInformation == true">
      <q-skeleton height="55vh" square />

      <q-card-section>
        <q-skeleton type="text" class="text-subtitle1" />
        <q-skeleton type="text" width="50%" class="text-subtitle1" />
        <q-skeleton type="text" class="text-caption" />
      </q-card-section>
    </q-card>

    <div v-if="loadInformation == false">
      <div
        class="info"
        :style="
          mode
            ? 'background: linear-gradient(to right,rgba(85, 83, 83, 0.445),rgb(10, 25, 56));'
            : 'background: linear-gradient(to right,rgba(85, 83, 83, 0.445),rgb(1, 81, 253));'
        "
      >
        <q-img :src="artist.image" class="img" spinner-color="white" style="" />
        <div class="row text">
          <div class="col-12 col-xs-12 col-sm-6 col-md-6">
            <h4 class="title-group text-weight-bold uppercase">
              {{ artist.name }}
            </h4>
            <div class="labels">
              <q-btn
                v-for="(musicalGender, id) in artist.musical_genders"
                :key="id"
                :color="musicalGender.color"
                size="xs"
                class="q-mr-sm q-mt-md outline"
                :label="musicalGender.name"
              />
            </div>
          </div>
          <div class="col-12 col-xs-12 col-sm-6 col-md-6 q-pr-md q-pl-md">
            <h5 class="q-mb-sm text-weight-bold q-mt-none uppercase">
              HISTORIA
            </h5>
            <p>
              {{ artist.history }}
            </p>
            <p class="q-mb-sm q-mt-sm text-weight-bold">
              Origen: <span class="text-weight-regular">{{ artist.zone }}</span>
            </p>
            <p class="q-mb-sm q-mt-sm text-weight-bold">
              Miembros:
              <span class="text-weight-regular">{{ artist.members }}</span>
            </p>
            <q-rating
              v-model="start"
              max="5"
              size="1.5em"
              color="yellow"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              no-dimming
              readonly
            />
            <div class="row">
              <div class="col-6">
                <div class="q-mt-sm q-gutter-sm">
                  <q-btn round color="gray" icon="facebook" size="10px" />
                  <q-btn round color="gray" icon="facebook" size="10px" />
                  <q-btn round color="gray" icon="facebook" size="10px" />
                </div>
              </div>
              <div class="col-6">
                <div align="right">
                  <q-btn flat round color="red" icon="favorite" />
                  <q-btn flat round color="white" icon="share" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row tipogra">
        <div class="col-12 col-sm-5 col-md-5 q-pa-lg">
          <div :class="mode ? 'container-img-dark' : 'container-img'">
            <q-img :src="artist.manager.image" class="image" />
          </div>
        </div>
        <div class="col-12 col-sm-7 col-md-7 2 q-pa-lg">
          <q-card class="my-card shadow-6">
            <q-card-section>
              <h3
                class="q-mt-sm ellipsis"
                :class="mode ? 'title-group2-white' : 'title-group2'"
              >
                <small>¡Contratame ahora! </small>{{ getMe.name }}
              </h3>
              <h4 class="q-ma-none text-center q-mt-sm text-primary">
                $ {{ artist.price_hour }}.00
                <span :class="mode ? 'text-white' : 'text-dark'">pesos</span>
                <small
                  style="font-size: 20px; text-decoration: line-through"
                  class="text-red q-ml-sm"
                >
                  $ {{ parseFloat(artist.price_hour) + 200 }}.00
                  <span :class="mode ? 'text-white' : 'text-dark'">pesos</span>
                </small>
              </h4>
              <h6 class="q-mt-sm text-weight-bold q-mb-sm">
                Detalles del grupo:
              </h6>
              <div class="q-mt-sm">
                <q-icon name="map" class="q-mt-none" />
                <span class="q-ml-sm q-mt-md">{{ artist.zone }} </span>
              </div>
              <div class="q-mt-sm">
                <q-icon name="fas fa-users" class="q-mt-none" />
                <span class="q-ml-sm q-mt-sm">
                  {{ artist.members }} Integrante(s)
                </span>
                <br />
              </div>
              <div class="q-mt-sm">
                <q-icon name="money" class="q-mt-none" />
                <span class="q-ml-sm q-mt-md">
                  $ {{ artist.price_hour }}.00 pesos por hora
                </span>
              </div>
              <div class="q-mt-sm">
                <q-icon name="money" class="q-mt-none" />
                <span class="q-ml-sm q-mt-md">
                  $ {{ artist.extra_kilometre }}.00 pesos por hora extra por km
                </span>
              </div>

              <form @submit="onSubmit" class="q-gutter-md q-mt-md">
                <q-input
                  type="number"
                  v-model="name"
                  label="Ingresa el número de horas de contratación *"
                  hint="No. Horas"
                  lazy-rules
                  :rules="nameRules"
                />

                <div class="row">
                  <div class="col-12 col-xs-6 col-sm-6 col-md-6">
                    <q-btn
                      label="Agregar al carrito"
                      color="primary"
                      icon-right="fas fa-cart-plus"
                      class="full-width q-mt-xs"
                    />
                  </div>
                  <div class="col-12 col-xs-6 col-sm-6 col-md-6">
                    <q-btn
                      label="Contratar ahora"
                      type="submit"
                      color="amber"
                      icon-right="send"
                      class="full-width q-mt-xs"
                    />
                  </div>
                </div>
              </form>
            </q-card-section>
          </q-card>

          <div class="q-mt-md text-center">
            <h3
              class="q-mt-xl"
              :class="mode ? 'title-group2-white' : 'title-group2'"
            >
              <small>Hola soy </small>{{ artist.manager.name }}
            </h3>
            <p class="info2 q-mt-md">Manager del grupo {{ artist.name }}</p>
            <p>
              Ofrecemos nuestros servicios al publico en general. ¡Contactame!
            </p>
            <p class="q-mb-sm">
              Teléfono:
              <q-icon name="phone" class="q-mr-sm"></q-icon>
              <a :href="linkWhatsApp" target="_blank">
                {{ artist.manager.phone }}
              </a>
            </p>
            <p class="q-mb-sm">
              Correo:
              <q-icon name="mail" class="q-mr-sm"></q-icon>
              <a :href="linkCorreo"> {{ artist.manager.email }}</a>
            </p>
          </div>
        </div>
      </div>
      <!-- Gallery -->
      <div v-if="artist.galery_artists[0] != null">
        <div class="q-pa-md">
          <h3
            class="text-center q-mb-md ellipsis"
            :class="mode ? 'title-group2-white' : 'title-group2'"
          >
            <small>Galeria de Imagenes de </small> {{ artist.name }}
          </h3>
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
            class="q-mt-lg"
          >
            <q-carousel-slide
              v-for="(gallery, index) in artist.galery_artists"
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
      </div>
    </div>

    <!--Fin Gallery -->
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapState, mapGetters } from "vuex";
import { ref } from "vue";

let $q;
export default {
  name: "Slug",
  data() {
    return {
      start: 4,
      slug: "",
      slugMG: "",
      loadInformation: true,
      linkWhatsApp: "",
      linkCorreo: "",
      name: "",
      nameRules: [(val) => (val && val.length > 0) || "Please type something"],
      slide: ref(1),
      autoplay: ref(true),
      fullscreen: ref(false),
      showGallery: null,
    };
  },
  methods: {
    ...mapActions("clientMusicalGenders", ["getArtistBySlug"]),
    async gettArtistBySlug() {
      try {
        await this.getArtistBySlug(this.slug).then(() => {
          this.loadInformation = false;
          const link = this.artist.manager.phone.replace(/\s+/g, "");
          this.linkWhatsApp = `https://wa.me/${link}?text=Hola%20me%20interesa%20su%20sevicios`;
          this.linkCorreo = `mailto:${this.artist.manager.email}`;
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
    onSubmit() {},
  },
  created() {
    this.slug = this.$route.params.slugA;
    this.slugMG = this.$route.params.slugMG;
    this.gettArtistBySlug();
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    ...mapState({
      artist: (state) => state.clientMusicalGenders.artistGender,
    }),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style scoped>
.tipogra {
  font-weight: normal;
  font-style: normal;
  margin-top: 3em;
}
.uppercase {
  text-transform: uppercase;
}
.img {
  height: 57vh;
  background: black;
  z-index: -1;
  object-fit: cover;
}
.info {
  height: 57vh;
  background: black;
  z-index: 2;
}
.text {
  z-index: 2;
  margin-top: -50vh;
  color: white;
  text-align: justify;
}
.title-group {
  margin-top: 180px;
  margin-bottom: none;
  margin-left: 20px;
  text-align: left;
}
.title-group2 {
  font-size: 45px;
  margin-bottom: 0;
  color: #001d38;
}
.title-group2-white {
  font-size: 45px;
  margin-bottom: 0;
  color: #e6e6e6;
}
.labels {
  z-index: 2;
  margin-top: -40px;
  margin-bottom: none;
  position: relative;
  margin-left: 20px;
  text-align: left;
}
.image {
  z-index: -2;
  height: 750px;
  margin-left: auto;
  margin-right: auto;
  object-fit: contain;
  border-radius: 15px;
}
.container-img {
  height: 750px;
  z-index: 2;
  background: linear-gradient(
    90deg,
    rgba(28, 87, 248, 0) 30%,
    rgb(255, 255, 255)
  );
}
.container-img-dark {
  height: 750px;
  z-index: 2;
  background: linear-gradient(
    90deg,
    rgba(28, 87, 248, 0) 30%,
    rgba(20, 19, 19, 0.932)
  );
}
@media (max-width: 600px) {
  .text {
    margin-top: -115vh;
  }
  /* .text-info{
    margin-left: 20px;
  }*/
  .img {
    height: 100vh;
  }
  .info {
    height: 100vh;
  }
  .info2 {
    font-size: 16px;
    line-height: 28px;
    font-weight: 300;
    color: #727272;
    text-align: justify;
  }
  .title-group {
    text-align: center;
    margin-left: 0px;
    margin-bottom: 45px;
  }
  .title-group2 {
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 0;
    color: #001d38;
  }
  .labels {
    text-align: center;
    margin-bottom: 45px;
  }
  .image {
    height: 450px;
  }
  .container-img {
    height: 450px;
    background: linear-gradient(
      90deg,
      rgba(28, 87, 248, 0) 100%,
      rgb(255, 255, 255)
    );
  }
}
</style>
