<template>
  <q-page padding>
    <q-container >
      <div class="q-pa-md" >
        <q-card-group >
          <q-col v-if="showInfo" :span-xs="12" :span-md="8" class="q-mx-auto">
            <q-markup-table dense flat bordered class="table-responsive">
              <thead>
                <tr class="bg-primary">
                  <th class="">
                    <div class="row no-wrap items-center">
                      <div class="q-ml-md text-white"></div>
                      <div class="artist-name-2" style="font-size: 22px " >Artistas</div>
                    </div>
                  </th>

                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>

              <!-- Contenido de la primera tabla aquí -->
              <tbody v-if="showInfo">
                <tr
                  v-for="(product, index) in stateListShopingCard[0]
                    .shopping_card_detail"
                  :key="index"
                >
                  <td>
                    <q-img
                      :src="product.artist.image"
                      loading="lazy"
                      width="80px"
                      height="80px"
                      style="object-fit: cover"
                      class="rounded-circle q-responsive"
                    />
                  </td>
                  <td class="text-left">
                    <span class="artist-name">{{ product.artist.name }}</span>
                    <p class="artist-zone">{{ product.artist.zone }}</p>
                  </td>
                  <td>
                    <q-btn
                      flat
                      round
                      @click="deleteItem(product.artist)"
                      label="Eliminar"
                      color="primary"
                    />
                  </td>

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
                      v-on:click="
                        changeQuantity(product.artist, product.hours, false)
                      "
                      v-else
                    />
                    {{ product.hours }} hora(s)
                    <q-btn
                      flat
                      round
                      icon="add_circle_outline"
                      v-on:click="
                        changeQuantity(product.artist, product.hours, true)
                      "
                    />
                  </td>
                  <td class="text-left">
                    {{
                      "$ " +
                      product.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-col>
        </q-card-group>
      </div>
    </q-container>

    <q-container class="text-center">
      <q-div class="q-pa-md">
        <q-card-group>
          <q-col v-if="showInfo" :span-xs="12" :span-md="6" class="q-mx-auto">
            <q-markup-table dense flat bordered class="table-responsive-2">
              <thead>
                <tr class="bg-primary">
                  <th colspan="8">
                    <h5 class="text-center" style="color: white">Resumen de Compra</h5>
                  </th>
                </tr>
              </thead>
              <!-- Contenido de la segunda tabla aquí -->
              <q-tbody v-if="showInfo">
                <q-tr>
                  <q-td class="q-gutter-md" style="justify-content: center">
                    <q-card class="q-ma-md" style="text-align: center">
                      <q-card-section class="text-center">
                        <table style="text-align: center; margin: 0 auto">
                          <tr>
                            <td>
                              <h7
                                >Total (Pesos)
                                <strong>
                                  {{
                                    "MXN " +
                                    stateListShopingCard[0].total
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
                                  }}</strong
                                >
                                pesos</h7
                              >
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2">
                              <q-btn
                                label="Procesar Pedido"
                                color="primary"
                                @click="
                                  $router.push(
                                    '/client/shopping-cart/dataClient'
                                  )
                                "
                              />
                            </td>
                          </tr>
                        </table>
                      </q-card-section>
                    </q-card>
                  </q-td>
                </q-tr>
              </q-tbody>
            </q-markup-table>
          </q-col>
        </q-card-group>
      </q-div>
    </q-container>
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

<style>
.rounded-circle {
  border-radius: 50%;
}
/* .artist-name {
  font-weight: bold;
  font-style: italic;
  font-size: 15px;
} */
.artist-name-2 {
  /* font-weight: bold;
  font-style: italic;
  font-size: 25px; */
  color: white;
}

.table-responsive-2 {
  overflow-x: hidden;
}


.q-container {
  text-align: center;
}

.artist-name,
.artist-zone {
  width: auto;
}
</style>
