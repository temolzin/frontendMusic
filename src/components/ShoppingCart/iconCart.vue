<template>
  <q-btn dense round flat icon="shopping_cart" class="q-ma-none">
    <transition
      appear
      enter-active-class="animated rubberBand"
      leave-active-class="animated fadeOut"
      :duration="6000"
    >
      <q-badge color="red" floating transparent>
        {{ shoppingCount }}
      </q-badge>
    </transition>
  </q-btn>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Icon-Cart",
  props: {
    fetchOnCreate: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    ...mapActions("shoppingCard", ["getCountListShoppingCard"]),
    async fetchCountListShoppingCard() {
      try {
        await this.getCountListShoppingCard();
      } catch (err) {
        const message = err?.response?.data?.message || "No se pudo actualizar el contador del carrito.";
        this.$q.notify({
          type: "negative",
          message,
        });
      }
    },
  },
  created() {
    if (this.fetchOnCreate) {
      this.fetchCountListShoppingCard();
    }
  },
  computed: {
    ...mapGetters("shoppingCard", ["stateCountListShopingCard"]),
    shoppingCount() {
      return this.stateCountListShopingCard?.[0]?.shopping_card_detail?.length || 0;
    },
  },
};
</script>
