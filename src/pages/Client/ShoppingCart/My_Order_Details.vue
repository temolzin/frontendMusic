<template>
  <q-page padding>
    <q-container>
      <div class="q-pa-md">
        <q-card-group>
          <div class="bg-primary text-white text-left" colspan="6">
            <div colspan="6" class="artist-name-2" style="font-size: 22px; border-radius: 5px">
              Mis Compras
            </div>
          </div>
          
          <div class="q-py-md">
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm-6">
                <q-input rounded outlined v-model="filterName" placeholder="Buscar por nombre...">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
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
            <div v-if="filteredPurchases.length > 0">
              <q-markup-table dense flat bordered class="table-responsive">
                <tbody v-for="(purchase, index) in filteredPurchases" :key="index">
                  <tr v-if="index === 0 || formatDate(purchase.created_at) !== formatDate(filteredPurchases[index - 1].created_at)" class="bg-primary text-white text-center">
                    <th style="font-size: 15px">
                      {{ formatDate(purchase.created_at) }}
                    </th>
                    <th></th>
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
                    <td class="text-center">
                      <div class="text-subtitle2 q-mb-xs" :class="eventStatusColor(purchase.event_status)">
                        {{ eventStatusLabel(purchase.event_status) }}
                      </div>
                      <div v-if="isEventCompleted(purchase)">
                        <q-btn
                          size="sm"
                          unelevated
                          rounded
                          color="amber"
                          :text-color="$q.dark.isActive ? 'white' : 'dark'"
                          icon="star"
                          label="CALIFICAR"
                          @click="openRatingModal(purchase)"
                        />
                      </div>
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
              <div class="text-subtitle2"><strong>Estado:</strong> 
                <span :class="selectedPurchase.status === 'pending' ? 'text-orange' : 'text-green'">
                  {{ selectedPurchase.status === 'pending' ? 'Pendiente' : 'Completado' }}
                </span>
              </div>

              <q-separator spaced />
              <div class="text-subtitle2"><strong>Estado del Evento:</strong>
                <span :class="eventStatusColor(selectedPurchase.event_status)">
                  {{ eventStatusLabel(selectedPurchase.event_status) }}
                </span>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="isRatingModalOpen" persistent>
        <q-card style="min-width: 350px; border-radius: 12px;">
          <q-card-section class="bg-primary text-white row items-center">
            <div class="text-h6">Calificar Servicio</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="column items-center q-pt-xl q-pb-xl">
            <template v-if="isLoadingRating">
              <q-spinner color="primary" size="3em" />
              <div class="text-subtitle2 q-mt-md text-grey">Cargando calificación...</div>
            </template>
            <template v-if="!isLoadingRating">
              <div class="text-subtitle1 q-mb-md text-center">
                ¿Qué te pareció el servicio de <strong>{{ transactionToRate?.artist?.name || 'este artista' }}</strong>?
              </div>
              <q-rating
                v-model="ratingValue"
                size="3em"
                color="yellow"
                icon="star_border"
                icon-selected="star"
                no-reset
                @update:model-value="submitTransactionRating"
              />
            </template>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="isChatDialogOpen" persistent>
        <q-card style="width: 90vw; max-width: 600px; display: flex; flex-direction: column;">
          <q-card-section class="row items-center bg-primary text-white q-pb-sm">
            <div class="text-h6">Chat con {{ activeChatPurchase?.artist?.name || 'el artista' }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section
            class="scroll"
            style="height: 50vh;"
            :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'"
            ref="chatScrollArea"
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
                  :stamp="getStamp(msg)"
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
      chatPolling: null,
      isRatingModalOpen: false,
      transactionToRate: null,
      ratingValue: 0,
      isLoadingRating: false,
    };
  },
  methods: {
    ...mapActions("orderDetails", [
      "viewPurchaseHistory",
      "fetchChatMessages",
      "sendChatMessage",
      "fetchArtistRating",
      "submitArtistRating"
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
    getStamp(msg) {
      const time = this.formatChatDate(msg.created_at);
      if (msg.created_by === this.getMe?.id) {
        return msg.is_read ? `${time}  ✓✓` : `${time}  ✓`;
      }
      return time;
    },
    openOrderModal(purchase) {
      this.selectedPurchase = purchase;
      this.showModal = true;
    },
    eventStatusColor(status) {
      if (status === 'completed') return 'text-green';
      if (status === 'expired') return 'text-red';
      return 'text-orange';
    },
    eventStatusLabel(status) {
      if (status === 'completed') return 'Completado';
      if (status === 'expired') return 'Expirado';
      return 'Pendiente';
    },
    isEventCompleted(purchase) {
      return purchase && purchase.event_status === 'completed';
    },
    async openRatingModal(purchase) {
      this.transactionToRate = purchase;
      this.ratingValue = this.getArtistRatings[purchase.id] || 0;
      this.isRatingModalOpen = true;
      this.isLoadingRating = true;

      try {
        await this.fetchArtistRating({
          artistId: purchase.artist.id,
          purchaseId: purchase.id
        });
        this.ratingValue = this.getArtistRatings[purchase.id] || 0;
      } catch (e) {
        console.error("No se pudo cargar la calificación previa", e);
      } finally {
        this.isLoadingRating = false;
      }
    },
    async submitTransactionRating(val) {
      if (!val || val === 0) return;

      try {
        await this.submitArtistRating({
          artistId: this.transactionToRate.artist.id,
          purchaseId: this.transactionToRate.id,
          rating: val
        });

        this.$q.notify({
          type: "positive",
          message: "¡Calificación guardada con éxito!",
          position: "top"
        });
        
        setTimeout(() => {
          this.isRatingModalOpen = false;
        }, 600);

      } catch (err) {
        console.error("Error al calificar:", err);
        this.$q.notify({
          type: "negative",
          message: "Error al guardar la calificación",
          position: "top"
        });
      }
    },
    async openChat(purchase) {
      this.$store.commit("orderDetails/setChatMessages", []);
      this.activeChatPurchase = purchase;
      this.newMessage = "";
      this.isChatDialogOpen = true;
      await this.fetchChatMessages(purchase.id);
      this.scrollToBottom();
    },
    async sendMessage() {
      const messageText = this.newMessage.trim();
      if (messageText !== '') {
        const payload = {
          artist_sale_id: this.activeChatPurchase.id,
          message: messageText,
        };

        const sentMessage = await this.sendChatMessage(payload);
        if (sentMessage) {
          this.newMessage = '';
          await this.fetchChatMessages(this.activeChatPurchase.id);
          this.scrollToBottom();
        }
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatScrollArea) {
          const scrollTarget = this.$refs.chatScrollArea.$el || this.$refs.chatScrollArea;
          scrollTarget.scrollTop = scrollTarget.scrollHeight;
        }
      });
    }
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("orderDetails", ["stateListShopingCard", "getChatMessages", "getArtistRatings"]),
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
    },
    isChatDialogOpen(newVal) {
      if (!newVal) {
        if (this.chatPolling) {
          clearInterval(this.chatPolling);
          this.chatPolling = null;
        }
        return;
      }

      this.chatPolling = setInterval(() => {
        if (this.activeChatPurchase) {
          this.fetchChatMessages(this.activeChatPurchase.id);
        }
      }, 3000);
    },
    getChatMessages(newVal, oldVal) {
      if (newVal && oldVal && newVal.length > oldVal.length) {
        this.scrollToBottom();
      }
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
