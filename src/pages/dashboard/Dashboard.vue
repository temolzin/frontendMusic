<template>
  <!-- <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" to="/dashboard/home" />
      <q-breadcrumbs-el label="Build" icon="build" />
    </q-breadcrumbs>
  </div> -->
  <client-promotion v-if="getMe.role[0] == 'cliente'"></client-promotion>
  <notice-not-info v-if="getMe.role[0] == 'artista'"></notice-not-info>
  <artist-recomendation v-if="getMe.role[0] == 'artista'"></artist-recomendation>
  <q-page padding>
    <client-card v-if="getMe.role[0] == 'cliente'"></client-card>

    <div class="q-pa-md row items-center justify-center">
      <q-card class="my-card col-12 col-sm-12 col-md-6 col-lg-6">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img :src="getMe.image" />
            </q-avatar>
          </q-item-section>

          <q-item-section class="q-pa-sm">
            <q-item-label class="text-h6 q-mt-sm">
              {{ getMe.name }}
              <q-btn round color="primary" icon="edit" />
            </q-item-label>
            <q-item-label caption>{{ getMe.email }}</q-item-label>
          </q-item-section>
        </q-item>
        <hr />
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-mb-sm">
          {{ getMe }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { useQuasar } from "quasar";
import ClientCard from "src/components/Client/ClientCard.vue";
import ClientPromotion from "src/components/Client/ClientPromotion.vue";
import ArtistRecomendation from "src/components/Artist/ArtistRecomendation.vue";
import NoticeNotInfo from "src/components/Artist/NoticeNotInfo.vue"

let $q = useQuasar();

export default {
  components: { ClientCard, ClientPromotion, ArtistRecomendation,NoticeNotInfo },
  name: "Index",
  data() {
    return {
      showCard: true,
    };
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
  },
  methods: {
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
  },

  mounted() {
    $q = useQuasar();
  },
};
</script>

<style scoped></style>
