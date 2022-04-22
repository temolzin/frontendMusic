<template>
  <q-page padding>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Precio</th>
          <th class="text-left">Cantidad hr</th>
          <th class="text-left">Acciones</th>
        </tr>
      </thead>
      <tbody v-if="showInfo">
        <tr
          v-for="(product, index) in stateListShopingCard[0]
            .shopping_card_detail"
          :key="index"
        >
          <td class="text-left">{{ product.artist.name }}</td>
          <td class="text-left">{{ product.price }}</td>
          <td class="text-left">
            <q-btn
              flat
              round
              icon="remove_circle_outline"
              v-if="product.hours < 2"
              disable
            />
            <q-btn
              flat
              round
              icon="remove_circle_outline"
              v-on:click="changeQuantity(product.artist, product.hours, false)"
              v-else
            />
            {{ product.hours }} hora(s)
            <q-btn
              flat
              round
              icon="add_circle_outline"
              v-on:click="changeQuantity(product.artist, product.hours, true)"
            />
          </td>
          <td>
            <q-btn
              flat
              round
              icon="delete"
              @click="deleteItem(product.artist)"
            />
          </td>
        </tr>
        <tr class="bg-grey-9">
          <td class="text-left">Total (Pesos)</td>
          <td class="text-left" colspan="3">
            <strong class="text-center"
              >$ {{ stateListShopingCard[0].total }} pesos</strong
            >
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <q-btn
              label="Procesar Pedido"
              color="modedark"
              class="float-right"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";

let $q;
export default {
  // name: 'PageName',
  data() {
    return {
      showInfo: null,
      item: {
        artist_id: "",
        hours_artist: "",
      },
    };
  },
  methods: {
    ...mapActions("shoppingCard", ["getListShoppingCard"]),
    ...mapActions("shoppingCard", ["deleteItembyId"]),
    ...mapActions("shoppingCard", ["updateItemShoppingCart"]),

    async gettListShoppingCard() {
      try {
        await this.getListShoppingCard().then(() => {
          if (this.stateListShopingCard == null) {
            this.showInfo = false;
          } else {
            this.showInfo = true;
          }
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
    deleteItem(artist) {
      try {
        let artist_id = artist.id;
        let name = artist.name;
        console.log(artist_id);
        this.$q
          .dialog({
            title: "Mensaje de confirmación",
            message: `¿Estas seguro de eliminar a ${name}`,
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            try {
              this.deleteItembyId(artist_id);
              this.$q.notify({
                type: "positive",
                message: `${name} fue eliminado correctamente`,
              });
            } catch (err) {
              if (err.response.data.message) {
                $q.notify({
                  type: "negative",
                  message: err.response.data.message,
                });
              }
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    async changeQuantity(artist, cantHours, type) {
      this.item.artist_id = artist.id;

      if (type) {
        this.item.hours_artist = cantHours + 1;
        await this.updateItemShoppingCart(this.item);
      } else {
        this.item.hours_artist = cantHours - 1;
        await this.updateItemShoppingCart(this.item);
      }
    },
  },
  computed: {
    ...mapGetters("shoppingCard", ["stateListShopingCard"]),
  },
  created() {
    this.gettListShoppingCard();
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>
