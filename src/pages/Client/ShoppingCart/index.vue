<template>
  <q-page padding>
    <PageBreadcrumbs :items="[{ label: 'Mi Carrito', icon: 'shopping_cart' }]" />
    <q-container v-if="hasCartItems">
      <div class="q-pa-md">
        <q-card-group>
          <q-col :span-xs="12" :span-md="8" class="q-mx-auto">
            <q-markup-table dense flat bordered class="table-responsive">
              <thead>
                <tr class="bg-primary">
                  <th class="">
                    <div class="row no-wrap items-center">
                      <div class="q-ml-md text-white"></div>
                      <div class="artist-name-2" style="font-size: 22px">
                        Artistas
                      </div>
                    </div>
                  </th>

                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <!-- Contenido de la primera tabla aquí -->
              <tbody>
                <tr
                  v-for="product in shoppingCardDetail"
                  :key="product.id || product.artist_id"
                >
                  <td class="text-center">
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
                        changeQuantity(product, false)
                      "
                      v-else
                    />
                    {{ product.hours }} hora(s)
                    <q-btn
                      flat
                      round
                      icon="add_circle_outline"
                      v-on:click="
                        changeQuantity(product, true)
                      "
                    />
                  </td>
                  <td class="text-left">
                    {{ formatCurrency(+product.hours * +product.price) }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-col>
        </q-card-group>
      </div>
    </q-container>

    <q-container class="text-center">
      <div class="q-pa-md" v-if="hasCartItems">
        <q-card-group>
          <q-col :span-xs="12" :span-md="6" class="q-mx-auto">
            <q-markup-table dense flat bordered class="table-responsive-2">
              <thead>
                <tr class="bg-primary">
                  <th colspan="8">
                    <h5 class="text-center" style="color: white">
                      Resumen de Compra
                    </h5>
                  </th>
                </tr>
              </thead>
              <!-- Contenido de la segunda tabla aquí -->
              <q-tbody>
                <q-tr>
                  <q-td class="q-gutter-md" style="justify-content: center">
                    <q-card class="q-ma-md" style="text-align: center">
                      <q-card-section class="text-center">
                        <table style="text-align: center; margin: 0 auto">
                          <tr>
                            <td>
                              Total:
                              <strong>
                                {{ formatCurrency(shoppingCartTotal) }}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2">
                              <q-btn
                                label="Procesar Pedido"
                                style="border-radius: 8px; font-weight: bold;"
                                color="primary"
                                @click="$router.push('/client/shopping-cart/dataClient')"
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
      </div>

      <q-card v-else flat bordered class="empty-cart-card q-pa-xl q-mx-auto q-mt-lg">
        <q-icon name="shopping_cart" color="primary" size="56px" />
        <h5 class="q-mt-md q-mb-sm">Tu carrito está vacío</h5>
        <p class="text-grey-7 q-mb-lg">
          Explora artistas y agrega tus favoritos para reservarlos en minutos.
        </p>
        <q-btn
          color="primary"
          style="border-radius:
          8px; font-weight: bold;"
          label="Ir a la tienda"
          icon="store"
          @click="$router.push('/client/store')"
        />
      </q-card>
    </q-container>
  </q-page>
</template>

<script>
import PageBreadcrumbs from "src/components/PageBreadcrumbs.vue";
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";
import { notifyError, notifySuccess } from "src/utils/notify";
import { formatCurrency } from "src/utils/moneyFormat";

let $q;
export default {
  components: { PageBreadcrumbs },
  data() {
    return {
      item: {
        artist_id: "",
        hours_artist: "",
      },
    };
  },
  methods: {
    formatCurrency,
    ...mapActions("shoppingCard", ["getListShoppingCard"]),
    ...mapActions("shoppingCard", ["deleteItembyId"]),
    ...mapActions("shoppingCard", ["updateItemShoppingCart"]),

    async gettListShoppingCard() {
      try {
        await this.getListShoppingCard();
      } catch (err) {
        if (err.response.data.message) {
          notifyError(err.response.data.message);
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
            message: `¿Estás seguro de eliminar a ${name}?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            try {
              await this.deleteItembyId(artist_id);
              await this.gettListShoppingCard();
              notifySuccess(`${name} fue eliminado correctamente`);
            } catch (err) {
              if (err.response.data.message) {
                notifyError(err.response.data.message);
              }
            }
          });
      } catch (error) {
        console.error(error);
      }
    },

    async changeQuantity(product, type) {
      const nextHours = type ? product.hours + 1 : product.hours - 1;
      const item = {
        artist_id: product.artist_id,
        hours_artist: nextHours,
      };

      try {
        await this.updateItemShoppingCart(item);
        await this.gettListShoppingCard();
      } catch (err) {
        notifyError(
          err.response?.data?.message ?? err.response?.data?.error ?? "No se pudo actualizar la cantidad de horas",
          { timeout: 3000 }
        );
      }
    }
  },
  computed: {
    ...mapGetters("shoppingCard", ["stateListShopingCard"]),
    shoppingCardDetail() {
      return this.stateListShopingCard?.[0]?.shopping_card_detail || [];
    },
    shoppingCartTotal() {
      return this.stateListShopingCard?.[0]?.total || 0;
    },
    hasCartItems() {
      return this.shoppingCardDetail.length > 0;
    },
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

.artist-name-2 {
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

.empty-cart-card {
  max-width: 560px;
}
</style>
