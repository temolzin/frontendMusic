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

      <template v-slot:body-cell-lugar="props">
        <q-td :props="props">
          <div class="text-weight-medium">
            <q-icon name="location_on" size="14px" color="grey" class="q-mr-xs" />
            {{ props.row.customer_city }}
          </div>
          <div class="text-caption text-grey q-ml-md">{{ props.row.customer_state }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-evento="props">
        <q-td :props="props">
          <div v-if="props.row.event_date">
            <q-icon name="event" size="14px" color="primary" class="q-mr-xs" />
            <span class="text-weight-medium">{{ formatDate(props.row.event_date) }}</span>
          </div>
          <div v-if="props.row.event_hour" class="text-caption text-grey q-ml-md">
            {{ props.row.event_hour }} hrs
          </div>
          <span v-if="!props.row.event_date" class="text-grey text-caption">Sin fecha</span>
        </q-td>
      </template>

      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <span class="text-weight-bold text-positive text-h6">
            ${{ Number(props.row.amount).toLocaleString('es-MX') }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-fecha_compra="props">
        <q-td :props="props">
          <q-icon name="shopping_cart" size="14px" color="grey" class="q-mr-xs" />
          <span class="text-weight-medium">{{ formatDate(props.row.created_at) }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <q-btn flat rounded color="primary" label="Enviar Mensaje" @click="openChat(props.row)" />
        </q-td>
      </template>

      <template v-slot:body-cell-report="props">
        <q-td :props="props" class="text-center">
          <q-btn
            flat
            rounded
            color="negative"
            icon="report_problem"
            label="Reportar"
            size="sm"
            @click="goToReport(props.row)"
          />
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
                  <q-item-label v-if="col.name === 'lugar'">
                    <div class="text-weight-medium">
                      <q-icon name="location_on" size="14px" color="grey" class="q-mr-xs" />
                      {{ props.row.customer_city }}
                    </div>
                    <div class="text-caption text-grey q-ml-md">{{ props.row.customer_state }}</div>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'evento'">
                    <div v-if="props.row.event_date">
                      <q-icon name="event" size="14px" color="primary" class="q-mr-xs" />
                      <span class="text-weight-medium">{{ formatDate(props.row.event_date) }}</span>
                    </div>
                    <div v-if="props.row.event_hour" class="text-caption text-grey q-ml-md">
                      {{ props.row.event_hour }} hrs
                    </div>
                    <span v-if="!props.row.event_date" class="text-grey text-caption">Sin fecha</span>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'amount'">
                    <span class="text-weight-bold text-positive text-h6">
                      ${{ Number(props.row.amount).toLocaleString('es-MX') }}
                    </span>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'fecha_compra'">
                    <q-icon name="shopping_cart" size="14px" color="grey" class="q-mr-xs" />
                    {{ formatDate(props.row.created_at) }}
                  </q-item-label>
                  <q-item-label v-if="col.name === 'acciones'">
                    <q-btn flat rounded color="primary" label="Enviar Mensaje" @click="openChat(props.row)" />
                  </q-item-label>
                  <q-item-label v-if="col.name !== 'cliente' && col.name !== 'lugar' && col.name !== 'evento' && col.name !== 'amount' && col.name !== 'acciones' && col.name !== 'fecha_compra'">
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

    <notice-no-sales
      v-if="artist != null && (!stateArtistSales || stateArtistSales.length === 0)"
    />

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

  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useQuasar } from "quasar";
import NoticeNoSales from "src/components/Artist/NoticeNoSales.vue";
import NoticeNotInfo from "src/components/Artist/NoticeNotInfo.vue";

let $q;

const columns = [
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: (row) => `${row.customer_first_name} ${row.customer_last_name}`,
    sortable: true,
  },
  {
    name: "lugar",
    label: "Lugar del evento",
    align: "left",
    field: "customer_city",
    sortable: true,
  },
  {
    name: "evento",
    label: "Fecha del evento",
    align: "left",
    field: "event_date",
    sortable: true,
  },
  {
    name: "amount",
    label: "Monto",
    align: "left",
    field: "amount",
    sortable: true,
  },
  {
    name: "fecha_compra",
    label: "Fecha de compra",
    align: "left",
    field: "created_at",
    sortable: true,
  },
  {
    name: "acciones",
    label: "Chat",
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
  name: "ArtistSales",
  components: { NoticeNoSales, NoticeNotInfo },

  data() {
    return {
      columns,
      filter: "",
      isChatDialogOpen: false,
      newMessage: "",
      activeChatPurchase: null,
      chatPolling: null,
    };
  },

  computed: {
    ...mapGetters("artistSales", ["stateArtistSales"]),
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("orderDetails", ["getChatMessages"]),
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
          $q.notify({ type: "negative", message: err.response.data.message });
        }
      }
    },

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
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
      this.$store.commit("orderDetails/setChatMessages", []);
      this.activeChatPurchase = sale;
      this.newMessage = "";
      this.isChatDialogOpen = true;
      await this.fetchChatMessages(sale.id);
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
    },

    goToReport(sale) {
      this.$router.push({ name: 'client.report-incident', params: { saleId: sale.id } });
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

  created() {
    $q = useQuasar();
    this.getArtistSaless();
  },

  mounted() {},
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
</style>
