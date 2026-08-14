<template>
  <q-page>
    <div class="q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el
          to="/dashboard/home"
          label="Inicio"
          icon="home"
        />
        <q-breadcrumbs-el
          to="/client/musical-genders"
          label="Géneros Musicales"
          icon="widgets"
        />
        <q-breadcrumbs-el
          :label="slug"
          class="text-weight-bold"
          :class="mode ? 'text-grey-5' : 'text-dark'"
        />
      </q-breadcrumbs>
    </div>
    <div v-if="clientMusicalGenders[0]">
      <!-- Inicio de Parallax de nobre del grupo y descripción -->
      <div class="parallax-wrapper">
        <q-parallax :height="280" :speed="0.5" v-if="skeleton == false">
          <template v-slot:media>
            <img
              :src="clientMusicalGenders[0].image || 'https://cdn.pixabay.com/photo/2017/03/09/20/53/microphone-2130806_960_720.jpg'"
            />
          </template>

          <template v-slot:content="scope">
            <div
              class="absolute column items-center parallax-content"
              :style="{
                opacity: 0.45 + (1 - scope.percentScrolled) * 0.75,
                top: scope.percentScrolled * 50 + '%',
                left: 0,
                right: 0,
              }"
            >
              <div class="parallax-title text-white text-center q-mb-sm">
                {{ clientMusicalGenders[0].name }}
              </div>
              <div class="parallax-desc text-white text-center">
                {{ clientMusicalGenders[0].description }}
              </div>
            </div>
          </template>
        </q-parallax>
      </div>
      <!-- Fin de Parallax de nobre del grupo y descripción -->
      <!-- Inico de carga de Parallax -->
      <div class="q-gutter-y-md" v-if="skeleton == true">
        <q-skeleton height="150px" />
      </div>
      <!-- Fin de carga de Parallax -->
      <q-table
        grid
        card-class="bg-primary text-white"
        :rows="clientMusicalGenders[0].artists"
        :columns="columns"
        row-key="name"
        :filter="filter"
        hide-header
        no-data-label="Sin registros"
        no-results-label="Ningún registro coincidente"
        rows-per-page-label="Géneros por página"
        :rows-per-page-options="[10, 20, 30, 0]"
      >
        <template v-slot:top-left>
          <h5
            class="q-ma-none q-mt-md"
            :class="mode ? 'text-grey-5' : 'text-modedark text-weight-medium'"
            v-if="skeleton == false"
          >
            Resultados relacionados a {{ clientMusicalGenders[0].name }}
          </h5>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar por nombre... "
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-skeleton
              class="q-ma-sm"
              height="350px"
              v-if="skeleton == true"
            />
            <q-card class="my-card q-ma-sm" v-show="!skeleton">
              <q-img :src="props.row.image" class="imageArtist" />

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="fas fa-solid fa-cart-plus"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%)"
                  v-on:click="onSendOrder(props.row)"
                />

                <div class="row no-wrap items-center">
                  <div
                    class="col text-h6 ellipsis search text-weight-regular"
                    @click="search(props.row.slug)"
                  >
                    {{ props.row.name }}
                  </div>

                  <div
                    class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
                  >
                    <q-icon name="map" />
                    <small>{{ props.row.zone }}</small>
                  </div>
                </div>

                <q-rating
                  :model-value="parseFloat(props.row?.ratings_avg_rating || 0)"
                  :max="5"
                  size="32px"
                  color="yellow"
                  icon="star_border"
                  icon-selected="star"
                  icon-half="star_half"
                  no-dimming
                  readonly
                />
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  <span class="text-h5 text-primary text-weight-bold">
                    ${{ props.row.price_hour }}.00
                  </span>
                  <small> pesos por hora</small>
                </div>
                <div class="text-caption text-grey ellipsis">
                  {{ props.row.history }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  flat
                  round
                  :color="isFavoriteArtist(props.row.id) ? 'red' : 'black'"
                  :icon="isFavoriteArtist(props.row.id) ? 'fas fa-solid fa-heart' : 'far fa-heart'"
                  @click="addFavouriteArtist(props.row.id)"
                />
                <q-btn flat round color="primary" icon="share" @click="copyArtistLink(props.row.slug, this.slug)" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
    <!-- Inicio de sin registros -->
    <div v-if="clientMusicalGenders[0] == null">
      <div class="q-pa-md">
        <q-card class="my-card">
          <q-parallax
            src="https://cdn.quasar.dev/img/parallax1.jpg"
            :height="150"
          />

          <q-card-section>
            <div class="text-h6">Sin resultados</div>
            <div class="text-subtitle2">
              Al parecer no existe el género con el slug: {{ slug }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- Fin de sin registros -->
  </q-page>
</template>

<script>
import { useQuasar, QSpinnerGears, QSpinnerAudio } from "quasar";
import { mapActions, mapGetters, mapState } from "vuex";
import { ref } from "vue";
import { notifySuccess, notifyError, notifyInfo } from "src/utils/notify";
import { openArtistLinkShareSheet } from "src/utils/shareArtistLink";

let $q;
export default {
  name: "SearchBySlug",

  data() {
    const columns = [{ name: "name", field: "name", sortable: true }];
    return {
      filter: ref(""),
      columns,
      slug: null,
      skeleton: true,
      showResult: null,
      listCarrito: [],
      favoriteArtistIds: [],
      addFavourite: {
        artist_id: "",
      },
    };
  },
  methods: {
    ...mapActions("clientMusicalGenders", ["getMusicalGendersBySlug"]),
    ...mapActions("shoppingCard", ["create_order"]),
    ...mapActions("favouriteArtists", ["createFavouriteArtist", "getFavouriteArtists"]),
    async gettMusicalGendersBySlug() {
      try {
        await this.getMusicalGendersBySlug(this.slug).then(() => {
          this.skeleton = false;
        });
      } catch (err) {
        if (err.response.data.message) {
          notifyError(err.response.data.message);
        }
      }
    },
    search(slug) {
      this.$router.push({
        name: "client.view-group-by-gender-slug",
        params: {
          slugMG: this.slug,
          slugA: slug,
        },
      });
    },

    copyArtistLink(artistSlug, genreSlug) {
      const link = `${window.location.origin}/client/musical-genders/${genreSlug}/${artistSlug}`;
      openArtistLinkShareSheet({ q: this.$q, link });
    },

    addCart(item) {
      let change = false;
      this.listCarrito.forEach(function (valor, indice) {
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
          price_hour: item.price_hour,
          zone: item.zone,
          image: item.image,
        };
        this.listCarrito.push(itemcar);
      }

      //alert(JSON.stringify(item));
    },
    onSendOrder(artist) {
      notifyInfo("Agregando al carrito...", { spinner: QSpinnerGears, timeout: 200 });
      const formData = new FormData();
      formData.append("service_id", artist.id);
      formData.append("name", artist.name);
      formData.append("price", artist.price_hour);
      formData.append("order_date_start", this.printDateStart());
      formData.append("order_date_finish", this.printDateFinish());
      //formData.append("total", total);
      this.create_order(formData).then(() => {
        notifySuccess("Artista agregado", { spinner: QSpinnerAudio, timeout: 1000 });
      }).catch((err) => {
        notifyError(err.response?.data?.message ?? err.response?.data?.error ?? "No se pudo agregar el artista al carrito", { timeout: 3000 });
      });
    },
    printDateStart: function () {
      return this.formatCartDate(new Date());
    },
    printDateFinish: function () {
      var d = new Date();
      return this.sumarDias(d, 2);
    },
    sumarDias(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return this.formatCartDate(fecha);
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
    async addFavouriteArtist(id) {
      this.addFavourite.artist_id = id;
      try {
        await this.createFavouriteArtist(this.addFavourite).then(() => {
          this.toggleFavoriteArtist(id);
          notifySuccess(this.favouriteArtists);
        });
        this.addFavourite.artist_id = "";
      } catch (err) {
        if (err.response.data.message) {
          notifyError(err.response.data.message);
        }
      }
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
          notifyError(err.response.data.message);
        }
      }
    },
  },
  created() {
    this.slug = this.$route.params.slug;
    this.gettMusicalGendersBySlug();
    this.loadFavouriteArtists();
  },
  computed: {
    ...mapGetters("favouriteArtists", ["stateFavouriteArtists"]),
    ...mapState({
      clientMusicalGenders: (state) =>
        state.clientMusicalGenders.artistsGenders,
    }),
    ...mapState({
      favouriteArtists: (state) => state.favouriteArtists.message,
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
<style lang="css" scoped>
.imageArtist {
  max-height: 200px;
  min-height: 200px;
  object-fit: cover;
}
.search {
  cursor: pointer;
}
.search:hover {
  color: #ff78a5;
}
.uppercase {
  text-transform: uppercase;
}
.parallax-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  z-index: 1;
}
.parallax-wrapper {
  position: relative;
  height: 280px;
}
.parallax-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65));
  z-index: 1;
  pointer-events: none;
}
.parallax-content {
  z-index: 2;
}
.parallax-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 30px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.8);
}
.parallax-desc {
  font-size: 1.1rem;
  max-width: 600px;
  text-shadow: 0 0 20px rgba(255,255,255,0.2), 0 2px 10px rgba(0,0,0,0.7);
}
</style>
