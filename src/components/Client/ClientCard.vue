<template>
  <div class="q-pa-md q-gutter-sm" v-if="showInfo == true">
    <q-banner
      inline-actions
      rounded
      class="bg-warning text-white"
      v-if="showCard == true"
    >
      <div class="q-ma-md">
        <p class="text-h6 q-mb-sm">No tienes métodos de pago registrados. Agrega alguno para comenzar.</p>
        <p class="q-mt-none">
          Guarda tus tarjetas de crédito o débito. Es 100% seguro y confiable.
          Recuerda que no se te pedirá el CVV/CVC o código de seguridad hasta que realices alguna renta
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
import { notifyError } from "src/utils/notify";

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
        if (!Array.isArray(this.cards) || this.cards.length === 0) {
          this.showInfo = true;
        }
      } catch (err) {
        if (err.response.data.message) {
          notifyError(err.message);
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
