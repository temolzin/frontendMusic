<template>
  <div class="q-pa-md">
    <q-table
      :rows="tickets"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
      no-data-label="Sin tickets registrados"
      no-results-label="No hay tickets que coincidan"
      rows-per-page-label="Tickets por página"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template v-slot:top>
        <b class="text-h5">Tickets de Soporte</b>
        <q-space />
        <q-select
          v-model="filterStatus"
          :options="statusOptions"
          emit-value
          map-options
          outlined
          dense
          label="Estado"
          clearable
          style="min-width: 160px"
          class="q-mr-sm"
          @update:model-value="fetchTickets"
        />
        <q-select
          v-model="filterCategory"
          :options="categoryOptions"
          emit-value
          map-options
          outlined
          dense
          label="Categoría"
          clearable
          style="min-width: 200px"
          @update:model-value="fetchTickets"
        />
      </template>
      <template v-slot:body-cell-event_date="props">
        <q-td :props="props">
          <div class="text-weight-bold">{{ formatDate(props.row.artist_sale?.event_date) }}</div>
          <div class="text-caption text-grey">Orden #{{ props.row.artist_sale_id }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-artist="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.artist_sale?.artist?.name || 'N/A' }}</div>
          <div class="text-caption text-grey">
            Cliente: {{ props.row.artist_sale?.customer?.name || props.row.artist_sale?.customer_first_name || 'N/A' }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-reporter="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.reporter?.name || 'N/A' }}</div>
          <div class="text-caption text-grey">{{ props.row.reporter?.email || '' }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-category="props">
        <q-td :props="props">
          <q-badge v-bind="getSupportTicketCategoryColor(props.row.category, $q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
            {{ categoryLabel(props.row.category) }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge v-bind="getSupportTicketStatusColor(props.row.status, $q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
            {{ statusLabel(props.row.status) }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <q-btn
            round
            unelevated
            color="grey"
            icon="history"
            size="sm"
            class="q-mr-xs"
            @click="openLogs(props.row)"
          >
            <q-tooltip class="bg-grey text-body2">Historial</q-tooltip>
          </q-btn>
          <q-btn
            round
            unelevated
            color="primary"
            icon="visibility"
            size="sm"
            @click="goToDetail(props.row.id)"
          >
            <q-tooltip class="bg-primary text-body2">Ver</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <ticket-logs-modal
      v-model="showLogsModal"
      :ticket-id="selectedTicketId"
      :ticket="selectedTicket"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TicketLogsModal from 'src/components/admin/SupportTickets/TicketLogsModal.vue';
import { notifyError } from 'src/utils/notify';
import { getSupportTicketCategoryColor, getSupportTicketStatusColor } from 'src/utils/badgeStyles';

export default {
  name: 'SupportTicketsIndex',
  components: { TicketLogsModal },
  data() {
    return {
      loading: false,
      filterStatus: null,
      filterCategory: null,
      showLogsModal: false,
      selectedTicketId: null,
      selectedTicket: null,
      columns: [
        { name: 'event_date', label: 'Fecha del Evento', field: (row) => row.artist_sale?.event_date, sortable: true, align: 'center' },
        { name: 'artist', label: 'Evento', field: 'artist', align: 'center' },
        { name: 'reporter', label: 'Reportado por', field: 'reporter', align: 'center' },
        { name: 'category', label: 'Categoría', field: 'category', align: 'center' },
        { name: 'status', label: 'Estado', field: 'status', align: 'center' },
        { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
      ],
      statusOptions: [
        { label: 'Abierto', value: 'open' },
        { label: 'En revisión', value: 'under_review' },
        { label: 'Resuelto', value: 'resolved' },
        { label: 'Rechazado', value: 'rejected' },
      ],
      categoryOptions: [
        { label: 'No se presentó', value: 'no_show' },
        { label: 'Retraso / Cancelación', value: 'delay' },
        { label: 'Mal servicio', value: 'bad_service' },
        { label: 'Cancelación', value: 'cancellation' },
        { label: 'Otro', value: 'other' },
      ],
    };
  },

  computed: {
    ...mapGetters('supportTickets', { tickets: 'getAdminTickets' }),
  },

  async created() {
    await this.fetchTickets();
  },

  methods: {
    ...mapActions('supportTickets', ['fetchAdminTickets']),
    getSupportTicketCategoryColor,
    getSupportTicketStatusColor,

    async fetchTickets() {
      this.loading = true;
      try {
        const filters = {};
        if (this.filterStatus) filters.status = this.filterStatus;
        if (this.filterCategory) filters.category = this.filterCategory;
        await this.fetchAdminTickets(filters);
      } catch {
        notifyError('Error al cargar los tickets.');
      } finally {
        this.loading = false;
      }
    },

    goToDetail(id) {
      this.$router.push({ name: 'admin.support-tickets-show', params: { id } });
    },

    formatDate(raw) {
      if (!raw) return 'N/A';
      const d = new Date(raw);
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    },

    categoryLabel(cat) {
      const map = {
        no_show: 'No se presentó',
        delay: 'Retraso / Cancelación',
        bad_service: 'Mal servicio',
        cancellation: 'Cancelación',
        other: 'Otro',
      };
      return map[cat] || cat;
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

    openLogs(row) {
      this.selectedTicketId = row.id;
      this.selectedTicket = null;
      this.showLogsModal = true;
    },
  },
};
</script>
