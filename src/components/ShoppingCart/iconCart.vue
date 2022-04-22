<template>
  <q-btn dense round flat icon="shopping_cart" class="q-ma-none">
    <transition
      appear
      enter-active-class="animated rubberBand"
      leave-active-class="animated fadeOut"
      :duration="6000"
    >
      <q-badge color="red" floating transparent>
        {{ numberShopping }}
      </q-badge>
    </transition>
  </q-btn>
  <div style="display: none">
    {{ stateCountListShopingCard.status }}
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";

let $q;
export default {
  name: "Icon-Cart",
  data() {
    return {
      numberShopping: 0,
    };
  },
  methods: {
    ...mapActions("shoppingCard", ["getCountListShoppingCard"]),
    async gettCountListShoppingCard() {
      try {
        await this.getCountListShoppingCard();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async shopping_list_count() {
      if (this.stateCountListShopingCard.length == 0) {
        this.numberShopping = 0;
      } else {
        this.numberShopping =
          this.stateCountListShopingCard[0].shopping_card_detail.length;
      }
    },
  },
  created() {
    this.gettCountListShoppingCard();
  },
  beforeUpdate() {
    this.shopping_list_count();
  },
  computed: {
    ...mapGetters("shoppingCard", ["stateCountListShopingCard"]),
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>
