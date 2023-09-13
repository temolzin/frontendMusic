<template>
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
        no-results-label="Ningún registro coincidente"
        :rows-per-page-label="'Artistas por página:'"
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
            
            <q-card class="my-card q-ma-sm" v-if="skeleton == false">
              <q-img :src="props.row.image" class="imageArtist" />

              <q-card-section>
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
                  v-model="starts"
                  :max="5"
                  size="32px"
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

              <q-card-section class="q-pt-none">
                
                <div class="text-caption text-black ellipsis" v-for="gender in props.row.musical_genders">
                  {{ gender.name }}
                </div>
              </q-card-section>

              <q-separator />
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
    
  </template>
  
  <script>
import { useQuasar, QSpinnerGears, QSpinnerAudio } from "quasar";
  import { mapActions } from "vuex";
  import { mapGetters } from "vuex";
  import { QSelect } from 'quasar';
  import { ref } from "vue";

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
    created() {
      this.getArtistss();
    },
    computed: {
      ...mapGetters("artistList", ["stateArtistList"]),
      mode: function () {
      return this.$q.dark.isActive;
      },
    },
    methods: {
      ...mapActions("artistList", ["getArtists"]),
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

        if (this.filterName ) {
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
      async getArtistss() {
        try {
          await this.getArtists().then(() => {
          this.skeleton = false;
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
.uppercase {
  text-transform: uppercase;
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
