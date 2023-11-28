<template>
  <q-page class="q-pa-sm bg-white">
    <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" swipeable animated control-color="white"
      navigation padding arrows height="300px" class="bg-primary text-white shadow-1 rounded-borders">
      <q-carousel-slide name="style" class="column no-wrap flex-center"
        img-src="https://img.freepik.com/premium-vector/afro-girl-enjoying-music-wearing-sunglasses-headphone-banner_518698-322.jpg">
        <div class="absolute-center custom-caption">
          <div class="responsive-text" id="text">
            No pierdas esta oportunidad de hacer realidad tus sueños y
            contratar a tu artista favorito para un evento inolvidable.
            Regístrate ahora y comienza a planificar tu experiencia única con
            nosotros. ¡No esperes más, el escenario está listo para ti!
          </div>
          <q-btn outline label="Ver más" class="q-mt-md" to="/login" />
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="tv" class="column no-wrap flex-center">
        <q-video class="absolute-full" src="https://www.youtube.com/embed/kOkQ4T5WO9E" />
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
          <q-btn outline label="Ver más" class="q-mt-md" to="/login" />
        </div>
      </q-carousel-slide>
    </q-carousel>

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
          :rows-per-page-label="'Artistas por página:'" :rows-per-page-options="[6, 12, 18, 24, 30]">
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card class="my-card q-ma-sm" v-if="skeleton == false">
                <q-img :src="props.row.image" class="imageArtist" />

                <q-card-section>
                  <q-btn fab color="primary" icon="fas fa-solid fa-cart-plus" class="absolute"
                    style="top: 0; right: 12px; transform: translateY(-50%)" v-on:click="onSendOrder(props.row)" />
                  <div class="row no-wrap items-center">
                    <div class="col text-h6 ellipsis search text-weight-regular"
                      @click="props.row.slug, props.row.musical_genders[0].slug">
                      {{ props.row.name }}
                    </div>
                    <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                      <q-icon name="map" />
                      <small>{{ props.row.zone }}</small>
                    </div>
                  </div>

                  <q-rating v-model="starts" :max="5" size="32px" no-dimming readonly />
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

                <q-card-section class="q-pt-none">
                  <div class="text-caption text-black ellipsis">
                    {{ formatGenres(props.row.musical_genders) }}
                  </div>
                </q-card-section>

                <q-separator />
                <q-card-actions align="right">
                  <q-btn flat round :color="colorHeart" icon="fas fa-solid fa-heart"
                    @click="addFavouriteArtist(props.row.id)" />
                  <q-btn flat round color="primary" icon="share" />
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
      starts: 4,
      searchSlug: null,
      slide: 1,
      slide: ref("style"),
      listCarrito: [],
      colorHeart: "red",
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
    };
  },
  methods: {
    ...mapActions("artistList", ["getArtists"]),
    ...mapActions("clientMusicalGenders", ["getMusicalGenders"]),
    ...mapActions("shoppingCard", ["create_order"]),
    ...mapActions("favouriteArtists", ["createFavouriteArtist"]),
    formatGenres(genres) {
      return genres.map((genre) => genre.name).join(", ");
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
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
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
      $q.notify({
        spinner: QSpinnerGears,
        message: "Agregando al carrito...",
        timeout: 200,
      });
      const formData = new FormData();
      formData.append("service_id", artist.id);
      formData.append("name", artist.name);
      formData.append("price", artist.price_hour);
      formData.append("order_date_start", this.printDateStart());
      formData.append("order_date_finish", this.printDateFinish());
      this.create_order(formData).then(() => {
        $q.notify({
          type: "positive",
          spinner: QSpinnerAudio,
          message: "Artista agregado",
          timeout: 1000,
        });
      });
    },
    printDateStart: function () {
      return new Date().toLocaleString();
    },
    printDateFinish: function () {
      var d = new Date();
      return this.sumarDias(d, 2);
    },
    sumarDias(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return fecha.toLocaleString();
    },
    async addFavouriteArtist(id) {
      this.addFavourite.artist_id = id;
      try {
        await this.createFavouriteArtist(this.addFavourite).then(() => {
          this.$q.notify({
            type: "positive",
            message: this.favouriteArtists,
          });
        });
        this.addFavourite.artist_id = "";
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
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
      filtered = filtered.filter(item =>
        item.price_hour >= this.filterPrice.min && item.price_hour <= this.filterPrice.max
      );
      return filtered;
    },
  },
  computed: {
    ...mapGetters("artistList", ["stateArtistList"]),
    ...mapState({
      clientMusicalGenders: (state) =>
        state.clientMusicalGenders.musicalGenders,
    }),
    ...mapState({
      favouriteArtists: (state) => state.favouriteArtists.message,
    }),
  },
  created() {
    this.gettMusicalGenders();
    this.getArtistss();
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
</style>
