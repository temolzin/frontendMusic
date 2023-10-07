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
      <hr/>
    </q-card>
  </div>

  <client-promotion v-if="getMe.role[0] == 'cliente'"></client-promotion>
  <notice-not-info v-if="getMe.role[0] == 'artista'"></notice-not-info>
  <artist-recomendation v-if="getMe.role[0] == 'artista'"></artist-recomendation>
  <client-card v-if="getMe.role[0] == 'cliente'"></client-card>
  <notice-general v-if="getMe.role[0] == 'administrador'"></notice-general >

  <q-page padding>
    <q-table v-if="getMe.role[0] === 'cliente'"
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
              <q-btn flat round color="primary" icon="share" />
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>
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


let $q = useQuasar();

export default {
  components: { ClientCard, ClientPromotion, ArtistRecomendation,NoticeNotInfo,NoticeGeneral},
  name: "Index",
  data() {
    const columns = [{ name: "name", field: "artist.name", sortable: true }];
    return {
      columns,
      skeleton: true,
      showCard: true,
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
    showNotif() {
      $q.notify({
        message:
          "Guarda tus tarjetas de credito o debito, es totalmente seguro. Solo se te pedira el numero de cuenta y la fecha de expiración",
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
      });
    },
    getBackendImageUrl(image) {
      if (image) {
        const rutaCompleta = image;
        const partes = rutaCompleta.split("/");
        const nombreImagen = partes[partes.length - 1];
        return `http://127.0.0.1:8000/storage/user_profile/${nombreImagen}`;
      }
    },
  },
  created() {
    this.gettFavouriteArtists();
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style scoped></style>
