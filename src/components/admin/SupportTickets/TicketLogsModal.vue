<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 700px; max-width: 95vw">
      <q-card-section class="row items-center q-pb-sm">
        <div class="text-h6 text-weight-bold">Historial del Ticket #{{ ticketId }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('update:modelValue', false)" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-md" style="max-height: 55vh; overflow-y: auto">
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
                v-if="isComment(log)"
                name="chat_bubble"
                color="blue-grey-4"
                size="28px"
              />
              <q-icon
                v-else
                :name="statusIcon(log.status)"
                :color="statusColor(log.status)"
                size="28px"
              />
              <div
                v-if="i < logs.length - 1"
                style="width: 2px; flex: 1; min-height: 24px; margin-top: 4px"
                :class="isComment(log) ? 'bg-blue-grey-2' : `bg-${statusColor(log.status)}`"
              />
            </div>

            <q-card flat bordered class="col q-pa-sm" style="border-radius: 8px">
              <div class="row items-center justify-between q-mb-xs">
                <q-badge
                  v-if="isComment(log)"
                  color="blue-grey-3"
                  text-color="dark"
                  class="q-px-sm q-py-xs text-subtitle2"
                >
                  Comentario
                </q-badge>
                <q-badge
                  v-else
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

              <div v-if="log.message" class="row items-start q-mb-xs">
                <q-icon name="chat" size="xs" class="q-mr-xs q-mt-xs text-primary" />
                <span class="text-body2">{{ log.message }}</span>
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
      <q-card-section v-if="!isTicketClosed" class="q-pa-sm">
        <div class="row items-end q-gutter-sm">
          <q-input
            v-model="newMessage"
            outlined
            dense
            class="col"
            placeholder="Escribe un comentario..."
            autogrow
            :disable="sending"
            @keyup.enter.exact.prevent="sendComment"
          />
          <q-btn
            round
            unelevated
            color="primary"
            icon="send"
            :loading="sending"
            :disable="!newMessage.trim()"
            @click="sendComment"
          >
            <q-tooltip>Enviar comentario</q-tooltip>
          </q-btn>
        </div>
        <div class="text-caption text-grey-5 q-mt-xs q-ml-xs">
          Presiona Enter para enviar
        </div>
      </q-card-section>
      <q-card-actions
        v-else
        class="q-pa-md justify-center items-center text-center animate__animated animate__fadeIn"
        :class="bannerColorClass"
        style="border-top: 1px solid rgba(0, 0, 0, 0.1); min-height: 80px; flex-direction: column;"
      >
        <div class="row items-center justify-center q-gutter-xs q-mb-xs">
          <q-icon
            :name="ticketStatus === 'resolved' ? 'check_circle' : 'cancel'"
            size="sm"
            :color="ticketStatus === 'resolved' ? 'positive' : 'negative'"
          />
          <span class="text-weight-bold text-subtitle1">{{ closedMessageTitle }}</span>
        </div>
        <div class="text-body2 text-weight-medium">
          {{ closedMessageText }}
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { api } from 'boot/axios';
const POLLING_INTERVAL = 5000;

export default {
  name: 'TicketLogsModal',

  props: {
    modelValue: { type: Boolean, default: false },
    ticketId:   { type: [Number, String], default: null },
    ticket:     { type: Object, default: null },
    isAdmin:    { type: Boolean, default: false },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      loading: false,
      sending: false,
      ticketWithEvidences: null,
      logs: [],
      newMessage: '',
      pollingTimer: null,
    };
  },

  computed: {
    ticketStatus() {
      if (this.ticketWithEvidences && this.ticketWithEvidences.status) {
        return this.ticketWithEvidences.status;
      }
      if (this.logs && this.logs.length > 0) {
        const lastLog = this.logs[this.logs.length - 1];
        if (lastLog && lastLog.status) {
          return lastLog.status;
        }
      }
      if (this.ticket && this.ticket.status) {
        return this.ticket.status;
      }
      return null;
    },

    isTicketClosed() {
      const s = this.ticketStatus;
      return s === 'resolved' || s === 'rejected';
    },

    bannerColorClass() {
      const isDark = this.$q.dark.isActive;
      if (this.ticketStatus === 'resolved') {
        return isDark ? 'bg-green-9 text-white' : 'bg-green-1 text-green-9';
      }
      if (this.ticketStatus === 'rejected') {
        return isDark ? 'bg-red-9 text-white' : 'bg-red-1 text-red-9';
      }
      return isDark ? 'bg-grey-9 text-grey-4' : 'bg-grey-5 text-grey-1';
    },

    closedMessageTitle() {
      if (this.ticketStatus === 'resolved') return 'Ticket Resuelto';
      if (this.ticketStatus === 'rejected') return 'Ticket Rechazado';
      return 'Ticket Cerrado';
    },

    closedMessageText() {
      return 'Este ticket ya tiene una resolución y los comentarios han sido deshabilitados.';
    },
  },

  watch: {
    modelValue(val) {
      if (val && this.ticketId) {
        this.loadLogs();
        this.startPolling();
      } else {
        this.stopPolling();
        this.logs = [];
        this.ticketWithEvidences = null;
        this.newMessage = '';
      }
    },
  },

  beforeUnmount() {
    this.stopPolling();
  },

  methods: {
    ...mapActions('supportTickets', [
      'fetchTicketLogs',
      'fetchAdminTicketDetail',
      'fetchMyTicketLogs',
      'addTicketComment',
    ]),

    async loadLogs() {
      this.loading = true;
      try {
        const logs = this.isAdmin
          ? await this.fetchTicketLogs(this.ticketId)
          : await this.fetchMyTicketLogs(this.ticketId);

        this.logs = (logs || []).slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        this.ticketWithEvidences = this.isAdmin
          ? await this.fetchAdminTicketDetail(this.ticketId)
          : this.ticket;
      } catch {
        this.$q.notify({ type: 'negative', message: 'Error al cargar el historial.', position: 'top' });
      } finally {
        this.loading = false;
      }
    },

    async pollLogs() {
      try {
        const logs = this.isAdmin
          ? await this.fetchTicketLogs(this.ticketId)
          : await this.fetchMyTicketLogs(this.ticketId);
        if (logs.length !== this.logs.length) {
          this.logs = (logs || []).slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
      } catch {
      }
    },

    startPolling() {
      this.stopPolling();
      this.pollingTimer = setInterval(() => {
        this.pollLogs();
      }, POLLING_INTERVAL);
    },

    stopPolling() {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
    },

    async sendComment() {
      const message = this.newMessage.trim();
      if (!message || this.isTicketClosed) return;
      this.sending = true;
      try {
        const newLog = await this.addTicketComment({
          ticketId: this.ticketId,
          message,
          isAdmin: this.isAdmin,
        });
        this.logs.push(newLog);
        this.newMessage = '';
        this.$q.notify({ type: 'positive', message: 'Comentario enviado.', position: 'top' });
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al enviar el comentario.';
        this.$q.notify({ type: 'negative', message: msg, position: 'top' });
      } finally {
        this.sending = false;
      }
    },

    isComment(log) {
      return !!log.message && !log.notes;
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
