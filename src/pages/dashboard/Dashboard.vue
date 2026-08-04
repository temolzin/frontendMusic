<template>
  <div v-if="getMe.role[0] == 'administrador'" >
    <q-card>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="getBackendImageUrl(getMe.image)" />
          </q-avatar>
        </q-item-section>

        <q-item-section class="q-pa-sm" >
          <q-item-label class="text-h6 q-mt-sm">
            {{ getMe.name }}
            <q-btn round color="primary" icon="edit" to="/dashboard/user/profile"/>
          </q-item-label>
          <q-item-label caption>{{ getMe.email }}</q-item-label>
          <p class="user-role">Rol: {{ getMe.role[0] }}</p>
        </q-item-section>
      </q-item>
    </q-card>
  </div>

  <client-promotion v-if="getMe.role[0] == 'cliente'"></client-promotion>
  <notice-not-info v-if="getMe.role[0] == 'artista'"></notice-not-info>
  <artist-recomendation v-if="getMe.role[0] == 'artista'"></artist-recomendation>
  <div v-if="getMe.role[0] == 'artista'" class="row q-pa-lg q-col-gutter-md justify-center">
    <div class="col-12 col-sm-6 col-md-4">
      <q-card class="text-center shadow-4">
        <q-card-section>
          <q-icon name="favorite" color="red" size="40px" />
          <div class="text-h4 text-weight-bold q-mt-sm">{{ stats.favorites }}</div>
          <div class="text-subtitle2 text-grey">Personas te tienen como favorito</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-sm-6 col-md-4">
      <q-card class="text-center shadow-4">
        <q-card-section>
          <q-icon name="star" color="yellow" size="40px" />
          <div class="text-h4 text-weight-bold q-mt-sm">{{ stats.rating }}</div>
          <div class="text-subtitle2 text-grey">Calificación promedio ({{ stats.totalReviews }} reseñas)</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-sm-6 col-md-4">
      <q-card class="text-center shadow-4">
        <q-card-section>
          <q-icon name="payments" color="green" size="40px" />
          <div class="text-h4 text-weight-bold q-mt-sm">${{ Number(stats.totalSales).toLocaleString('es-MX') }}</div>
          <div class="text-subtitle2 text-grey">Generados en {{ stats.totalHires }} contrataciones</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <client-card v-if="getMe.role[0] == 'cliente'"></client-card>
  <notice-general v-if="getMe.role[0] == 'administrador'"></notice-general>
  <div v-if="getMe.role[0] == 'administrador'" class="q-px-md q-pb-md">
    <q-separator class="q-my-lg" />
    <div class="q-mb-md">
      <div class="text-h4 text-weight-bold">Análisis de Artistas</div>
      <div class="text-caption text-grey">Rendimiento detallado y métricas por talento</div>
    </div>
    <artist-stats />
  </div>

  <div v-if="getMe.role[0] == 'administrador'" class="q-pa-md">
    <q-btn
      unelevated
      color="primary"
      icon="payment"
      label="Configurar OpenPay"
      @click="openpayModal = true"
    />
  </div>

  <q-dialog v-model="openpayModal" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Configuración OpenPay</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-sm q-pb-sm">
        <div class="text-subtitle2 text-grey q-mb-sm">Credenciales de la pasarela de pago</div>

        <q-input
          v-model="openpayForm.openpay_id"
          label="ID de OpenPay"
          outlined
          dense
          class="q-mb-md"
        />
        <q-input
          v-model="openpayForm.openpay_secret"
          label="Llave Secreta"
          outlined
          dense
          :type="showSecret ? 'text' : 'password'"
          class="q-mb-md"
        >
          <template #append>
            <q-icon
              :name="showSecret ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showSecret = !showSecret"
            />
          </template>
        </q-input>
        <q-input
          v-model="openpayForm.openpay_public_key"
          label="Llave Pública"
          outlined
          dense
          class="q-mb-sm"
        />

        <q-toggle
          v-model="openpayForm.openpay_sandbox_mode"
          label="Modo Sandbox (pruebas)"
          color="primary"
          class="q-mt-sm"
        />
        <div class="text-caption text-grey q-ml-xs">
          <template v-if="openpayForm.openpay_sandbox_mode">Activado — las transacciones serán simuladas</template>
          <template v-else>Desactivado — las transacciones serán reales (producción)</template>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-sm">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn
          unelevated
          label="Guardar"
          color="primary"
          :loading="openpayLoading"
          @click="saveOpenpayKeys"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-page padding>
    <q-table v-if="getMe.role[0] === 'cliente' && skeleton == false && stateFavouriteArtists && stateFavouriteArtists.length > 0"
      grid
      card-class="bg-primary text-white"
      :rows="stateFavouriteArtists"
      :columns="columns"
      row-key="name"
      no-data-label="Sin registros"
      no-results-label="Ningún registro coincide"
      :rows-per-page-options="[6, 12 , 18 , 24, 30]"
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
                <template v-if="props.row.artist.offers && props.row.artist.offers.length > 0">
                  <q-badge color="orange" class="q-mb-xs">
                    {{ formatDiscount(props.row.artist.offers[0].discount_percentage) }}% de descuento
                  </q-badge><br/>
                  <span class="text-h5 text-positive text-weight-bold">
                    ${{ Math.round(props.row.artist.price_hour * (1 - props.row.artist.offers[0].discount_percentage / 100)).toLocaleString('es-MX') }}.00
                  </span>
                  <small style="text-decoration: line-through" class="text-red q-ml-xs">
                    ${{ props.row.artist.price_hour }}.00
                  </small>
                </template>
                <template v-else>
                  <span class="text-h5 text-primary text-weight-bold">
                    ${{ props.row.artist.price_hour }}.00
                  </span>
                </template>
                <small> pesos por hora</small>
              </div>
              <div class="text-caption text-grey ellipsis">
                {{ props.row.artist.history }}
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn flat round color="primary" icon="share" @click="copyArtistLink(props.row.artist.slug)" />
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>
    <div v-if="getMe.role[0] === 'cliente' && skeleton == false && (!stateFavouriteArtists || stateFavouriteArtists.length === 0)">
      <p class="q-mt-sm q-mb-sm text-h4" v-if="skeleton == false">
        Tus Favoritos
        <q-spinner-audio color="accent" class="q-pb-sm" />
      </p>
      <q-card flat bordered class="empty-cart-card text-center q-pa-xl q-mx-auto q-mt-lg">
        <q-icon name="favorite_border" color="primary" size="56px" />
        <h5 class="q-mt-md q-mb-sm">Aún no tienes artistas favoritos</h5>
        <p class="text-grey-7 q-mb-lg">
          Agrega tus artistas favoritos.
        </p>
        <q-btn
          color="primary"
          label="VER ARTISTAS"
          icon="search"
          @click="$router.push('/client/store')"
        />
      </q-card>
    </div>
  </q-page>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { useQuasar } from "quasar";
import ClientCard from "src/components/Client/ClientCard.vue";
import ClientPromotion from "src/components/Client/ClientPromotion.vue";
import ArtistRecomendation from "src/components/Artist/ArtistRecomendation.vue";
import NoticeNotInfo from "src/components/Artist/NoticeNotInfo.vue";
import NoticeGeneral from "src/components/admin/NoticeGeneral.vue";
import ArtistStats from "src/components/admin/ArtistStats/ArtistStats.vue";
import { notifySuccess, notifyError, notifyInfo } from "src/utils/notify";

let $q = useQuasar();

export default {
  components: { ClientCard, ClientPromotion, ArtistRecomendation,NoticeNotInfo,NoticeGeneral, ArtistStats},
  name: "Index",
  data() {
    const columns = [{ name: "name", field: "artist.name", sortable: true }];
    return {
      columns,
      skeleton: true,
      showCard: true,
      openpayModal: false,
      showSecret: false,
      openpayLoading: false,
      openpayForm: {
        openpay_id: "",
        openpay_secret: "",
        openpay_public_key: "",
        openpay_sandbox_mode: true,
      },
      stats: {
        favorites: 0,
        rating: 0,
        totalReviews: 0,
        totalSales: 0,
        totalHires: 0,
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("favouriteArtists", ["stateFavouriteArtists"]),
  },
  methods: {
    ...mapActions("favouriteArtists", ["getFavouriteArtists"]),
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
    async loadStats() {
      try {
        const [favRes, ratingRes, salesRes] = await Promise.all([
          this.$api.get("/api/artist/favourite_artists/count"),
          this.$api.get("/api/artist/ratings/average"),
          this.$api.get("/api/artist/sales/stats"),
        ]);
        this.stats.favorites = favRes.data.count;
        this.stats.rating = ratingRes.data.average;
        this.stats.totalReviews = ratingRes.data.total;
        this.stats.totalSales = salesRes.data.total;
        this.stats.totalHires = salesRes.data.count;
      } catch (e) {
        console.error("Error loading stats", e);
      }
    },
    async loadOpenpayKeys() {
      try {
        const res = await this.$api.get("/api/admin/openpay-keys");
        if (res.data.success && res.data.data) {
          this.openpayForm.openpay_id = res.data.data.openpay_id;
          this.openpayForm.openpay_secret = res.data.data.openpay_secret;
          this.openpayForm.openpay_public_key = res.data.data.openpay_public_key;
          this.openpayForm.openpay_sandbox_mode = res.data.data.openpay_sandbox_mode ?? true;
        }
      } catch (e) {
        console.error("Error cargando keys OpenPay", e);
      }
    },
    async saveOpenpayKeys() {
      this.openpayLoading = true;
      try {
        await this.$api.put("/api/admin/openpay-keys", this.openpayForm);
        notifySuccess("Credenciales guardadas correctamente");
        this.openpayModal = false;
      } catch (e) {
        notifyError("Error al guardar las credenciales");
      } finally {
        this.openpayLoading = false;
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
    copyArtistLink(artistSlug) {
      const link = `${window.location.origin}/client/musical-genders/search/${artistSlug}`;
      navigator.clipboard.writeText(link).then(() => {
        notifySuccess('Link copiado al portapapeles');
      });
    },
    showNotif() {
      notifyInfo(
        "Guarda tus tarjetas de crédito o débito, es totalmente seguro. Solo se te pedirá el número de cuenta y la fecha de expiración",
        {
          color: "red",
          actions: [
            {
              label: "Cerrar",
              color: "yellow",
              handler: () => {
                this.showCard = false;
              },
            },
          ],
        }
      );
    },
    getBackendImageUrl(image) {
      const baseURL = this.$q.config.backendUrl;

      if (!image) return null;

      return /^https?:\/\//.test(image) ? image : `${baseURL}${image}`;
    },
    formatDiscount(value) {
      const num = parseFloat(value);
      return num % 1 === 0 ? parseInt(num) : num;
    },
  },
  created() {
    this.gettFavouriteArtists();
    if (this.getMe?.role?.[0] === 'artista') {
      this.loadStats();
    }
    if (this.getMe?.role?.[0] === 'administrador') {
      this.loadOpenpayKeys();
    }
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style>
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
.empty-cart-card {
  max-width: 560px;
}
</style>
