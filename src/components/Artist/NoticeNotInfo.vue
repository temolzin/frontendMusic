<template>
  <div class="q-ma-none" v-if="showInfo == true">
    <q-banner inline-actions rounded class="bg-red text-white">
      <div class="q-ma-md">
        <p class="text-h6 q-mb-sm">
          Aún no registras los datos del grupo o tuyas como solista😥
        </p>
        <p class="q-mt-none">
          Da de alta la información requerida para que puedas ser ofertado en la
          tienda de servicios musicales. Recuerda que la información debe de ser
          verídica y 100 % confiable.
        </p>
      </div>
      <template v-slot:action>
        <q-btn flat label="Vamos ➡" to="/artist/index" />
      </template>
    </q-banner>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";

let $q = useQuasar();

export default {
  name: "NoticeNotInfo",
  data() {
    return {
      showInfo: false,
      dataCard: [],
    };
  },
  methods: {
    ...mapActions("artist", ["getArtist"]),

    async gettArtist() {
      try {
        await this.getArtist();
        console.log(this.artist);
        if (this.artist == null) {
          this.showInfo = true;
        }
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.message,
          });
        }
      }
    },
  },
  computed: {
    ...mapState({
      artist: (state) => state.artist.artist,
    }),
  },
  mounted() {
    $q = useQuasar();
    this.gettArtist();
  },
};
</script>
