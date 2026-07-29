<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="shadow-1">
        <q-card-section>
          <b class="text-h5">Mis Reportes</b>
        </q-card-section>

        <div v-if="loading" class="text-center q-py-xl">
          <q-spinner color="primary" size="3em" />
        </div>
        <div v-else-if="tickets.length === 0" class="text-center q-py-xl">
          <q-icon name="inbox" size="4em" color="grey-4" />
          <p class="text-grey-6 q-mt-md">No tienes reportes registrados.</p>
        </div>
        
        <q-list v-else separator>
          <q-item
            v-for="ticket in tickets"
            :key="ticket.id"
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-avatar :color="categoryColor(ticket.category)" text-color="white" icon="report_problem" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ categoryLabel(ticket.category) }}
              </q-item-label>
              <q-item-label caption lines="2">{{ ticket.description }}</q-item-label>
              <q-item-label caption class="q-mt-xs text-grey">
                Orden #{{ ticket.artist_sale_id }} — {{ formatDate(ticket.created_at) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side class="items-end">
              <q-badge :color="statusColor(ticket.status)" class="q-px-sm q-py-xs">
                {{ statusLabel(ticket.status) }}
              </q-badge>
              <q-btn
                round
                unelevated
                color="grey-6"
                text-color="white"
                icon="history"
                size="sm"
                class="q-mt-sm"
                @click="openLogs(ticket)"
              >
                <q-tooltip>Historial</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
    <ticket-logs-modal
      v-model="showLogsModal"
      :ticket-id="selectedTicketId"
      :ticket="selectedTicket"
    />
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { notifyError } from 'src/utils/notify';
import TicketLogsModal from 'src/components/admin/SupportTickets/TicketLogsModal.vue';

export default {
  name: 'MyTickets',
  components: { TicketLogsModal },

  data() {
    return {
      loading: false,
      showLogsModal: false,
      selectedTicketId: null,
      selectedTicket: null,
    };
  },

  computed: {
    ...mapGetters('supportTickets', { tickets: 'getMyTickets' }),
  },

  async created() {
    await this.fetchTickets();
  },

  methods: {
    ...mapActions('supportTickets', ['fetchMyTickets']),

    async fetchTickets() {
      this.loading = true;
      try {
        await this.fetchMyTickets();
      } catch {
        notifyError('Error al cargar tus reportes.');
      } finally {
        this.loading = false;
      }
    },

    openLogs(ticket) {
      this.selectedTicketId = ticket.id;
      this.selectedTicket = ticket;
      this.showLogsModal = true;
    },

    formatDate(raw) {
      if (!raw) return '';
      const d = new Date(raw);
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    },

    categoryLabel(cat) {
      const map = {
        no_show: 'El artista no se presentó',
        delay: 'Retraso o cancelación de último minuto',
        bad_service: 'Mal servicio o comportamiento inadecuado',
        cancellation: 'Cancelación',
        other: 'Otro',
      };
      return map[cat] || cat;
    },

    categoryColor(cat) {
      const map = {
        no_show: 'negative',
        delay: 'orange',
        bad_service: 'deep-orange',
        cancellation: 'red',
        other: 'grey',
      };
      return map[cat] || 'grey';
    },

    statusLabel(status) {
      const map = {
        open: 'Abierto',
        under_review: 'En revisión',
        resolved: 'Resuelto',
        rejected: 'Rechazado',
      };
      return map[status] || status;
    },

    statusColor(status) {
      const map = {
        open: 'warning',
        under_review: 'info',
        resolved: 'positive',
        rejected: 'negative',
      };
      return map[status] || 'grey';
    },
  },
};
</script>
