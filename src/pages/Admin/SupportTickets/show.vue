<template>
  <div class="q-pa-md" style="max-width: 800px; margin: 0 auto">
    <q-btn
      flat
      rounded
      icon="arrow_back"
      label="Volver"
      color="primary"
      class="q-mb-md"
      @click="goBack"
    />
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner color="primary" size="3em" />
    </div>
    <template v-if="!loading && ticket">
      <div class="row items-center q-mb-md">
        <div class="text-h5 text-weight-bold">Ticket #{{ ticket.id }}</div>
        <q-space />
        <q-badge v-bind="getSupportTicketStatusColor(ticket.status, $q.dark.isActive)" class="q-px-md q-py-sm text-subtitle2 text-weight-medium text-uppercase">
          {{ statusLabel(ticket.status) }}
        </q-badge>
      </div>
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Información de la Orden</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey">Artista</div>
              <div class="text-weight-medium">{{ ticket.artist_sale?.artist?.name || 'N/A' }}</div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey">Cliente</div>
              <div class="text-weight-medium">
                {{ ticket.artist_sale?.customer?.name || ticket.artist_sale?.customer_first_name || 'N/A' }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey">Fecha del Evento</div>
              <div class="text-weight-medium">{{ formatDate(ticket.artist_sale?.event_date) }}</div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey">Monto de la orden</div>
              <div class="text-weight-bold text-positive">
                ${{ Number(ticket.artist_sale?.amount || 0).toLocaleString('es-MX') }} MXN
              </div>
            </div>
            <div class="col-12">
              <div class="text-caption text-grey">ID Transacción OpenPay</div>
              <div class="text-caption text-primary" style="word-break: break-all">
                {{ ticket.artist_sale?.openpay_transaction_id || 'N/A' }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Detalle del Reporte</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey">Reportado por</div>
              <div class="text-weight-medium">{{ ticket.reporter?.name || 'N/A' }}</div>
              <div class="text-caption text-grey">{{ ticket.reporter?.email || '' }}</div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey">Categoría</div>
              <q-badge v-bind="getSupportTicketCategoryColor(ticket.category, $q.dark.isActive)" class="q-px-sm q-py-xs q-mt-xs text-weight-medium text-uppercase">
                {{ categoryLabel(ticket.category) }}
              </q-badge>
            </div>
            <div class="col-12">
              <div class="text-caption text-grey">Descripción</div>
              <div class="q-mt-xs">{{ ticket.description }}</div>
            </div>
            <div class="col-12">
              <div class="text-caption text-grey">Fecha del reporte</div>
              <div>{{ formatDate(ticket.created_at) }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="q-mb-md" v-if="ticket.media && ticket.media.length > 0">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            Evidencias ({{ ticket.media.length }})
          </div>
          <div class="row q-col-gutter-sm">
            <div
              v-for="file in ticket.media"
              :key="file.id"
              class="col-6 col-sm-4"
            >
              <q-img
                v-if="isImage(file.file_name)"
                :src="buildUrl(file)"
                style="border-radius: 8px; height: 140px"
                fit="cover"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-6 text-caption">
                    Sin vista previa
                  </div>
                </template>
              </q-img>
              <video
                v-if="isVideo(file.file_name)"
                :src="buildUrl(file)"
                controls
                style="width: 100%; height: 140px; border-radius: 8px; background: #000; object-fit: cover;"
              >
              </video>
              <q-btn
                v-if="!isImage(file.file_name) && !isVideo(file.file_name)"
                flat
                bordered
                rounded
                icon="download"
                label="Descargar"
                color="primary"
                class="full-width"
                style="height: 140px;"
                :href="buildUrl(file)"
                target="_blank"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="q-mb-md" v-if="!ticket.media || ticket.media.length === 0">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-xs">Evidencias</div>
          <div class="text-grey text-caption">No se adjuntaron evidencias.</div>
        </q-card-section>
      </q-card>
      <q-card
        flat
        bordered
        v-if="ticket.status !== 'resolved' && ticket.status !== 'rejected'"
      >
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-md">Resolver Ticket</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-btn
                unelevated
                rounded
                color="positive"
                icon="task_alt"
                label="Resuelto"
                class="full-width"
                :loading="resolving"
                @click="resolve('resolved', 'no_action')"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-btn
                unelevated
                rounded
                color="negative"
                icon="cancel"
                label="Rechazar"
                class="full-width"
                :loading="resolving"
                @click="resolve('rejected', 'no_action')"
              />
            </div>
            <div class="col-12">
              <q-btn
                outline
                rounded
                color="info"
                icon="manage_search"
                label="Marcar en Revisión"
                class="full-width q-mt-xs"
                :loading="resolving"
                @click="resolve('under_review', null)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered v-if="ticket.status === 'resolved' || ticket.status === 'rejected'">
        <q-card-section class="text-center">
          <q-icon
            name="task_alt"
            :color="ticket.status === 'resolved' ? 'positive' : 'negative'"
            size="3em"
          />
          <div class="text-subtitle1 text-weight-bold q-mt-sm">
            {{ ticket.status === 'resolved' ? 'Ticket resuelto' : 'Ticket rechazado' }}
          </div>
        </q-card-section>
      </q-card>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { api } from 'boot/axios';
import { notifySuccess, notifyError } from 'src/utils/notify';
import { getSupportTicketCategoryColor, getSupportTicketStatusColor } from 'src/utils/badgeStyles';

export default {
  name: 'SupportTicketShow',

  data() {
    return {
      loading: false,
      resolving: false,
    };
  },

  computed: {
    ...mapGetters('supportTickets', { ticket: 'getCurrentTicket' }),
  },

  async created() {
    await this.fetchTicket();
  },

  methods: {
    ...mapActions('supportTickets', ['fetchAdminTicketDetail', 'updateTicketStatus']),
    getSupportTicketCategoryColor,
    getSupportTicketStatusColor,

    goBack() {
      const targetRoute = this.$route.query.from === 'sanctions'
        ? 'admin.user-sanctions'
        : 'admin.support-tickets';
      this.$router.push({ name: targetRoute });
    },

    async fetchTicket() {
      this.loading = true;
      try {
        await this.fetchAdminTicketDetail(this.$route.params.id);
      } catch {
        notifyError('Error al cargar el ticket.');
      } finally {
        this.loading = false;
      }
    },

    async resolve(status, resolutionType) {
      this.resolving = true;
      try {
        await this.updateTicketStatus({
          ticketId: this.ticket.id,
          status,
          resolution_type: resolutionType,
        });
        notifySuccess('Ticket actualizado correctamente.');
      } catch {
        notifyError('Error al actualizar el ticket.');
      } finally {
        this.resolving = false;
      }
    },

    buildUrl(file) {
      const baseUrl = api.defaults.baseURL || 'http://localhost:8000';
      const cleanBaseUrl = baseUrl.replace(/\/api$/, '');
      return `${cleanBaseUrl}/storage/${file.id}/${file.file_name}`;
    },

    isImage(fileName) {
      if (!fileName) return false;
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);
    },

    isVideo(fileName) {
      if (!fileName) return false;
      return /\.(mp4|mov|webm)$/i.test(fileName);
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
  },
};
</script>
