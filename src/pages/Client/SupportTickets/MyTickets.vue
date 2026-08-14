<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="shadow-1">
        <q-card-section>
          <b class="text-h5">Mis Reportes</b>
          <div class="text-subtitle1 text-grey-7 q-mt-xs">
            Consulta los tickets que has levantado y los que han sido levantados en tu contra.
          </div>
        </q-card-section>
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
        >
          <q-tab name="raised" label="Tickets que levanté" />
          <q-tab name="against" label="Tickets en mi contra" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="raised" class="q-pa-md">
            <div v-if="loadingRaised" class="text-center q-py-xl">
              <q-spinner color="primary" size="3em" />
            </div>
            <div v-else-if="myTickets.length === 0" class="text-center q-py-xl">
              <q-icon name="inbox" size="4em" color="grey-4" />
              <p class="q-mt-md" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">No has levantado ningún ticket.</p>
            </div>
            <q-table
              v-else
              :rows="myTickets"
              :columns="columns"
              row-key="id"
              flat
              bordered
              no-data-label="Sin tickets registrados"
              rows-per-page-label="Registros por página:"
              :rows-per-page-options="[10, 20, 50]"
            >
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
              <template v-slot:body-cell-against="props">
                <q-td :props="props">
                  <div class="text-weight-medium">{{ props.row.artist_sale?.artist?.name || 'N/A' }}</div>
                  <div class="text-caption text-grey">Orden #{{ props.row.artist_sale_id }}</div>
                </q-td>
              </template>
              <template v-slot:body-cell-date="props">
                <q-td :props="props">
                  {{ formatDate(props.row.created_at) }}
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-center">
                  <q-btn
                    round
                    unelevated
                    color="grey-6"
                    text-color="white"
                    icon="history"
                    size="sm"
                    @click="openLogs(props.row)"
                  >
                    <q-tooltip>Ver historial y comentar</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="against" class="q-pa-md">
            <div v-if="loadingAgainst" class="text-center q-py-xl">
              <q-spinner color="primary" size="3em" />
            </div>
            <div v-else-if="customerTickets.length === 0" class="text-center q-py-xl">
              <q-icon name="verified_user" size="4em" color="grey-4" />
              <p class="q-mt-md" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">No tienes reportes en tu contra.</p>
            </div>
            <q-table
              v-else
              :rows="customerTickets"
              :columns="columnsAgainst"
              row-key="id"
              flat
              bordered
              no-data-label="Sin tickets registrados"
              rows-per-page-label="Registros por página:"
              :rows-per-page-options="[10, 20, 50]"
            >
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
              <template v-slot:body-cell-reporter="props">
                <q-td :props="props">
                  <div class="text-weight-medium">{{ props.row.reporter?.name || 'N/A' }}</div>
                  <div class="text-caption text-grey">{{ props.row.reporter?.email || '' }}</div>
                </q-td>
              </template>
              <template v-slot:body-cell-date="props">
                <q-td :props="props">
                  {{ formatDate(props.row.created_at) }}
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-center">
                  <q-btn
                    round
                    unelevated
                    color="grey-6"
                    text-color="white"
                    icon="history"
                    size="sm"
                    @click="openLogs(props.row)"
                  >
                    <q-tooltip>Ver historial y comentar</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
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
import TicketLogsModal from 'src/components/admin/SupportTickets/TicketLogsModal.vue';
import { notifyError } from 'src/utils/notify';
import { getSupportTicketCategoryColor, getSupportTicketStatusColor } from 'src/utils/badgeStyles';

export default {
  name: 'MyTickets',
  components: { TicketLogsModal },

  data() {
    return {
      activeTab: 'raised',
      loadingRaised: false,
      loadingAgainst: false,
      showLogsModal: false,
      selectedTicketId: null,
      selectedTicket: null,

      columns: [
        { name: 'category', label: 'Categoría', field: 'category', align: 'center' },
        { name: 'against', label: 'Artista involucrado', field: 'against', align: 'center' },
        { name: 'date', label: 'Fecha del reporte', field: 'created_at', align: 'center' },
        { name: 'status', label: 'Estado', field: 'status', align: 'center' },
        { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
      ],

      columnsAgainst: [
        { name: 'category', label: 'Categoría', field: 'category', align: 'center' },
        { name: 'reporter', label: 'Reportado por', field: 'reporter', align: 'center' },
        { name: 'date', label: 'Fecha del reporte', field: 'created_at', align: 'center' },
        { name: 'status', label: 'Estado', field: 'status', align: 'center' },
        { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
      ],
    };
  },

  computed: {
    ...mapGetters('supportTickets', {
      myTickets:       'getMyTickets',
      customerTickets: 'getCustomerTickets',
    }),
  },

  watch: {
    activeTab(tab) {
      if (tab === 'against' && this.customerTickets.length === 0 && !this.loadingAgainst) {
        this.fetchAgainst();
      }
    },
  },

  async created() {
    await this.fetchRaised();
  },

  methods: {
    getSupportTicketCategoryColor,
    getSupportTicketStatusColor,
    ...mapActions('supportTickets', ['fetchMyTickets', 'fetchMyCustomerTickets']),

    async fetchRaised() {
      this.loadingRaised = true;
      try {
        await this.fetchMyTickets();
      } catch {
        notifyError('Error al cargar tus reportes.');
      } finally {
        this.loadingRaised = false;
      }
    },

    async fetchAgainst() {
      this.loadingAgainst = true;
      try {
        await this.fetchMyCustomerTickets();
      } catch {
        notifyError('Error al cargar los reportes en tu contra.');
      } finally {
        this.loadingAgainst = false;
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

    statusLabel(status) {
      const map = {
        open: 'Abierto',
        under_review: 'En revisión',
        resolved: 'Resuelto',
        rejected: 'Rechazado',
      };
      return map[status] || status;
    },
  },
};
</script>
