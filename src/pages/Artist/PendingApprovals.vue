<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="row items-center q-mb-sm">
        <b class="text-h5">
          {{ activeTab === 'pending' ? 'Solicitudes Pendientes' : 'Historial de Solicitudes' }}
        </b>
        <q-space />
        <q-input 
          v-if="activeTab === 'history'"
          dense 
          debounce="100" 
          color="primary" 
          v-model="searchFilter" 
          style="width: 250px"
          placeholder="Buscar..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="pending" label="Pendientes" />
        <q-tab name="history" label="Historial" />
      </q-tabs>
      <q-separator />
    </div>
    <div v-if="activeTab === 'pending'">
      <q-table
        v-if="pendingApprovals && pendingApprovals.length > 0"
        :rows="pendingApprovals"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No tienes solicitudes pendientes por responder"
        rows-per-page-label="Solicitudes por página"
        :rows-per-page-options="[5, 10, 20]"
        flat
        bordered
        :grid="$q.screen.lt.md"
      >
        <template v-slot:body-cell-cliente="props">
          <q-td :props="props">
            <div class="text-weight-bold">
              {{ props.row.customer_first_name }} {{ props.row.customer_last_name }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-evento="props">
          <q-td :props="props" class="text-center">
            <div class="text-weight-medium">{{ formatDate(props.row.event_date) }}</div>
            <div class="text-caption text-grey">{{ props.row.event_hour }} hrs</div>
          </q-td>
        </template>
        <template v-slot:body-cell-lugar="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.customer_city }}</div>
            <div class="text-caption text-grey">{{ props.row.customer_state }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <span class="text-weight-bold text-positive">
              ${{ Number(props.row.amount).toLocaleString('es-MX') }} MXN
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-tiempo="props">
          <q-td :props="props" class="text-center">
            <q-badge v-bind="getDiscountBadgeColor($q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
              <q-icon name="schedule" size="12px" class="q-mr-xs" />
              {{ formatCountdown(props.row.time_remaining_seconds) }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" class="text-center">
            <q-btn
              unelevated
              round
              color="positive"
              size="sm"
              icon="check"
              class="q-mr-sm"
              :loading="loadingId === props.row.id + '_accept'"
              @click="onAccept(props.row.id)"
            >
              <q-tooltip class="bg-positive text-body2">Aceptar</q-tooltip>
            </q-btn>
            <q-btn
              unelevated
              round
              color="negative"
              size="sm"
              icon="close"
              :loading="loadingId === props.row.id + '_reject'"
              @click="onReject(props.row.id)"
            >
              <q-tooltip class="bg-negative text-body2">Rechazar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6">
            <q-card class="q-pa-sm">
              <q-card-section>
                <div class="row items-center q-mb-sm">
                  <div class="text-subtitle1 text-weight-bold">
                    {{ props.row.customer_first_name }} {{ props.row.customer_last_name }}
                  </div>
                  <q-space />
                  <q-badge v-bind="getDiscountBadgeColor($q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
                    <q-icon name="schedule" size="12px" class="q-mr-xs" />
                    {{ formatCountdown(props.row.time_remaining_seconds) }}
                  </q-badge>
                </div>
                <div class="row q-col-gutter-sm text-caption">
                  <div class="col-6">
                    <div class="text-grey">Fecha del evento</div>
                    <div class="text-weight-medium">{{ formatDate(props.row.event_date) }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-grey">Hora</div>
                    <div class="text-weight-medium">{{ props.row.event_hour }} hrs</div>
                  </div>
                  <div class="col-6">
                    <div class="text-grey">Lugar</div>
                    <div class="text-weight-medium">{{ props.row.customer_city }}, {{ props.row.customer_state }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-grey">Monto</div>
                    <div class="text-weight-bold text-positive">
                      ${{ Number(props.row.amount).toLocaleString('es-MX') }} MXN
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions class="q-pa-md row q-col-gutter-sm">
                <div class="col-6 flex flex-center">
                  <q-btn
                    unelevated
                    round
                    color="positive"
                    size="sm"
                    icon="check"
                    :loading="loadingId === props.row.id + '_accept'"
                    @click="onAccept(props.row.id)"
                  >
                    <q-tooltip class="bg-positive text-body2">Sí</q-tooltip>
                  </q-btn>
                </div>
                <div class="col-6 flex flex-center">
                  <q-btn
                    unelevated
                    round
                    color="negative"
                    size="sm"
                    icon="close"
                    :loading="loadingId === props.row.id + '_reject'"
                    @click="onReject(props.row.id)"
                  >
                    <q-tooltip class="bg-negative text-body2">No</q-tooltip>
                  </q-btn>
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
      <div v-else-if="!loading" class="text-center q-py-xl">
        <q-icon name="check_circle" size="4em" color="positive" />
        <p class="text-grey-6 q-mt-md">No tienes solicitudes pendientes por responder.</p>
      </div>
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>
    </div>
    <div v-if="activeTab === 'history'">
      <q-table
        v-if="approvalHistory && approvalHistory.length > 0"
        :rows="filteredHistory"
        :columns="historyColumns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="Aún no tienes solicitudes resueltas"
        rows-per-page-label="Registros por página"
        :rows-per-page-options="[5, 10, 20]"
        flat
        bordered
        :grid="$q.screen.lt.md"
      >
        <template v-slot:body-cell-cliente="props">
          <q-td :props="props">
            <div class="text-weight-bold">
              {{ props.row.customer_first_name }} {{ props.row.customer_last_name }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-evento="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ formatDate(props.row.event_date) }}</div>
            <div class="text-caption text-grey">{{ props.row.event_hour }} hrs</div>
          </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <span class="text-weight-bold">
              ${{ Number(props.row.amount).toLocaleString('es-MX') }} MXN
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-resultado="props">
          <q-td :props="props">
            <q-badge v-bind="getApprovalHistoryStatusColor(props.row.approval_status, $q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
              {{ historyStatusLabel(props.row.approval_status) }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-fecha_respuesta="props">
          <q-td :props="props">
            <span class="text-caption">{{ formatDate(props.row.approval_responded_at) }}</span>
          </q-td>
        </template>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6">
            <q-card class="q-pa-sm">
              <q-card-section>
                <div class="row items-center q-mb-sm">
                  <div class="text-subtitle1 text-weight-bold">
                    {{ props.row.customer_first_name }} {{ props.row.customer_last_name }}
                  </div>
                  <q-space />
                  <q-badge v-bind="getApprovalHistoryStatusColor(props.row.approval_status, $q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
                    {{ historyStatusLabel(props.row.approval_status) }}
                  </q-badge>
                </div>
                <div class="row q-col-gutter-sm text-caption">
                  <div class="col-6">
                    <div class="text-grey">Fecha del evento</div>
                    <div class="text-weight-medium">{{ formatDate(props.row.event_date) }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-grey">Monto</div>
                    <div class="text-weight-bold">
                      ${{ Number(props.row.amount).toLocaleString('es-MX') }} MXN
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="text-grey">Resuelto el</div>
                    <div class="text-weight-medium">{{ formatDate(props.row.approval_responded_at) }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
      <div v-else-if="!loadingHistory" class="text-center q-py-xl">
        <q-icon name="history" size="4em" color="grey-5" />
        <p class="text-grey-6 q-mt-md">Aún no tienes solicitudes resueltas.</p>
      </div>
      <div v-if="loadingHistory" class="text-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getDiscountBadgeColor, getApprovalHistoryStatusColor } from 'src/utils/badgeStyles';
import { notifyError, platformEvents } from 'src/utils/notify';

const columns = [
  { name: 'cliente', label: 'Cliente', align: 'center', field: (row) => `${row.customer_first_name} ${row.customer_last_name}`, sortable: true },
  { name: 'evento', label: 'Fecha del evento', align: 'center', field: 'event_date', sortable: true },
  { name: 'lugar', label: 'Lugar', align: 'center', field: 'customer_city', sortable: true },
  { name: 'amount', label: 'Monto', align: 'center', field: 'amount', sortable: true },
  { name: 'payment_method', label: 'Método de pago', align: 'center', field: (row) => row.payment_method === 'card' ? 'Tarjeta' : 'Efectivo', sortable: true },
  { name: 'event_hours', label: 'Horas', align: 'center', field: 'event_hours', sortable: true },
  { name: 'tiempo', label: 'Tiempo restante', align: 'center', field: 'time_remaining_seconds', sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'center', field: 'acciones', sortable: false },
];

const historyColumns = [
  { name: 'cliente', label: 'Cliente', align: 'center', field: (row) => `${row.customer_first_name} ${row.customer_last_name}`, sortable: true },
  { name: 'evento', label: 'Fecha del evento', align: 'center', field: 'event_date', sortable: true },
  { name: 'amount', label: 'Monto', align: 'center', field: 'amount', sortable: true },
  { name: 'resultado', label: 'Resultado', align: 'center', field: 'approval_status', sortable: true },
  { name: 'fecha_respuesta', label: 'Resuelto el', align: 'center', field: 'approval_responded_at', sortable: true },
];

export default {
  name: 'PendingApprovals',

  data() {
    return {
      columns,
      historyColumns,
      activeTab: 'pending',
      loading: false,
      loadingHistory: false,
      loadingId: null,
      countdownInterval: null,
      searchFilter: '',
    };
  },

  computed: {
    ...mapGetters('approvals', { pendingApprovals: 'getPendingApprovals', approvalHistory: 'getApprovalHistory' }),

    filteredHistory() {
      if (!this.approvalHistory || !this.searchFilter) return this.approvalHistory;
      
      const filter = this.searchFilter.toLowerCase();
      return this.approvalHistory.filter(row => {
        const fullName = `${row.customer_first_name} ${row.customer_last_name}`.toLowerCase();
        const eventDate = this.formatDate(row.event_date).toLowerCase();
        const amount = Number(row.amount).toLocaleString('es-MX');
        
        return fullName.includes(filter) || eventDate.includes(filter) || amount.includes(filter);
      });
    },
  },

  watch: {
    activeTab(tab) {
      if (tab === 'history') {
        this.loadHistory();
      }
    },
  },

  async created() {
    await this.loadPending();
    this.startCountdown();
  },

  beforeUnmount() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  },

  methods: {
    getDiscountBadgeColor,
    getApprovalHistoryStatusColor,
    ...mapActions('approvals', ['fetchPendingApprovals', 'fetchApprovalHistory', 'acceptApproval', 'rejectApproval']),

    async loadPending() {
      this.loading = true;
      try {
        await this.fetchPendingApprovals();
      } catch {
        notifyError('Error al cargar solicitudes.');
      } finally {
        this.loading = false;
      }
    },

    async loadHistory() {
      this.loadingHistory = true;
      try {
        await this.fetchApprovalHistory();
      } catch {
        notifyError('Error al cargar el historial.');
      } finally {
        this.loadingHistory = false;
      }
    },

    historyStatusLabel(status) {
      if (status === 'accepted') return 'Aceptada';
      if (status === 'rejected') return 'Rechazada';
      if (status === 'expired') return 'Expirada';
      if (status === 'cancelled') return 'Cancelada';
      return status;
    },

    startCountdown() {
      this.countdownInterval = setInterval(() => {
        this.$store.commit('approvals/decrementCountdowns');
      }, 1000);
    },

    async onAccept(saleId) {
      this.loadingId = saleId + '_accept';
      try {
        await this.acceptApproval(saleId);
        platformEvents.saleRequestAccepted();
        this.loadHistory();
      } catch (err) {
        const message = err.response?.data?.message || 'Error al aceptar la solicitud.';
        notifyError(message);
      } finally {
        this.loadingId = null;
      }
    },

    async onReject(saleId) {
      this.loadingId = saleId + '_reject';
      try {
        await this.rejectApproval(saleId);
        platformEvents.saleRequestRejected();
        this.loadHistory();
      } catch (err) {
        const message = err.response?.data?.message || 'Error al rechazar la solicitud.';
        notifyError(message);
      } finally {
        this.loadingId = null;
      }
    },

    formatDate(raw) {
      if (!raw) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        const [y, m, d] = raw.split('-');
        return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      const d = new Date(raw);
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    formatCountdown(seconds) {
      if (!seconds || seconds <= 0) return 'Expirada';
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },
  },
};
</script>

<style scoped>
.q-table tbody td {
  height: 60px !important;
  vertical-align: middle;
}

.q-table thead th {
  vertical-align: middle;
}
</style>
