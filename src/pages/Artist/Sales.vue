<template>
  <q-page class="q-pa-md">

    <q-table
      v-if="artist != null && stateArtistSales && stateArtistSales.length > 0"
      :rows="stateArtistSales || []"
      :columns="columns"
      row-key="openpay_transaction_id"
      :filter="filter"
      no-data-label="Sin ventas registradas"
      no-results-label="Ningún resultado coincide"
      rows-per-page-label="Ventas por página"
      :rows-per-page-options="[5, 10, 20]"
      flat
      bordered
      class="sales-table"
      :grid="$q.screen.lt.md"
    >
      <template v-slot:top-left>
        <p class="text-h5 q-mb-none q-mt-sm">Mis Ventas</p>
      </template>
      <template v-slot:top-right>
        <q-input
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar..."
          color="primary"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-cliente="props">
        <q-td :props="props">
          <div class="text-weight-bold">
            {{ props.row.customer_first_name }} {{ props.row.customer_last_name }}
          </div>
          <div class="text-caption text-grey">{{ props.row.customer_email }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-evento="props">
        <q-td :props="props">
          <div v-if="props.row.event_date">
            <span class="text-weight-medium">{{ formatDate(props.row.event_date) }}</span>
          </div>
          <div v-if="props.row.event_hour" class="text-caption text-grey">
            {{ props.row.event_hour }} hrs
          </div>
          <span v-if="!props.row.event_date" class="text-grey text-caption">Sin fecha</span>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props" class="text-center">
          <q-badge
            :color="statusColor(props.row)"
            :label="statusLabel(props.row)"
            class="q-pa-sm"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <span class="text-weight-bold text-positive text-h6">
            ${{ Number(props.row.amount).toLocaleString('es-MX') }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <q-btn
            round
            unelevated
            color="primary"
            size="sm"
            @click="openChat(props.row)"
            icon="mail"
            class="q-mr-sm"
          >
            <q-tooltip class="bg-primary text-body2">Enviar Mensaje</q-tooltip>
          </q-btn>
          <q-btn
            round
            unelevated
            color="secondary"
            size="sm"
            @click="openDetailsDialog(props.row)"
            icon="visibility"
          >
            <q-tooltip class="bg-secondary text-body2">Ver detalles</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-report="props">
        <q-td :props="props" class="text-center">
          <q-btn
            round
            unelevated
            color="negative"
            size="sm"
            :disable="!canReport(props.row)"
            @click="goToReport(props.row)"
            icon="error"
          >
            <q-tooltip v-if="!canReport(props.row)" class="bg-negative text-body2" anchor="top middle" self="bottom middle">
              {{ reportTooltip(props.row) }}
            </q-tooltip>
            <q-tooltip v-else class="bg-negative text-body2">Reportar</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="q-pa-sm">
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label caption>{{ col.label }}</q-item-label>
                  <q-item-label v-if="col.name === 'cliente'">
                    <div class="text-weight-bold">
                      {{ props.row.customer_first_name }} {{ props.row.customer_last_name }}
                    </div>
                    <div class="text-caption text-grey">{{ props.row.customer_email }}</div>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'evento'">
                    <div v-if="props.row.event_date">
                      <span class="text-weight-medium">{{ formatDate(props.row.event_date) }}</span>
                    </div>
                    <div v-if="props.row.event_hour" class="text-caption text-grey">
                      {{ props.row.event_hour }} hrs
                    </div>
                    <span v-if="!props.row.event_date" class="text-grey text-caption">Sin fecha</span>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'status'">
                    <q-badge
                      :color="statusColor(props.row)"
                      :label="statusLabel(props.row)"
                      class="q-pa-sm"
                    />
                  </q-item-label>
                  <q-item-label v-if="col.name === 'amount'">
                    <span class="text-weight-bold text-positive text-h6">
                      ${{ Number(props.row.amount).toLocaleString('es-MX') }}
                    </span>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'acciones'">
                    <q-btn
                      round
                      unelevated
                      color="primary"
                      size="sm"
                      @click="openChat(props.row)"
                      icon="mail"
                      class="q-mr-sm"
                    >
                      <q-tooltip class="bg-primary text-body2">Enviar Mensaje</q-tooltip>
                    </q-btn>
                    <q-btn
                      round
                      unelevated
                      color="secondary"
                      size="sm"
                      @click="openDetailsDialog(props.row)"
                      icon="visibility"
                    >
                      <q-tooltip class="bg-secondary text-body2">Ver detalles</q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'report'">
                    <q-btn
                      round
                      unelevated
                      color="negative"
                      size="sm"
                      :disable="!canReport(props.row)"
                      @click="goToReport(props.row)"
                      icon="error"
                    >
                      <q-tooltip v-if="!canReport(props.row)" class="bg-negative text-body2" anchor="top middle" self="bottom middle">
                        {{ reportTooltip(props.row) }}
                      </q-tooltip>
                      <q-tooltip v-else class="bg-negative text-body2">Reportar</q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label v-if="col.name !== 'cliente' && col.name !== 'evento' && col.name !== 'acciones' && col.name !== 'report' && col.name !== 'status' && col.name !== 'amount'">
                    {{ col.value }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>

    <notice-not-info v-if="artist == null" />

    <div v-if="!stateArtistSales || stateArtistSales.length === 0" class="text-center q-pa-lg q-mt-xl">
      <p class="text-h6 text-grey-7">No tienes ventas registradas</p>
    </div>

    <q-dialog v-model="isChatDialogOpen" persistent>
      <q-card style="width: 90vw; max-width: 600px; display: flex; flex-direction: column;">
        <q-card-section class="row items-center bg-primary text-white q-pb-sm">
          <div class="text-h6">
            Chat con {{ activeChatPurchase?.customer_first_name || 'el cliente' }} {{ activeChatPurchase?.customer_last_name || '' }}
          </div>
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
                :name="msg.created_by === getMe?.id ? 'Yo' : (activeChatPurchase?.customer_first_name + ' ' + activeChatPurchase?.customer_last_name)"
                :avatar="msg.created_by === getMe?.id ? (getMe?.image_profile || getMe?.image || 'https://cdn.quasar.dev/img/avatar4.jpg') : (msg.sender?.image_profile || msg.sender?.image || 'https://cdn.quasar.dev/img/avatar3.jpg')"
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
          v-if="getIsChatActive && !chatBackendErrorMessage"
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
              <q-btn 
                round 
                dense 
                flat 
                icon="send" 
                color="primary" 
                @click="sendMessage" 
              />
            </template>
          </q-input>
        </q-card-actions>
        <q-card-actions
          v-else
          class="q-pa-md justify-center items-center text-center animate__animated animate__fadeIn"
          :class="$q.dark.isActive ? 'bg-grey-9 text-grey-4' : 'bg-grey-5 text-grey-1'"
          style="border-top: 1px solid rgba(0, 0, 0, 0.1); min-height: 90px; flex-direction: column;"
        >
          <div class="row items-center justify-center q-gutter-xs q-mb-xs">
            <span class="text-weight-bold text-subtitle1">Chat Deshabilitado</span>
          </div>
          <div class="text-body2 text-weight-medium">
            {{ chatBackendErrorMessage || 'El chat ha sido deshabilitado debido a que el evento ha concluido. Gracias por usar nuestra plataforma, esperamos verte pronto en un nuevo evento.' }}
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isDetailsDialogOpen">
      <q-card style="width: 480px; max-width: 95vw" class="details-dialog">
        <q-card-section class="row items-center bg-primary text-white q-py-md">
          <q-avatar color="white" text-color="primary" icon="receipt_long" />
          <div class="q-ml-md">
            <div class="text-h6">Detalles de la venta</div>
            <div class="text-caption">
              {{ detailsSale?.customer_first_name }} {{ detailsSale?.customer_last_name }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-lg">
          <div class="text-overline text-primary text-weight-bold">Evento</div>
          <div class="detail-row">
            <q-icon name="location_on" size="20px" color="grey-6" />
            <div>
              <div class="detail-label">Lugar del evento</div>
              <div class="detail-value">{{ detailsSale?.customer_city }}, {{ detailsSale?.customer_state }}</div>
            </div>
          </div>
          <div class="detail-row">
            <q-icon name="schedule" size="20px" color="grey-6" />
            <div>
              <div class="detail-label">Horas contratadas</div>
              <div class="detail-value">{{ detailsSale?.event_hours || 'N/A' }} hrs</div>
            </div>
          </div>
          <q-separator class="q-my-md" />
          <div class="text-overline text-primary text-weight-bold">Compra</div>
          <div class="detail-row">
            <q-icon name="shopping_cart" size="20px" color="grey-6" />
            <div>
              <div class="detail-label">Fecha de compra</div>
              <div class="detail-value">{{ formatDate(detailsSale?.created_at) }}</div>
            </div>
          </div>
          <div class="detail-row">
            <q-icon
              :name="detailsSale?.payment_method === 'card' ? 'credit_card' : 'payments'"
              size="20px"
              color="grey-6"
            />
            <div>
              <div class="detail-label">Método de pago</div>
              <q-badge
                :color="detailsSale?.payment_method === 'card' ? 'primary' : 'positive'"
                class="q-px-sm q-py-xs q-mt-xs"
              >
                {{ detailsSale?.payment_method === 'card' ? 'Tarjeta' : 'Efectivo' }}
              </q-badge>
            </div>
          </div>
          <q-separator class="q-my-md" />
          <div class="text-overline text-primary text-weight-bold">Estado</div>
          <div class="detail-row">
            <q-icon name="check_circle" size="20px" :color="paymentStatusColor(detailsSale?.status)" />
            <div>
              <div class="detail-label">Estado del pago</div>
              <q-badge
                :color="paymentStatusColor(detailsSale?.status)"
                class="q-px-sm q-py-xs q-mt-xs"
              >
                {{ paymentStatusLabel(detailsSale?.status) }}
              </q-badge>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { useQuasar } from 'quasar';
import NoticeNoSales from 'src/components/Artist/NoticeNoSales.vue';
import NoticeNotInfo from 'src/components/Artist/NoticeNotInfo.vue';

let $q;

const columns = [
  {
    name: "cliente",
    label: "Cliente",
    align: "center",
    field: (row) => `${row.customer_first_name} ${row.customer_last_name}`,
    sortable: true,
  },
  {
    name: "evento",
    label: "Fecha del evento",
    align: "center",
    field: "event_date",
    sortable: true,
  },
  {
    name: "amount",
    label: "Monto",
    align: "center",
    field: "amount",
    sortable: true,
  },
  {
    name: "status",
    label: "Estado del evento",
    align: "center",
    field: "event_status",
    sortable: true,
  },
  {
    name: "acciones",
    label: "Acciones",
    align: "center",
    field: "acciones",
    sortable: false,
  },
  {
    name: 'report',
    label: 'Reportar',
    align: 'center',
    field: 'report',
    sortable: false,
  },
];

export default {
  name: 'ArtistSales',
  components: { NoticeNoSales, NoticeNotInfo },

  data() {
    return {
      columns,
      filter: '',
      isChatDialogOpen: false,
      newMessage: '',
      activeChatPurchase: null,
      chatPolling: null,
      isDetailsDialogOpen: false,
      detailsSale: null,
      chatBackendErrorMessage: ''
    };
  },

  computed: {
    ...mapGetters('artistSales', ['stateArtistSales']),
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("orderDetails", ["getChatMessages",  "getIsChatActive"]),
  },

  methods: {
    ...mapActions("artistSales", ["getArtistSales"]),
    ...mapActions("artist", ["getArtist"]),
    ...mapActions("orderDetails", [
      "fetchChatMessages",
      "sendChatMessage"
    ]),

    async getArtistSaless() {
      try {
        await this.getArtist();
        if (this.artist != null) {
          await this.getArtistSales();
        }
      } catch (err) {
        if (err?.response?.data?.message) {
          $q.notify({ type: 'negative', message: err.response.data.message });
        }
      }
    },

    statusLabel(row) {
      if (row.event_status === 'cancelled') return 'Cancelado';
      if (row.event_status === 'rejected') return 'Rechazado';
      if (row.event_status === 'expired') return 'Expirado';
      if (row.event_status === 'completed') return 'Completado';
      return 'Pendiente';
    },

    statusColor(row) {
      if (row.event_status === 'cancelled') return 'negative';
      if (row.event_status === 'rejected') return 'negative';
      if (row.event_status === 'expired') return 'grey-7';
      if (row.event_status === 'completed') return 'positive';
      return 'warning';
    },

    canReport(row) {
      const approvalOk = !row.approval_status || row.approval_status === 'accepted';
      const eventPassed = row.event_date ? new Date(row.event_date) < new Date() : false;
      return approvalOk && eventPassed;
    },

    reportTooltip(row) {
      const approvalOk = !row.approval_status || row.approval_status === 'accepted';
      if (!approvalOk) return 'No puedes reportar: la solicitud de este evento aún no ha sido aceptada.';
      const eventPassed = row.event_date ? new Date(row.event_date) < new Date() : false;
      if (!eventPassed) return 'Podrás reportar este evento hasta que la fecha programada haya pasado.';
      return '';
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    paymentStatusLabel(status) {
      if (!status) return 'Pendiente';
      if (status === 'completed') return 'Completado';
      if (status === 'pending') return 'Pendiente';
      if (status === 'failed') return 'Fallido';
      if (status === 'cancelled') return 'Cancelado';
      if (status === 'expired') return 'Expirado';
      return 'Pendiente';
    },

    paymentStatusColor(status) {
      if (status === 'completed') return 'positive';
      if (status === 'failed' || status === 'cancelled' || status === 'expired') return 'negative';
      return 'warning';
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

    async openChat(sale) {
        this.$store.commit('orderDetails/setChatMessages', []);
        this.$store.commit('orderDetails/setChatActive', true); 
        this.activeChatPurchase = sale;
        this.newMessage = '';
        this.chatBackendErrorMessage = '';
        await this.fetchChatMessages(sale.id);
        this.isChatDialogOpen = true;
        this.scrollToBottom();
    },

   async sendMessage() {
      if (this.isChatExpired(this.activeChatPurchase)) {
        this.chatBackendErrorMessage = 'El chat ha sido deshabilitado debido a que el evento ha concluido.';
        return;
      }

      const messageText = this.newMessage.trim();
      if (messageText !== '') {
        const payload = { artist_sale_id: this.activeChatPurchase.id, message: messageText };
        
        try {
          const sentMessage = await this.sendChatMessage(payload);
          if (sentMessage) {
            this.newMessage = '';
            await this.fetchChatMessages(this.activeChatPurchase.id);
            this.scrollToBottom();
          }
        } catch (err) {
          this.chatBackendErrorMessage = err?.response?.data?.message || 'El chat se encuentra cerrado.';
          if (this.chatPolling) {
            clearInterval(this.chatPolling);
            this.chatPolling = null;
          }
        }
      }
    },

    isChatExpired(sale) {
      if (!sale || !sale.event_date) return false;

      let eventDateTimeStr = sale.event_date;
      if (sale.event_hour) {
        eventDateTimeStr += `T${sale.event_hour}`;
      }

      const eventStart = new Date(eventDateTimeStr);
      const durationHours = Number(sale.event_hours) || 0;
      const eventEnd = new Date(eventStart.getTime() + durationHours * 60 * 60 * 1000);

      const expirationDate = new Date(eventEnd.getTime() + (24 * 60 * 60 * 1000));

      return new Date() > expirationDate;
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatScrollArea) {
          const scrollTarget = this.$refs.chatScrollArea.$el || this.$refs.chatScrollArea;
          scrollTarget.scrollTop = scrollTarget.scrollHeight;
        }
      });
    },

    goToReport(sale) {
      this.$router.push({ name: 'client.report-incident', params: { saleId: sale.id } });
    },

    openDetailsDialog(sale) {
      this.detailsSale = sale;
      this.isDetailsDialogOpen = true;
    },
  },

  watch: {
    isChatDialogOpen(newVal) {
      if (!newVal) {
        if (this.chatPolling) {
          clearInterval(this.chatPolling);
          this.chatPolling = null;
        }
        return;
      }

      if (!this.getIsChatActive) {
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
    },
  },

  created() {
    $q = useQuasar();
    this.getArtistSaless();
  },
};
</script>

<style scoped>
.sales-table {
  border-radius: 12px;
}

:deep(.q-message-avatar) {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
}

.details-dialog .detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 12px 0;
}

.details-dialog .detail-label {
  font-size: 12px;
  color: var(--q-color-grey-6, #8a8a8a);
  margin-bottom: 2px;
}

.details-dialog .detail-value {
  font-size: 14px;
  font-weight: 600;
}

.body--dark .details-dialog .detail-label {
  color: #94a3b8;
}

.chat-overlay {
  backdrop-filter: blur(4px);
  z-index: 10;
}
</style>
