<template>
  <q-card>
    <div>
      <div class="btn_container">
        <q-btn 
          color="primary" 
          label="Filtros"
          icon="fas fa-filter"
          @click="toggleFilters"
          style="margin-right: 45px; margin-top: 30px; float: right;"
        />
      </div>
      <q-table
        grid
        card-class="bg-primary text-white"
        :rows="filteredData()"
        :columns="columns"
        row-key="name"
        no-data-label="Sin registros"
        no-results-label="Ningún registro coincide"
        :rows-per-page-label="'Artistas por página:'"
        :rows-per-page-options="[6, 12 , 18 , 24, 30]"
      >
      <template v-slot:top class="template_filters">

          <div class="col-8 col-md-2 col-lg-2 filter" v-if="showFilters">
            <q-select
              v-model="filterZone"
              label="Zona"
              :options="zonas()"
            />
          </div>
          <div class="col-8 col-md-2 col-lg-2 filter" v-if="showFilters" >
            <q-select
              v-model="filterGender"
              label="Género Musical"
              :options="generosMusicales()"
            />
          </div>
          <div class="col-8 col-md-2 col-lg-2 filter" v-if="showFilters">
            <q-range
              v-model="filterPrice"
              :min="0"
              :max="80000"
              :step="1"
              :left-label-value="'$ ' + filterPrice.min"
              :right-label-value="'$ ' + filterPrice.max"
              label-always
              color="dark-blue"
            />
          </div>
          <div class="col-8 col-md-2 col-lg-2 filter" v-if="showFilters">
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filterName"
              placeholder="Buscar por nombre... "
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        <q-skeleton width="400px" v-if="skeleton == true" />
      </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            
            <q-skeleton class="q-ma-sm" height="350px" v-show="skeleton" />
            
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
                    @click="search(props.row.slug, props.row.musical_genders[0].slug)"
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
                  <template v-if="props.row.offers && props.row.offers.length > 0">
                    <q-badge v-bind="getDiscountBadgeColor($q.dark.isActive)" class="q-mb-xs text-weight-medium text-uppercase">
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
                <div class="text-caption ">
                  {{ formatGenres(props.row.musical_genders) }}
                </div>
              </q-card-section>

              <q-separator />
              <q-card-actions align="right">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="share"
                  @click="copyArtistLink(props.row.slug, props.row.musical_genders[0].slug)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>

    <div v-if="stateArtistList == null">
      <div class="q-pa-md">
        <q-card class="my-card">
          <q-parallax
            src="https://cdn.quasar.dev/img/parallax1.jpg"
            :height="150"
          />
          <q-card-section>
            <div class="text-h6">Sin resultados</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-card> 
</template>
  
  <script>
  import { useQuasar, QSelect, QSpinnerGears, QSpinnerAudio } from "quasar";
  import { mapActions, mapGetters } from "vuex";
  import { getDiscountBadgeColor } from "src/utils/badgeStyles";
  import { ref } from "vue";
  import { notifyError, notifySuccess, notifyInfo } from "src/utils/notify";
  import { openArtistLinkShareSheet } from "src/utils/shareArtistLink";

  let $q;

  export default {
    components: {
      QSelect
    },
    data() {
      
      const columns = [{ name: "name", field: "name", sortable: true }];
      return {
        columns,
        skeleton: true,
        showFilters: false,
        filterName: '',
        filterZone: '',
        filterGender: '',
        filterPrice: ref({
          min: 100,
          max: 100000,
        }),
      };
    },
    watch: {
      '$route.query': {
        immediate: true,
        handler() {
          this.getArtistss();
        }
      }
    },
    computed: {
      ...mapGetters("artistList", ["stateArtistList"]),
      mode: function () {
      return this.$q.dark.isActive;
      },
    },
    methods: {
      getDiscountBadgeColor,
      ...mapActions("artistList", ["getArtists"]),
      ...mapActions("shoppingCard", ["create_order"]),
      formatGenres(genres) {
      return genres.map(genre => genre.name).join(', ');
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

        if (this.$route.query.offers === 'true') {
          filtered = filtered.filter(a => a.offers && a.offers.length > 0);
        }

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
      toggleFilters() {
        this.showFilters = !this.showFilters;
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
      copyArtistLink(artistSlug, genreSlug) {
        const link = `${window.location.origin}/client/musical-genders/${genreSlug}/${artistSlug}`;
        openArtistLinkShareSheet({ q: this.$q, link });
      },
      async getArtistss() {
        try {
          await this.getArtists().then(() => {
          this.skeleton = false;
        });
        } catch (err) {
          if (err.response.data.message) {
            notifyError(err.response.data.message);
          }
        }
      },
      formatDiscount(value) {
        const num = parseFloat(value);
        return num % 1 === 0 ? parseInt(num) : num;
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
    },
    mounted() {
      $q = useQuasar();
    }
    
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

.filter {
  margin: 20px;
}

.btn_container {
  width: 100vw;
  height: 70px;
  position: relative;
}

</style>
