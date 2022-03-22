<template>
  <div class="q-pa-md q-gutter-sm" v-if="showInfo == true">
    <q-banner
      inline-actions
      rounded
      class="bg-warning text-white"
      v-if="showCard == true"
    >
      <div class="q-ma-md">
        <p class="text-h6 q-mb-sm">No tienes ni una tarjeta guardada 😥</p>
        <p class="q-mt-none">
          Guarda tus tarjetas de Credito o Devito es 100% seguro y confiable ✔.
          Recuerda que no se te pedira el Cvv, hasta que realices alguna renta
          de algún servicio.
        </p>
      </div>

      <template v-slot:action>
        <q-btn flat label="Vamos ➡" to="/client/card" />
      </template>
    </q-banner>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";

let $q = useQuasar();

export default {
  name: "Index",
  data() {
    return {
      showCard: true,
      showInfo: false,
      dataCard: [],
    };
  },
  methods: {
    ...mapActions("card", ["getCards"]),
    async getCard() {
      try {
        await this.getCards();
        if (this.cards == "") {
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
      cards: (state) => state.card.cards,
    }),
  },
  mounted() {
    $q = useQuasar();
    this.getCard();
  },
};
</script>
