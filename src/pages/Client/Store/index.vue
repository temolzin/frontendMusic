<template>
  <q-page class="q-pa-sm">
    <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" swipeable animated control-color="white"
      navigation padding arrows height="300px" class="bg-primary text-white shadow-1 rounded-borders"
      :autoplay="autoplay">
      <q-carousel-slide name="style" class="column no-wrap flex-center"
        img-src="https://cdn.pixabay.com/photo/2016/11/18/15/44/audience-1835431_1280.jpg">
        <div class="absolute-center custom-caption">
          <div class="responsive-text" id="text">
            No pierdas esta oportunidad de hacer realidad tus sueños y
            contratar a tu artista favorito para un evento inolvidable.
            Ahora comienza a planificar tu experiencia única con
            nosotros. ¡No esperes más, el escenario está listo para ti!
          </div>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="tv" class="column no-wrap flex-center cursor-pointer"
        @click="showVideo = true">
        <div class="absolute-center text-center">
          <q-icon name="play_circle_filled" size="64px" class="text-white" />
          <div class="text-white text-subtitle1 q-mt-sm">Ver video promocional</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="layers" class="column no-wrap flex-center"
        img-src="https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_1280.jpg">
        <div class="absolute-center custom-caption">
          <div class="responsive-text" id="text">
            ¡Si tienes un talento musical excepcional, nosotros tenemos la
            plataforma perfecta para impulsar tu carrera artística y hacerte
            conocido en todo el mundo! Contáctanos hoy mismo y te
            registraremos para darle alas a tu sueño musical.
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" to="/about" />
        </div>
      </q-carousel-slide>
    </q-carousel>

    <q-dialog v-model="showVideo" maximized>
      <q-card class="bg-black">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" color="white" v-close-popup />
        </q-bar>
        <q-video
          class="full-height"
          src="https://www.youtube.com/embed/kOkQ4T5WO9E?autoplay=1"
        />
      </q-card>
    </q-dialog>

    <div class="col-lg-2 col-md-6 col-sm-12 col-xs-12">
      <q-card class=" no-shadow" bordered>
        <q-card-section class="text-center text-h6 text-white bg-primary">
            <q-icon name="filter_list"/>
            Filtros
          </q-card-section>
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-6 col-md-2 col-lg-3 filter">
            <q-input rounded outlined borderless  debounce="300" v-model="filterName"
              placeholder="Buscar por nombre... ">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-6 col-md-6 col-lg-3 filter q-col-gutter-sm">
            <q-select rounded outlined v-model="filterZone" label="Zona" :options="zonas()" />
          </div>
          <div class="col-6 col-md-4 col-lg-3 filter">
            <q-select rounded outlined v-model="filterGender" label="Género Musical" :options="generosMusicales()" />
          </div>
          <div class="col-6 col-md-3 col-lg-3 filter">
            <q-range v-model="filterPrice" :min="0" :max="80000" :step="1" :left-label-value="'$ ' + filterPrice.min"
              :right-label-value="'$ ' + filterPrice.max" label-always color="dark-blue" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-7 col-sm-12 col-xs-12">
        <q-table grid card-class="bg-primary text-white" :rows="filteredData()" :columns="columns" row-key="name"
          no-data-label="Sin registros" no-results-label="Ningún registro coincidente"
          :rows-per-page-label="'Artistas por página:'" :rows-per-page-options="[6, 12, 18, 24, 30]"
          v-model:pagination="pagination">
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card class="my-card q-ma-sm" v-show="!skeleton">
                <q-img :src="props.row.image" class="imageArtist" />

                <q-card-section>
                  <q-btn fab color="primary" icon="fas fa-solid fa-cart-plus" class="absolute"
                    style="top: 0; right: 12px; transform: translateY(-50%)" v-on:click="onSendOrder(props.row)" />
                  <div class="row no-wrap items-center">
                    <div class="col text-h6 ellipsis search text-weight-regular"
                      @click="$router.push({ name: 'client.view-group-by-gender-slug', params: { slugMG: props.row.musical_genders[0].slug, slugA: props.row.slug } })">
                      {{ props.row.name }}
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
                    <template v-if="props.row.offers && props.row.offers.length > 0">
                      <q-badge color="warning" class="q-mb-xs">
                        {{ formatDiscount(props.row.offers[0].discount_percentage) }}% de descuento
                      </q-badge><br/>
                      <span class="text-h5 text-positive text-weight-bold">
                        ${{ Math.round(props.row.price_hour * (1 - props.row.offers[0].discount_percentage / 100)).toLocaleString('es-MX') }}.00
                      </span>
                      <small style="text-decoration: line-through" class="text-red q-ml-xs">
                        ${{ props.row.price_hour }}.00
                      </small>
                    </template>
                    <template v-else>
                      <span class="text-h5 text-primary text-weight-bold">
                        ${{ props.row.price_hour }}.00
                      </span>
                    </template>
                    <small> pesos por hora</small>
                  </div>
                  <div class="text-caption text-grey ellipsis">
                    {{ props.row.history }}
                  </div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <div class="row items-center q-gutter-xs text-grey-7 q-mb-xs">
                    <q-icon name="map" size="14px" />
                    <span class="text-caption text-weight-medium">{{ props.row.zone }}</span>
                  </div>
                  <div class="text-caption ellipsis" :class="mode ? 'text-grey-5' : 'text-black'">
                    {{ formatGenres(props.row.musical_genders) }}
                  </div>
                </q-card-section>

                <q-separator />
                <q-card-actions align="right">
                  <q-btn flat round :color="isFavoriteArtist(props.row.id) ? 'red' : 'black'" :icon="isFavoriteArtist(props.row.id) ? 'fas fa-solid fa-heart' : 'far fa-heart'"
                    @click="addFavouriteArtist(props.row.id)" />
                  <q-btn flat round color="primary" icon="share" @click="copyArtistLink(props.row.slug, props.row.musical_genders[0].slug)" />
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>

        <div v-if="stateArtistList == null">
          <div class="q-pa-md">
            <q-card class="my-card">
              <q-parallax src="https://cdn.quasar.dev/img/parallax1.jpg" :height="150" />
              <q-card-section>
                <div class="text-h6">Sin resultados</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
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
  data() {
    const columns = [{ name: "name", field: "name", sortable: true }];
    return {
      selectedGenre: null,
      filter: ref(""),
      columns,
      slug: null,
      skeleton: true,
      searchSlug: null,
      slide: ref("style"),
      autoplay: 10000,
      showVideo: false,
      listCarrito: [],
      favoriteArtistIds: [],
      addFavourite: {
        artist_id: "",
      },
      filterName: '',
      filterZone: '',
      filterGender: '',
      filterPrice: ref({
        min: 100,
        max: 100000,
      }),
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 6,
      },
    };
  },
  methods: {
    ...mapActions("artistList", ["getArtists"]),
    ...mapActions("clientMusicalGenders", ["getMusicalGenders"]),
    ...mapActions("shoppingCard", ["create_order"]),
    ...mapActions("favouriteArtists", ["createFavouriteArtist", "getFavouriteArtists"]),
    formatGenres(genres) {
      return genres.map((genre) => genre.name).join(", ");
    },
    search(slug, slugmg) {
      this.$router.push({
        name: "client.view-group-by-gender-slug",
        params: {
          slugMG: slugmg,
          slugA: slug,
        },
      });
    },

    async getArtistss() {
      try {
        await this.getArtists().then(() => {
          this.skeleton = false;
        });
        if (this.selectedGenre) {
          this.stateArtistList = this.stateArtistList.filter((artist) =>
            artist.musical_genders.some(
              (genre) => genre.slug === this.selectedGenre
            )
          );
        }
      } catch (err) { }
    },
    gettMusicalGenders() {
      try {
        if (this.clientMusicalGenders[0] == null) {
        }
        this.getMusicalGenders();
      } catch (err) {
        if (err.response.data.message) {
          notifyError(err.response.data.message);
        }
      }
    },
    selectGenre(slug) {
      this.selectedGenre = slug;
      this.getArtistss();
      this.$forceUpdate();
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
    },
    onSendOrder(artist) {
      notifyInfo("Agregando al carrito...", { spinner: QSpinnerGears, timeout: 200 });
      const formData = new FormData();
      formData.append("service_id", artist.id);
      formData.append("name", artist.name);
      const offer = artist.offers && artist.offers.length > 0 ? artist.offers[0] : null;
      const finalPrice = Math.round((offer ? artist.price_hour * (1 - offer.discount_percentage / 100) : artist.price_hour) * 100) / 100;
      formData.append("price", finalPrice);
      formData.append("order_date_start", this.printDateStart());
      formData.append("order_date_finish", this.printDateFinish());
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
    padCartDatePart(value) {
      return String(value).padStart(2, "0");
    },
    formatCartDate(date) {
      const year = date.getFullYear();
      const month = this.padCartDatePart(date.getMonth() + 1);
      const day = this.padCartDatePart(date.getDate());
      const hours = this.padCartDatePart(date.getHours());
      const minutes = this.padCartDatePart(date.getMinutes());
      const seconds = this.padCartDatePart(date.getSeconds());
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
    copyArtistLink(artistSlug, genreSlug) {
      const link = `${window.location.origin}/client/musical-genders/${genreSlug}/${artistSlug}`;
      openArtistLinkShareSheet({ q: this.$q, link });
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
    removeDuplicates(arr) {
      const uniqueArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (uniqueArr.indexOf(arr[i]) === -1) {
          uniqueArr.push(arr[i]);
        }
      }
      return uniqueArr;
    },
    zonas() {
      let zones = ["Todos"];
      this.stateArtistList.forEach(artist => {
        zones.push(artist.zone);
      });
      return this.removeDuplicates(zones);
    },
    generosMusicales() {
      let genders = ["Todos"];
      this.stateArtistList.forEach(artist => {
        artist.musical_genders.forEach(gender => {
          genders.push(gender.name);
        });
      });
      return this.removeDuplicates(genders);
    },
    filteredData() {
      let filtered = this.stateArtistList;
      if (this.filterName) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(this.filterName.toLowerCase())
        );
      }
      if (this.filterZone && this.filterZone !== "Todos") {
        filtered = filtered.filter(item => item.zone === this.filterZone);
      }
      if (this.filterGender && this.filterGender !== "Todos") {
        filtered = filtered.filter(artist => {
          return artist.musical_genders.some(gender => gender.name === this.filterGender);
        });
      }
      filtered = filtered.filter(item => {
        const offer = item.offers && item.offers.length > 0 ? item.offers[0] : null;
        const effectivePrice = offer ? item.price_hour * (1 - offer.discount_percentage / 100) : item.price_hour;
        return effectivePrice >= this.filterPrice.min && effectivePrice <= this.filterPrice.max;
      });
      return filtered;
    },
    formatDiscount(value) {
      const num = parseFloat(value);
      return num % 1 === 0 ? parseInt(num) : num;
    },
  },
  computed: {
    ...mapGetters("artistList", ["stateArtistList"]),
    ...mapGetters("favouriteArtists", ["stateFavouriteArtists"]),
    ...mapState({
      clientMusicalGenders: (state) =>
        state.clientMusicalGenders.musicalGenders,
    }),
    ...mapState({
      favouriteArtists: (state) => state.favouriteArtists.message,
    }),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
  created() {
    this.gettMusicalGenders();
    this.getArtistss();
    this.loadFavouriteArtists();
    this.slug = this.$route.params.slug;
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style lang="css" scoped>
@media (max-width: 767px) {
  #text {
    font-size: 11px;
  }
}
.search {
  cursor: pointer;
}
.search:hover {
  color: #ff78a5;
}
</style>
