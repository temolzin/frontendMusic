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
                @click="$router.push({ name: 'client.view-groups-by-genders-search', params: { slug: musicalGender.slug } })"
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
            <div class="row">
              <div class="col-6">
                <div class="q-mt-sm q-gutter-sm">
                  <a
                    v-for="(red, index) in artist.social_media"
                    :key="index"
                    :href="red.url"
                    target="_blank"
                    class="q-mr-sm"
                  >
                    <q-btn round color="primary" :icon="socialIcon(red.name)" size="10px" />
                  </a>
                </div>
              </div>
              <div class="col-6">
                <div align="right">
                  <q-btn
                    flat
                    round
                    :color="isFavoriteArtist(artist.id) ? 'red' : 'black'"
                    :icon="isFavoriteArtist(artist.id) ? 'fas fa-solid fa-heart' : 'far fa-heart'"
                    @click="addFavouriteArtist(artist.id)"
                  />
                  <q-btn flat round color="white" icon="share" @click="copyArtistLink()" />
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
              <div class="artist-hero text-center q-mt-sm">
                <h3 class="artist-cta q-ma-none" :class="mode ? 'title-group2-white' : 'title-group2'">
                  ¡Contrátame ahora!
                </h3>
                <div class="artist-name q-mt-xs" :class="mode ? 'text-white' : 'text-dark'">
                  {{ artist.name }}
                </div>
              </div>
              <h4 class="q-ma-none text-center q-mt-sm text-primary">
                <template v-if="activeOffer">
                  <q-badge color="orange" class="q-mb-sm" style="font-size:13px">
                      {{ formatDiscount(activeOffer.discount_percentage) }}% de descuento
                  </q-badge>
                  <div class="text-caption text-grey-7 q-mt-xs">{{ activeOffer.description }}</div>
                  <br />
                  $ {{ formatMoney(discountedPrice) }}
                  <small style="font-size: 20px; text-decoration: line-through" class="text-red q-ml-sm">
                    $ {{ formatMoney(artist.price_hour) }}
                  </small>
                </template>
                <template v-else>
                  $ {{ formatMoney(artist.price_hour) }}
                </template>
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
                  <template v-if="activeOffer">
                    $ {{ formatMoney(discountedPrice) }} por hora
                    <small style="text-decoration: line-through" class="text-red q-ml-xs">
                      $ {{ formatMoney(artist.price_hour) }}
                    </small>
                  </template>
                  <template v-else>
                    $ {{ formatMoney(artist.price_hour) }} por hora
                  </template>
                </span>
              </div>
              <div class="q-mt-sm">
                <q-icon name="money" class="q-mt-none" />
                <span class="q-ml-sm q-mt-md">
                  $ {{ formatMoney(artist.extra_kilometre) }} por km extra
                </span>
              </div>

              <form @submit="onSubmit" class="q-gutter-md q-mt-md">
                <q-input
                  type="number"
                  v-model="hours"
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
                      v-on:click="onSendOrder(artist)"
                    />
                  </div>
                  <div class="col-12 col-xs-6 col-sm-6 col-md-6">
                    <q-btn
                      label="Contratar ahora"
                      color="amber"
                      icon-right="send"
                      class="full-width q-mt-xs"
                      @click="handleHireNow(artist)"
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
              <small>Hola soy {{ artist.manager.name }}</small>
            </h3>
            <p class="info2 q-mt-md">Manager del grupo {{ artist.name }}</p>
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
            <small>Galería de imágenes de </small> {{ artist.name }}
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
import { useQuasar, QSpinnerGears, QSpinnerAudio } from "quasar";
import { mapActions, mapState, mapGetters } from "vuex";
import { ref } from "vue";

let $q;
export default {
  name: "Slug",
  data() {
    return {
      slug: "",
      slugMG: "",
      loadInformation: true,
      linkWhatsApp: "",
      linkCorreo: "",
      name: "",
      nameRules: [(val) => (val && val.length > 0) || "Por favor ingresa algo"],
      slide: ref(1),
      autoplay: ref(true),
      fullscreen: ref(false),
      showGallery: null,
      showInfo: null,
      listCart: [],
      favoriteArtistIds: [],
      addFavourite: {
        artist_id: "",
      },
      hours: 1,
      item: {
        artist_id: "",
        hours_artist: "",
      },
    };
  },
  methods: {
    socialIcon(name) {
      const icons = {
        'Instagram':   'fab fa-instagram',
        'X (Twitter)': 'fab fa-x-twitter',
        'YouTube':     'fab fa-youtube',
        'Facebook':    'fab fa-facebook',
        'TikTok':      'fab fa-tiktok',
        'Spotify':     'fab fa-spotify',
        'Apple Music': 'fab fa-apple',
        'SoundCloud':  'fab fa-soundcloud',
        'Bandcamp':    'fab fa-bandcamp',
        'LinkedIn':    'fab fa-linkedin',
      };
      return icons[name] || 'fas fa-link';
    },
    ...mapActions("clientMusicalGenders", ["getArtistBySlug"]),
    ...mapActions("shoppingCard", ["updateItemShoppingCart"]),
    ...mapActions("shoppingCard", ["create_order"]),
    ...mapActions("favouriteArtists", ["createFavouriteArtist", "getFavouriteArtists"]),
    async addFavouriteArtist(id) {
      if (!id || this.isFavoriteArtist(id)) {
        return;
      }

      this.addFavourite.artist_id = id;
      try {
        await this.createFavouriteArtist(this.addFavourite);
        this.toggleFavoriteArtist(id);
        this.$q.notify({
          type: "positive",
          message: "Agregado a Favoritos",
        });
        this.addFavourite.artist_id = "";
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            this.$q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async gettArtistBySlug() {
      try {
        await this.getArtistBySlug(this.slug).then(async () => {
          this.loadInformation = false;
          const link = this.artist.manager.phone.replace(/\s+/g, "");
          this.linkWhatsApp = `https://wa.me/${link}?text=Hola%20me%20interesa%20su%20sevicios`;
          this.linkCorreo = `mailto:${this.artist.manager.email}`;
        });
      } catch (err) {
        if (err.response.data.message) {
            this.$q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    addCart(item) {
      let change = false;
      this.listCart.forEach(function (valor, indice) {
        if (valor.id == item.id) {
          valor.cant = valor.cant + 1;
          change = true;
        }
      });
      if (change != true) {
        const itemcar = {
          id: item.id,
          name: item.name,
          slug: item.slug,
          cant: 1,
          hours: 1,
          price_hour: item.price_hour,
          zone: item.zone,
          image: item.image,
        };
        this.listCart.push(itemcar);
      }
    },
    onSendOrder(artist) {
      this.$q.notify({
        spinner: QSpinnerGears,
        message: "Agregando al carrito...",
        timeout: 200,
      });
      const formData = new FormData();
      formData.append("service_id", artist.id);
      formData.append("name", artist.name);
      const finalPrice = this.activeOffer 
        ? this.discountedPrice 
        : artist.price_hour;
      formData.append("price", finalPrice);
      formData.append("hours", this.hours);
      formData.append("order_date_start", this.printDateStart());
      formData.append("order_date_finish", this.printDateFinish());
      this.create_order(formData).then(() => {
        this.$q.notify({
          type: "positive",
          spinner: QSpinnerAudio,
          message: "Artista agregado",
          timeout: 1000,
        });
      });
    },
    handleHireNow(artist) {
      const averageRating = Number(this.artist.ratings_avg_rating || artist.ratings_avg_rating || 0);
      const artistData = JSON.stringify({
        id: artist.id,
        name: artist.name,
        image: artist.image,
        price_hour: this.activeOffer ? this.discountedPrice : artist.price_hour,
        zone: artist.zone,
        members: artist.members,
        manager: artist.manager,
        rating: averageRating
      });
      let artistDataEncoded = '';
      try {
        artistDataEncoded = btoa(unescape(encodeURIComponent(artistData)));
      } catch (err) {
        try {
          artistDataEncoded = btoa(artistData);
        } catch (err2) {
          this.$q.notify({ type: 'negative', message: 'Error al preparar datos de compra. Intenta de nuevo.' });
          return;
        }
      }

      this.$router.push({
        name: 'client.dataClient',
        query: {
          quickBuy: 'true',
          artistData: artistDataEncoded,
          hours: this.hours
        }
      });
    },
    copyArtistLink() {
      const link = `${window.location.origin}/client/musical-genders/${this.slugMG}/${this.slug}`;
      navigator.clipboard.writeText(link).then(() => {
        this.$q.notify({ type: 'positive', message: 'Link copiado al portapapeles' });
      });
    },
    isFavoriteArtist(id) {
      return this.favoriteArtistIds.includes(id);
    },
    toggleFavoriteArtist(id) {
      if (this.favoriteArtistIds.includes(id)) {
        this.favoriteArtistIds = this.favoriteArtistIds.filter((itemId) => itemId !== id);
        return;
      }
      this.favoriteArtistIds.push(id);
    },
    syncFavoriteArtistIds() {
      if (!Array.isArray(this.stateFavouriteArtists)) {
        this.favoriteArtistIds = [];
        return;
      }

      this.favoriteArtistIds = this.stateFavouriteArtists
        .map((item) => (item && item.artist ? item.artist.id : null))
        .filter((id) => id !== null && id !== undefined);
    },
    async loadFavouriteArtists() {
      try {
        await this.getFavouriteArtists();
        this.syncFavoriteArtistIds();
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            this.$q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    printDateStart: function () {
      return this.formatCartDate(new Date());
    },
    printDateFinish: function () {
      var currentDate = new Date();
      return this.addDays(currentDate, 2);
    },
    addDays(date, days) {
      date.setDate(date.getDate() + days);
      return this.formatCartDate(date);
    },
    formatCartDate(date) {
      const pad = (value) => String(value).padStart(2, "0");
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    onSubmit() {},
    formatMoney(value) {
      const num = Number(value || 0);
      return num.toLocaleString('es-MX');
    },
    formatDiscount(value) {
      const num = parseFloat(value);
      return num % 1 === 0 ? parseInt(num) : num;
    },
  },
  created() {
    this.slug = this.$route.params.slugA;
    this.slugMG = this.$route.params.slugMG;
    this.gettArtistBySlug();
    this.loadFavouriteArtists();
  },
  computed: {
    ...mapGetters("favouriteArtists", ["stateFavouriteArtists"]),
    ...mapGetters("auth", ["getMe"]),
    ...mapState({
      artist: (state) => state.clientMusicalGenders.artistGender,
    }),
    ...mapGetters("shoppingCard", ["stateListShopingCard"]),
    mode: function () {
      return this.$q.dark.isActive;
    },
    activeOffer() {
      return this.artist?.offers?.[0] ?? null;
    },
    discountedPrice() {
      if (!this.activeOffer) return null;
      const discount = this.activeOffer.discount_percentage / 100;
      return Math.round(this.artist.price_hour * (1 - discount) * 100) / 100;
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
.artist-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.artist-cta {
  line-height: 1.1;
  text-align: center;
}
.artist-name {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  max-width: 100%;
  word-break: break-word;
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
