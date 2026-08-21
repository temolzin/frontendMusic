<template>
  <q-page padding>
    <div v-if="stateFavouriteArtists[0]">
      <q-table
        grid
        card-class="bg-primary text-white"
        :rows="stateFavouriteArtists"
        :columns="columns"
        :pagination="pagination"
        row-key="name"
        no-data-label="Sin registros"
        no-results-label="Ningún registro coincidente"
        rows-per-page-label="Favoritos por página"
        :rows-per-page-options="[10, 20, 30, 0]"
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
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  <template v-if="props.row.artist.offers && props.row.artist.offers.length > 0">
                    <q-badge v-bind="getDiscountBadgeColor($q.dark.isActive)" class="q-mb-xs text-weight-medium text-uppercase">
                      {{ formatDiscount(props.row.artist.offers[0].discount_percentage) }}% de descuento
                    </q-badge><br/>
                    <span class="text-h5 text-positive text-weight-bold">
                      {{ formatCurrency(props.row.artist.price_hour * (1 - props.row.artist.offers[0].discount_percentage / 100)) }}
                    </span>
                    <small style="text-decoration: line-through" class="text-red q-ml-xs">
                      {{ formatCurrency(props.row.artist.price_hour) }}
                    </small>
                  </template>
                  <template v-else>
                    <span class="text-h5 text-primary text-weight-bold">
                      {{ formatCurrency(props.row.artist.price_hour) }}
                    </span>
                  </template>
                  <small> por hora</small>
                </div>
                <div class="text-caption text-grey ellipsis">
                  {{ props.row.artist.history }}
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="row items-center q-gutter-xs text-grey-7 q-mb-xs">
                  <q-icon name="map" size="14px" />
                  <span class="text-caption text-weight-medium">{{ props.row.artist.zone }}</span>
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
                <q-btn flat round color="primary" icon="share" @click="copyArtistLink(props.row.artist.slug, 'search')" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
    <div v-else class="q-pa-md q-gutter-sm">
      <q-banner
        inline-actions
        rounded
        class="bg-warning text-white"
      >
        <div class="q-ma-md">
          <p class="text-h6 q-mb-sm">Aún no tienes artistas favoritos en tu lista. Agrega algunos y no te pierdas nada de ellos.</p>
          <p class="q-mt-none">
            Explora la tienda y agrega tus artistas favoritos para verlos aquí.
          </p>
        </div>
        <template v-slot:action>
          <q-btn flat label="Vamos ➡" to="/client/store" />
        </template>
      </q-banner>
    </div>
  </q-page>
</template>

<script>
import { useQuasar, QSpinnerGears, QSpinnerAudio } from "quasar";
import { mapActions, mapGetters } from "vuex";
import { notifySuccess, notifyError, notifyInfo } from "src/utils/notify";
import { openArtistLinkShareSheet } from "src/utils/shareArtistLink";
import { getDiscountBadgeColor } from "src/utils/badgeStyles";
import { formatCurrency } from "src/utils/moneyFormat";

let $q;

export default {
  name: "FavouriteArtists",
  data() {
    const columns = [{ name: "name", field: "artist.name", sortable: true }];
    return {
      columns,
      skeleton: true,
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  methods: {
    getDiscountBadgeColor,
    formatCurrency,
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
          notifyError(err.response.data.message);
        }
      }
    },
    destroy(id) {
      try {
        this.deleteFavouriteArtist(id).then(() => {
          notifySuccess(`Eliminado de Favoritos`);
        });
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
      notifyInfo("Agregando al carrito...", { spinner: QSpinnerGears, timeout: 200 });
      const formData = new FormData();
      formData.append("service_id", artist.id);
      formData.append("name", artist.name);
      const offer = artist.offers && artist.offers.length > 0 ? artist.offers[0] : null;
      const finalPrice = Math.round((offer ? artist.price_hour * (1 - offer.discount_percentage / 100) : artist.price_hour) * 100) / 100;
      formData.append("price", finalPrice);
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
    formatDiscount(value) {
      const num = parseFloat(value);
      return num % 1 === 0 ? parseInt(num) : num;
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
