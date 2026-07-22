<template>
  <q-page class="q-pa-md">
    <q-table
      v-if="pendingRequests && pendingRequests.length > 0"
      :rows="pendingRequests"
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
      <template v-slot:top>
        <b class="text-h5">Solicitudes de Artistas</b>
      </template>
      <template v-slot:body-cell-artista="props">
        <q-td :props="props" class="text-center">
          <div class="cell-center">
            <div class="text-weight-bold">{{ props.row.proposed_data.name }}</div>
            <div class="text-caption text-grey">{{ props.row.user?.email }}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-tipo="props">
        <q-td :props="props" class="text-center">
          <div class="cell-center">
            <q-badge :color="props.row.request_type === 'creation' ? 'primary' : 'secondary'" class="q-px-sm q-py-xs">
              {{ props.row.request_type === 'creation' ? 'Alta nueva' : 'Edición' }}
            </q-badge>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-zona="props">
        <q-td :props="props" class="text-center">
          <div class="cell-center">{{ props.row.proposed_data.zone }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-precio="props">
        <q-td :props="props" class="text-center">
          <div class="cell-center">
            <span class="text-weight-bold text-positive">
              ${{ Number(props.row.proposed_data.price_hour).toLocaleString('es-MX') }} MXN
            </span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-enviado="props">
        <q-td :props="props" class="text-center">
          <div class="cell-center">{{ formatDate(props.row.created_at) }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <div class="cell-center">
            <div class="row no-wrap items-center justify-center">
              <q-btn
                unelevated
                round
                color="info"
                size="sm"
                icon="compare"
                class="q-mr-sm"
                @click="openCompareDialog(props.row)"
              >
                <q-tooltip class="bg-info text-body2">Comparar</q-tooltip>
              </q-btn>
              <q-btn
                unelevated
                round
                color="positive"
                size="sm"
                icon="check"
                class="q-mr-sm"
                :loading="loadingId === props.row.id + '_accept'"
                :disable="!!loadingId"
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
                :disable="!!loadingId"
                @click="openRejectDialog(props.row.id)"
              >
                <q-tooltip class="bg-negative text-body2">Rechazar</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-td>
      </template>
    </q-table>
    <div v-else-if="!loading" class="text-center q-py-xl">
      <q-icon name="check_circle" size="4em" color="positive" />
      <p class="text-grey-6 q-mt-md">No tienes solicitudes de artistas pendientes por responder.</p>
    </div>
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner color="primary" size="3em" />
    </div>
    <q-dialog v-model="compareDialog">
      <q-card style="min-width: 700px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Perfil actual vs. solicitud</div>
          <div class="text-caption text-grey">
            {{ compareRequest?.request_type === 'creation' ? 'Alta nueva — no hay perfil previo aprobado' : 'Edición de perfil existente' }}
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 text-center">
              <div class="text-caption text-grey q-mb-xs">Foto actual</div>
              <q-avatar size="80px" v-if="compareRequest?.artist?.image">
                <img :src="compareRequest.artist.image">
              </q-avatar>
              <div v-else class="text-caption text-grey">— Sin foto —</div>
            </div>
            <div class="col-6 text-center">
              <div class="text-caption text-grey q-mb-xs">Foto propuesta</div>
              <q-avatar size="80px" v-if="compareRequest?.image_artist_url">
                <img :src="compareRequest.image_artist_url">
              </q-avatar>
              <div v-else class="text-caption text-grey">— Sin cambio —</div>
            </div>
          </div>
          <q-markup-table flat bordered dense>
            <thead>
              <tr>
                <th class="text-left">Campo</th>
                <th class="text-left">Actual</th>
                <th class="text-left">Propuesto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field in compareFields" :key="field.label" :class="{ 'bg-yellow-1': field.changed }">
                <td class="text-weight-bold">{{ field.label }}</td>
                <td>{{ field.current ?? '—' }}</td>
                <td>{{ field.proposed ?? '—' }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="rejectDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Rechazar solicitud</div>
        </q-card-section>
        <q-form @submit="onReject">
          <q-card-section class="q-pt-none">
            <q-input
              v-model="rejectionReason"
              type="textarea"
              label="Motivo del rechazo"
              hint="Se le enviará al artista por correo, sé específico."
              outlined
              autogrow
              :rules="[(val) => !!val || 'El motivo es obligatorio']"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn flat label="Rechazar" color="negative" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

const columns = [
  { name: 'artista', label: 'Artista', align: 'center', field: (row) => row.proposed_data?.name, sortable: true },
  { name: 'tipo', label: 'Tipo', align: 'center', field: 'request_type', sortable: true },
  { name: 'zona', label: 'Zona', align: 'center', field: (row) => row.proposed_data?.zone, sortable: true },
  { name: 'precio', label: 'Precio/hora', align: 'center', field: (row) => row.proposed_data?.price_hour, sortable: true },
  { name: 'enviado', label: 'Enviado', align: 'center', field: 'created_at', sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'center', field: 'acciones', sortable: false },
];

export default {
  name: 'ArtistApprovals',

  data() {
    return {
      columns,
      loading: false,
      loadingId: null,
      rejectDialog: false,
      rejectionReason: '',
      requestIdToReject: null,
      compareDialog: false,
      compareRequest: null,
    };
  },

  computed: {
    ...mapGetters('artistApprovals', { pendingRequests: 'getPendingRequests' }),

    compareFields() {
      if (!this.compareRequest) return [];
      const r = this.compareRequest;
      const p = r.proposed_data || {};
      const current = r.artist;
      const currentManager = current?.manager;
      const money = (val) => (val || val === 0 ? `$${Number(val).toLocaleString('es-MX')} MXN` : null);

      const rows = [
        { label: 'Nombre artístico', current: current?.name, proposed: p.name },
        { label: 'Integrantes', current: current?.members, proposed: p.members },
        { label: 'Historia', current: current?.history, proposed: p.history },
        { label: 'Zona', current: current?.zone, proposed: p.zone },
        { label: 'Precio/hora', current: money(current?.price_hour), proposed: money(p.price_hour) },
        { label: 'Km extra', current: current?.extra_kilometre, proposed: p.extra_kilometre },
        { label: 'Radio de cobertura', current: current?.coverage_radius, proposed: p.coverage_radius },
        { label: 'Manager', current: currentManager?.name, proposed: p.name_manager },
        { label: 'Tel. manager', current: currentManager?.phone, proposed: p.phone_manager },
        { label: 'Correo manager', current: currentManager?.email, proposed: p.email_manager },
      ];

      return rows.map((row) => ({
        ...row,
        changed: String(row.current ?? '') !== String(row.proposed ?? ''),
      }));
    },
  },

  async created() {
    await this.loadPending();
  },

  methods: {
    ...mapActions('artistApprovals', ['fetchPendingRequests', 'acceptRequest', 'rejectRequest']),

    async loadPending() {
      this.loading = true;
      try {
        await this.fetchPendingRequests();
      } catch {
        this.$q.notify({ type: 'negative', message: 'Error al cargar solicitudes.', position: 'top' });
      } finally {
        this.loading = false;
      }
    },

    async onAccept(requestId) {
      this.loadingId = requestId + '_accept';
      try {
        await this.acceptRequest(requestId);
        this.$q.notify({ type: 'positive', message: 'Solicitud aceptada. El artista ya es visible en tienda.', position: 'top' });
      } catch (err) {
        const message = err.response?.data?.message || 'Error al aceptar la solicitud.';
        this.$q.notify({ type: 'negative', message, position: 'top' });
        if (err.response?.status === 404) {
          this.loadPending();
        }
      } finally {
        this.loadingId = null;
      }
    },

    openRejectDialog(requestId) {
      this.requestIdToReject = requestId;
      this.rejectionReason = '';
      this.rejectDialog = true;
    },

    openCompareDialog(row) {
      this.compareRequest = row;
      this.compareDialog = true;
    },

    async onReject() {
      const requestId = this.requestIdToReject;
      this.rejectDialog = false;
      this.loadingId = requestId + '_reject';
      try {
        await this.rejectRequest({ requestId, rejectionReason: this.rejectionReason });
        this.$q.notify({ type: 'warning', message: 'Solicitud rechazada.', position: 'top' });
      } catch (err) {
        const message = err.response?.data?.message || 'Error al rechazar la solicitud.';
        this.$q.notify({ type: 'negative', message, position: 'top' });
        if (err.response?.status === 404) {
          this.loadPending();
        }
      } finally {
        this.loadingId = null;
      }
    },

    formatDate(raw) {
      if (!raw) return '';
      const d = new Date(raw);
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
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
  position: relative;
}

.cell-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

.q-table thead th .q-table__sort-icon {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
