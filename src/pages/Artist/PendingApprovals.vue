<template>
  <q-page class="q-pa-md">

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
      <template v-slot:top-left>
        <p class="text-h5 q-mb-none q-mt-sm">Solicitudes Pendientes</p>
      </template>

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
        <q-td :props="props">
          <q-badge color="warning" class="q-px-sm q-py-xs">
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
            dense
            color="positive"
            icon="check_circle"
            class="q-mr-sm"
            :loading="loadingId === props.row.id + '_accept'"
            @click="onAccept(props.row.id)"
          >
            <q-tooltip class="bg-positive text-body2">Aceptar</q-tooltip>
          </q-btn>
          <q-btn
            unelevated
            round
            dense
            color="negative"
            icon="cancel"
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
                <q-badge color="warning" class="q-px-sm q-py-xs">
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
                  icon="check_circle"
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
                  icon="cancel"
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

  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

const columns = [
  { name: 'cliente', label: 'Cliente', align: 'left', field: (row) => `${row.customer_first_name} ${row.customer_last_name}`, sortable: true },
  { name: 'evento', label: 'Fecha del evento', align: 'left', field: 'event_date', sortable: true },
  { name: 'lugar', label: 'Lugar', align: 'left', field: 'customer_city', sortable: true },
  { name: 'amount', label: 'Monto', align: 'left', field: 'amount', sortable: true },
  { name: 'payment_method', label: 'Método de pago', align: 'center', field: (row) => row.payment_method === 'card' ? 'Tarjeta' : 'Efectivo', sortable: true },
  { name: 'event_hours', label: 'Horas', align: 'center', field: 'event_hours', sortable: true },
  { name: 'tiempo', label: 'Tiempo restante', align: 'center', field: 'time_remaining_seconds', sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'center', field: 'acciones', sortable: false },
];

export default {
  name: 'PendingApprovals',

  data() {
    return {
      columns,
      loading: false,
      loadingId: null,
      countdownInterval: null,
    };
  },

  computed: {
    ...mapGetters('approvals', { pendingApprovals: 'getPendingApprovals' }),
  },

  async created() {
    await this.loadPending();
    this.startCountdown();
  },

  beforeUnmount() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  },

  methods: {
    ...mapActions('approvals', ['fetchPendingApprovals', 'acceptApproval', 'rejectApproval']),

    async loadPending() {
      this.loading = true;
      try {
        await this.fetchPendingApprovals();
      } catch {
        this.$q.notify({ type: 'negative', message: 'Error al cargar solicitudes.', position: 'top' });
      } finally {
        this.loading = false;
      }
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
        this.$q.notify({ type: 'positive', message: 'Solicitud aceptada. El cobro fue procesado.', position: 'top' });
      } catch (err) {
        const message = err.response?.data?.message || 'Error al aceptar la solicitud.';
        this.$q.notify({ type: 'negative', message, position: 'top' });
      } finally {
        this.loadingId = null;
      }
    },

    async onReject(saleId) {
      this.loadingId = saleId + '_reject';
      try {
        await this.rejectApproval(saleId);
        this.$q.notify({ type: 'warning', message: 'Solicitud rechazada. No se realizará ningún cobro al cliente.', position: 'top' });
      } catch (err) {
        const message = err.response?.data?.message || 'Error al rechazar la solicitud.';
        this.$q.notify({ type: 'negative', message, position: 'top' });
      } finally {
        this.loadingId = null;
      }
    },

    formatDate(raw) {
      if (!raw) return '';
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
