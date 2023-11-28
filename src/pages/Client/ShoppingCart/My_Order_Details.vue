<template>
  <q-page padding>
    <q-container>
      <div class="q-pa-md">
        <q-card-group>
          <div class="bg-primary text-white text-left" colspan="5">
            <div colspan="5" class="artist-name-2" style="font-size: 22px; border-radius: 5px">
              Mis Compras
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="q-pa-md col-md-5" style="border-right: 2px solid #b7abab; width: 550px">
                <q-input rounded outlined v-model="filterName" placeholder="Buscar por nombre...">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="q-pa-md" style="width: 585px">
                <q-select class="text-left" v-model="filterDate" :options="dateOptions" label="Todas">
                  <img class="bf-ui-icon bf-ui-icon--filter"
                    src="https://http2.mlstatic.com/frontend-assets/bf-ui-library/3.5.0/assets/icons/filter.svg" style="
                      width: 30px;
                      height: 24px;
                      position: absolute;
                      top: 55%;
                      left: 90%;
                      transform: translate(80%, -50%);
                    " />
                </q-select>
              </div>
            </div>
          </div>

          <q-col :span-xs="12" :span-md="8" class="q-mx-auto">
            <q-markup-table dense flat bordered class="table-responsive">
              <tbody v-for="(order, index) in filteredListShopingCard" :key="index">
                <tr class="bg-primary text-white text-center">
                  <th style="font-size: 15px">
                    {{ formatDate(order.order_date_start) }}
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr v-for="(detail, index) in order.shopping_card_detail" :key="index">
                  <td>
                    <div class="text-center">
                      <q-img :src="detail.artist.image" loading="lazy" width="100px" height="100px"
                        style="object-fit: cover" class="rounded-circle q-responsive" />
                    </div>
                  </td>
                  <td class="text-left">
                      <strong class="bf-ui-rich-text">Contratado el
                        {{ formatDate(order.order_date_finish) }}</strong>
                    <br>
                    <br class="detail-artist-name">{{ detail.artist.name }}
                    <br class="detail-artist-zone">{{ detail.artist.zone }}
                    <br class="detail-hours">H | {{ detail.hours }} hora(s)
                    <p></p>
                  </td>
                  <td>
                    <p class="artist-zone">{{ detail.artist.manager.name }}</p>
                    <p>
                      <q-btn flat rounded color="primary" label="Enviar Mensaje" />
                    </p>
                  </td>
                  <td class="text-left">
                    <q-btn unelevated rounded color="primary" label="ver compra" @click="this.showModal = true; showOrderDetails({ order })" />
                  </td>
                  <q-dialog v-model="showModal" transition-show="rotate" transition-hide="rotate">
                    <q-card style="width: 300px" class="q-px-sm q-pb-md">
                      <q-card-section class="row items-center">
                        <div class="text-h6">Detalle de la compra</div>
                      </q-card-section>
                      <q-separator />
                      <q-card-section>
                        <div class="text-h6">
                          {{ formatDate(order.order_date_start) }}
                        </div>
                        <q-separator spaced />
                        <div>Artistas:</div>
                        <div>Descuento: - {{ order.total }}</div>
                        <div>Total: - {{ order.total }}</div>
                        <q-separator spaced />
                        <div>Pago - 3x $910</div>
                        <div>Mastercard ***</div>
                      </q-card-section>
                      <q-card-actions align="right">
                        <q-btn flat label="Cerrar" color="primary" v-close-popup />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </tr>
              </tbody>
            </q-markup-table>
          </q-col>
        </q-card-group>
      </div>
    </q-container>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";

let $q;
export default {
  data() {
    return {
      shoppingCartDetails: [],
      filterName: "",
      filterDate: "",
      showModal: false,
      showModalList: {},
      stars: "",
      props: {
        order: {
          type: Object,
          required: true,
        },
      },
    };
  },
  methods: {
    ...mapActions("orderDetails", ["viewShoppingCardDetails"]),
    formatDate(rawDate) {
      const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      const parsedDate = new Date(rawDate);
      const day = parsedDate.getDate();
      const monthIndex = parsedDate.getMonth();
      const year = parsedDate.getFullYear();

      return `${day} de ${months[monthIndex]} del ${year}`;
    },
    search(slug, slugmg) {
      this.$router.push({
        name: "client.view-group-by-gender-slug",
        params: {
          slugMG: slugmg,
          slugA: slug,
        },
      });
    },
    showOrderDetails({ order }) {
      this.$set(this.showModalList, order.id, true);
    },
  },
  computed: {
    ...mapGetters("orderDetails", ["stateListShopingCard"]),
    dateOptions() {
      const currentYear = new Date().getFullYear();
      return [
        "Este mes",
        "Mes pasado",
        "Este año",
        ...Array(currentYear - 2019)
          .fill()
          .map((_, i) => `${currentYear - i - 1}`),
      ];
    },
    filteredListShopingCard() {
      return this.stateListShopingCard.filter((order) => {
        const artistMatch = order.shopping_card_detail.some((detail) =>
          detail.artist.name.includes(this.filterName)
        );
        let dateMatch = true;
        if (this.filterDate) {
          const orderDate = new Date(order.order_date_start);
          const now = new Date();
          switch (this.filterDate) {
            case "Este mes":
              dateMatch =
                now.getMonth() === orderDate.getMonth() &&
                now.getFullYear() === orderDate.getFullYear();
              break;
            case "Mes pasado":
              dateMatch =
                now.getMonth() - 1 === orderDate.getMonth() &&
                now.getFullYear() === orderDate.getFullYear();
              break;
            case "Este año":
              dateMatch = now.getFullYear() === orderDate.getFullYear();
              break;
            default:
              dateMatch = parseInt(this.filterDate) === orderDate.getFullYear();
          }
        }
        return artistMatch && dateMatch;
      });
    },
  },
  created() {
    this.viewShoppingCardDetails();
    this.showModalList = this.filteredListShopingCard.reduce((acc, order) => {
      acc[order.id] = false;
      return acc;
    }, {});
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>
<style></style>
