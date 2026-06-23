<template>
<q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
  <q-card style="width: 700px; max-width: 95vw">
    <q-card-section class="row items-center q-pb-sm">
      <div class="text-h6 text-weight-bold">Historial del Ticket #{{ ticketId }}</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="$emit('update:modelValue', false)" />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-md" style="max-height: 70vh; overflow-y: auto">
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner color="primary" size="2.5em" />
      </div>

      <div v-else-if="logs.length === 0" class="text-center q-py-xl text-grey-6">
        <q-icon name="history" size="3em" color="grey-4" />
        <p class="q-mt-sm">Sin historial de cambios.</p>
      </div>

      <div v-else>
        <div
          v-for="(log, i) in logs"
          :key="log.id"
          class="row no-wrap q-mb-md"
        >
          <div class="column items-center q-mr-md" style="min-width: 36px">
            <q-icon
              :name="statusIcon(log.status)"
              :color="statusColor(log.status)"
              size="28px"
            />
            <div
              v-if="i < logs.length - 1"
              style="width: 2px; flex: 1; min-height: 24px; margin-top: 4px"
              :class="`bg-${statusColor(log.status)}`"
            />
          </div>

          <q-card flat bordered class="col q-pa-sm" style="border-radius: 8px">
            <div class="row items-center justify-between q-mb-xs">
              <q-badge
                :color="statusColor(log.status)"
                class="q-px-sm q-py-xs text-subtitle2"
              >
                {{ statusLabel(log.status) }}
              </q-badge>
              <div class="column items-end">
                <span class="text-caption text-grey-6">{{ formatDate(log.created_at) }}</span>
                <span class="text-caption text-grey-5">{{ formatTime(log.created_at) }}</span>
              </div>
            </div>

            <div class="row items-center q-mb-xs">
              <q-icon name="person" size="xs" class="q-mr-xs text-grey-6" />
              <span class="text-body2 text-weight-medium">{{ log.changed_by?.name || 'N/A' }}</span>
              <span class="text-caption text-grey-5 q-ml-xs">{{ log.changed_by?.email || '' }}</span>
            </div>

            <div v-if="log.resolution_type" class="row items-center q-mb-xs">
              <q-icon name="gavel" size="xs" class="q-mr-xs text-grey-6" />
              <span class="text-caption">Resolución: <strong>{{ resolutionLabel(log.resolution_type) }}</strong></span>
            </div>

            <div v-if="log.notes" class="row items-start q-mb-xs">
              <q-icon name="notes" size="xs" class="q-mr-xs q-mt-xs text-grey-6" />
              <span class="text-caption text-grey-8">{{ log.notes }}</span>
            </div>

            <div v-if="log.notes === 'Ticket creado.' && ticketWithEvidences && ticketWithEvidences.evidences && ticketWithEvidences.evidences.length > 0">
              <q-separator class="q-my-xs" />
              <div class="text-caption text-grey-6 q-mb-xs">
                <q-icon name="attach_file" size="xs" class="q-mr-xs" />Evidencias
              </div>
              <div class="row q-gutter-xs">
                <div
                  v-for="ev in ticketWithEvidences.evidences"
                  :key="ev.id"
                >
                  <q-img
                    v-if="isImage(ev.file_path)"
                    :src="buildUrl(ev.file_path)"
                    style="width: 250px; height: 250px; border-radius: 6px; object-fit: cover"
                    @click="openEvidence(ev.file_path)"
                    class="cursor-pointer"
                  />
                  <q-btn
                    v-else
                    flat
                    dense
                    icon="videocam"
                    color="primary"
                    size="sm"
                    label="Video"
                    @click="openEvidence(ev.file_path)"
                  />
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <q-separator />
    <q-card-actions align="right" class="q-pa-sm">
      <q-btn flat label="Cerrar" color="primary" @click="$emit('update:modelValue', false)" />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { api } from 'boot/axios';

export default {
  name: 'TicketLogsModal',

  props: {
    modelValue: { type: Boolean, default: false },
    ticketId:   { type: [Number, String], default: null },
    ticket:     { type: Object, default: null },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      loading: false,
      ticketWithEvidences: null,
      logs: [],
    };
  },

  watch: {
    modelValue(val) {
      if (val && this.ticketId) {
        this.loadLogs();
      } else {
        this.logs = [];
        this.ticketWithEvidences = null;
      }
    },
  },

  methods: {
    ...mapActions('supportTickets', ['fetchTicketLogs', 'fetchAdminTicketDetail']),

    async loadLogs() {
      this.loading = true;
      try {
        const [logs, ticketDetail] = await Promise.all([
          this.fetchTicketLogs(this.ticketId),
          this.fetchAdminTicketDetail(this.ticketId),
        ]);
        this.logs = logs;
        this.ticketWithEvidences = ticketDetail;
      } catch {
        this.$q.notify({ type: 'negative', message: 'Error al cargar el historial.', position: 'top' });
      } finally {
        this.loading = false;
      }
    },

    buildUrl(filePath) {
      return `${api.defaults.baseURL}storage/${filePath}`;
    },

    isImage(path) {
      return /\.(jpg|jpeg|png)$/i.test(path);
    },

    openEvidence(path) {
      window.open(this.buildUrl(path), '_blank');
    },

    formatDate(raw) {
      if (!raw) return '';
      return new Date(raw).toLocaleDateString('es-MX', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    },

    formatTime(raw) {
      if (!raw) return '';
      return new Date(raw).toLocaleTimeString('es-MX', {
        hour: '2-digit', minute: '2-digit',
      });
    },

    statusLabel(status) {
      return { open: 'Abierto', under_review: 'En revisión', resolved: 'Resuelto', rejected: 'Rechazado' }[status] || status;
    },

    statusColor(status) {
      return { open: 'warning', under_review: 'info', resolved: 'positive', rejected: 'negative' }[status] || 'grey';
    },

    statusIcon(status) {
      return { open: 'fiber_new', under_review: 'manage_search', resolved: 'check_circle', rejected: 'cancel' }[status] || 'circle';
    },

    resolutionLabel(type) {
      return { full_refund: 'Reembolso total', partial_refund: 'Reembolso parcial', no_action: 'Sin acción' }[type] || type;
    },
  },
};
</script>
