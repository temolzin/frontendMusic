<template>
  <q-page padding>
    <div v-if="stateFavouriteArtists[0]">
      <q-table
        grid
        card-class="bg-primary text-white"
        :rows="stateFavouriteArtists"
        :columns="columns"
        row-key="name"
        no-data-label="Sin registros"
        no-results-label="Ningún registro coincidente"
      >
        <template v-slot:top-left>
          <p class="q-mt-sm q-mb-sm text-h4" v-if="skeleton == false">
            Tus Favoritos
            <q-spinner-audio color="accent" class="q-pb-sm" />
          </p>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-skeleton
              class="q-ma-sm"
              height="350px"
              v-if="skeleton == true"
            />
            <q-card class="my-card q-ma-sm" v-if="skeleton == false">
              <q-img :src="props.row.artist.image" class="imageArtist" />

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="fas fa-solid fa-cart-plus"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%)"
                  v-on:click="onSendOrder(props.row.artist)"
                />

                <div class="row no-wrap items-center">
                  <div
                    class="col text-h6 ellipsis search text-weight-regular"
                    @click="search(props.row.artist.slug)"
                  >
                    {{ props.row.artist.name }}
                  </div>

                  <div
                    class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
                  >
                    <q-icon name="map" />
                    <small>{{ props.row.artist.zone }}</small>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  <span class="text-h5 text-primary text-weight-bold">
                    ${{ props.row.artist.price_hour }}.00
                  </span>
                  <small> pesos por hora</small>
                </div>
                <div class="text-caption text-grey ellipsis">
                  {{ props.row.artist.history }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  flat
                  round
                  color="red"
                  icon="fas fa-solid fa-heart"
                  @click="destroy(props.row.artist.id)"
                />
                <q-btn flat round color="primary" icon="share" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { useQuasar, QSpinnerGears, QSpinnerAudio } from "quasar";
import { mapActions, mapGetters } from "vuex";

let $q;

export default {
  name: "FavouriteArtists",
  data() {
    const columns = [{ name: "name", field: "artist.name", sortable: true }];
    return {
      columns,
      skeleton: true,
    };
  },
  methods: {
    ...mapActions("favouriteArtists", ["getFavouriteArtists"]),
    ...mapActions("favouriteArtists", ["deleteFavouriteArtist"]),
    ...mapActions("shoppingCard", ["create_order"]),
    async gettFavouriteArtists() {
      try {
        await this.getFavouriteArtists().then(() => {
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
    destroy(id) {
      try {
        this.deleteFavouriteArtist(id).then(() => {
          this.$q.notify({
            type: "positive",
            message: `Eliminado de Favoritos`,
          });
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

    search(slug) {
      this.$router.push({
        name: "client.view-group-by-gender-slug",
        params: {
          slugMG: "search",
          slugA: slug,
        },
      });
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
      //formData.append("total", total);
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
  },
  created() {
    this.gettFavouriteArtists();
  },
  computed: {
    ...mapGetters("favouriteArtists", ["stateFavouriteArtists"]),
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
</style>
