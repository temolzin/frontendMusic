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
            <div v-if="filteredPurchases.length === 0" class="text-center q-pa-lg">
              <p class="text-h6 text-grey-7">No tienes compras registradas</p>
            </div>
            <div v-else>
              <q-markup-table dense flat bordered class="table-responsive">
                <tbody v-for="(purchase, index) in filteredPurchases" :key="index">
                  <tr class="bg-primary text-white text-center">
                    <th style="font-size: 15px">
                      {{ formatDate(purchase.created_at) }}
                    </th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <td>
                      <div class="text-center">
                        <q-img :src="purchase.artist?.image" loading="lazy" width="100px" height="100px"
                          style="object-fit: cover" class="rounded-circle q-responsive" />
                      </div>
                    </td>
                    <td class="text-left">
                      <strong class="bf-ui-rich-text">Contratado el {{ formatDate(purchase.created_at) }}</strong>
                      <br>
                      <br class="detail-artist-name">{{ purchase.artist?.name || 'N/A' }}
                      <br class="detail-artist-zone">{{ purchase.artist?.zone || 'N/A' }}
                      <br class="detail-hours">Monto: ${{ (parseFloat(purchase.amount) || 0).toFixed(2) }} MXN
                      <p></p>
                    </td>
                    <td>
                      <p class="artist-zone">{{ purchase.artist?.manager?.name || 'N/A' }}</p>
                      <p>
                        <q-btn flat rounded color="primary" label="Enviar Mensaje" @click="openChat(purchase)" />
                      </p>
                    </td>
                    <td class="text-left">
                      <q-btn unelevated rounded color="primary" label="ver compra" @click="openOrderModal(purchase)" />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </q-col>
        </q-card-group>
      </div>

      <q-dialog v-model="showModal" transition-show="rotate" transition-hide="rotate">
        <q-card style="width: 450px" class="q-px-sm q-pb-md">
          <q-card-section class="row items-center">
            <div class="text-h6">Detalle de la compra</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="selectedPurchase">
              <div class="text-h7">
                Fecha: {{ formatDate(selectedPurchase.created_at) }}
              </div>
              <q-separator spaced />
              <div class="text-subtitle2"><strong>Artista:</strong> {{ selectedPurchase.artist?.name || 'N/A' }}</div>
              <div class="text-subtitle2"><strong>Monto:</strong> ${{ (parseFloat(selectedPurchase.amount) || 0).toFixed(2) }} MXN</div>
              <q-separator spaced />
              <div class="text-subtitle2"><strong>ID Transacción:</strong></div>
              <div class="text-caption text-primary">{{ selectedPurchase.openpay_transaction_id }}</div>
              <q-separator spaced />
              <div class="text-subtitle2"><strong>Estado:</strong> <span class="text-green">Completado</span></div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="isChatDialogOpen" persistent>
        <q-card style="min-width: 600px; max-width: 80vw; display: flex; flex-direction: column;">
          <q-card-section class="row items-center bg-primary text-white q-pb-sm">
            <div class="text-h6">Chat con {{ activeChatPurchase?.artist?.name || 'el artista' }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section
            class="scroll"
            style="height: 50vh;"
            :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'"
          >
            <div class="q-pa-md row justify-center">
              <div style="width: 100%; max-width: 500px">
                <div v-if="(getChatMessages || []).length === 0" class="text-center text-grey q-py-md">
                  No hay mensajes aún. ¡Escribe el primero!
                </div>
                <q-chat-message
                  v-for="msg in (getChatMessages || [])"
                  :key="msg.id"
                  :name="msg.created_by === getMe?.id ? 'Yo' : activeChatPurchase?.artist?.name"
                  :avatar="msg.created_by === getMe?.id ? (getMe?.image_profile || getMe?.image || 'https://cdn.quasar.dev/img/avatar4.jpg') : activeChatPurchase?.artist?.image"
                  :text="[msg.message]"
                  :sent="msg.created_by === getMe?.id"
                  :bg-color="msg.created_by === getMe?.id ? 'primary' : ($q.dark.isActive ? 'grey-8' : 'positive')"
                  :text-color="msg.created_by === getMe?.id ? 'white' : ($q.dark.isActive ? 'white' : 'black')"
                  :stamp="formatChatDate(msg.created_at)"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-actions
            class="q-pa-md"
            :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'"
            :style="$q.dark.isActive ? 'border-top: 1px solid #424242;' : 'border-top: 1px solid #e0e0e0;'"
          >
            <q-input
              v-model="newMessage"
              outlined
              dense
              class="full-width"
              placeholder="Escribe un mensaje..."
              @keyup.enter="sendMessage"
              :bg-color="$q.dark.isActive ? 'grey-9' : 'white'"
              :label-color="$q.dark.isActive ? 'grey-4' : 'grey-8'"
            >
              <template v-slot:after>
                <q-btn round dense flat icon="send" color="primary" @click="sendMessage" />
              </template>
            </q-input>
          </q-card-actions>
        </q-card>
      </q-dialog>
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
      filterName: "",
      filterDate: "",
      showModal: false,
      selectedPurchase: null,
      isChatDialogOpen: false,
      newMessage: "",
      activeChatPurchase: null,
    };
  },
  methods: {
    ...mapActions("orderDetails", [
      "viewPurchaseHistory",
      "fetchChatMessages",
      "sendChatMessage"
    ]),
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
    formatChatDate(rawDate) {
      if (!rawDate) return '';
      const date = new Date(rawDate);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    openOrderModal(purchase) {
      this.selectedPurchase = purchase;
      this.showModal = true;
    },
    async openChat(purchase) {
      this.$store.commit("orderDetails/setChatMessages", []);
      this.activeChatPurchase = purchase;
      this.isChatDialogOpen = true;
      await this.fetchChatMessages(purchase.id);
    },
    async sendMessage() {
      if (this.newMessage.trim() !== '') {
        const payload = {
          artist_sale_id: this.activeChatPurchase.id,
          message: this.newMessage
        };
        await this.sendChatMessage(payload);
        this.newMessage = '';
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("orderDetails", ["stateListShopingCard", "getChatMessages"]),
    dateOptions() {
      const currentYear = new Date().getFullYear();
      return [
        "Todas",
        "Este mes",
        "Mes pasado",
        "Este año",
        ...Array(currentYear - 2019)
          .fill()
          .map((_, i) => `${currentYear - i - 1}`),
      ];
    },
    filteredPurchases() {
      return this.stateListShopingCard.filter((purchase) => {
        const artistMatch = purchase.artist?.name?.includes(this.filterName) || false;
        let dateMatch = true;

        if (this.filterDate && this.filterDate !== "Todas") {
          const purchaseDate = new Date(purchase.created_at);
          const now = new Date();
          switch (this.filterDate) {
            case "Este mes":
              dateMatch =
                now.getMonth() === purchaseDate.getMonth() &&
                now.getFullYear() === purchaseDate.getFullYear();
              break;
            case "Mes pasado":
              dateMatch =
                now.getMonth() - 1 === purchaseDate.getMonth() &&
                now.getFullYear() === purchaseDate.getFullYear();
              break;
            case "Este año":
              dateMatch = now.getFullYear() === purchaseDate.getFullYear();
              break;
            default:
              dateMatch = parseInt(this.filterDate) === purchaseDate.getFullYear();
          }
        }

        return artistMatch && dateMatch;
      });
    },
  },
  created() {
    this.viewPurchaseHistory();
    console.log("My_Order_Details component created, calling viewPurchaseHistory");
  },
  watch: {
    stateListShopingCard(newVal) {
      console.log("stateListShopingCard updated:", newVal);
    }
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style scoped>
.table-responsive {
  width: 100%;
}

:deep(.q-message-avatar) {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
}
</style>
