<template>
  <div v-if="compact" class="cart-icon-compact q-ma-none">
    <q-icon name="shopping_cart" size="28px" />
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
  </div>

  <q-btn
    v-else
    dense
    round
    flat
    icon="shopping_cart"
    class="q-ma-none"
  >
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
import { notifyError } from "src/utils/notify";
export default {
  name: "Icon-Cart",
  props: {
    compact: {
      type: Boolean,
      default: false,
    },
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
        notifyError(message);
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

<style scoped>
.cart-icon-compact {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.cart-icon-compact :deep(.q-badge) {
  top: -2px;
  right: -6px;
}
</style>
