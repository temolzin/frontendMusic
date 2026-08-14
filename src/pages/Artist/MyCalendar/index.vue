<template>
  <div class="calendar-container" :class="{ 'calendar-dark': mode }">

    <q-card class="shadow-1">
      <q-card-section class="page-header q-pb-none">
        <b class="text-h5 q-my-none">Mi Calendario</b>
        <p class="text-subtitle2 text-grey">Ver tus contratos programados</p>
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <div v-if="loading" class="text-center q-py-lg">
          <q-spinner size="50px" color="primary" />
          <p class="text-grey q-mt-md">Cargando contratos...</p>
        </div>

        <div v-else>
          <q-splitter v-model="splitter" style="height: 700px; border: none;" class="calendar-splitter" :horizontal="$q.screen.lt.md">
            <template v-slot:before>
              <div class="left-panel q-pa-md">
                <h6 class="q-mt-none q-mb-md">Calendario</h6>

                <q-date
                  v-model="selectedDate"
                  flat
                  bordered
                  color="primary"
                  :events="eventDates"
                  :event-color="eventColor"
                />

                <div class="summary-section q-mt-lg">
                  <h6 class="q-mb-md text-subtitle2">Resumen</h6>
                  <div class="summary-card q-pa-md bg-grey-2 rounded-borders">
                    <div class="summary-row q-mb-md">
                      <span class="label">Total</span>
                      <span class="value text-blue">{{ contracts.length }}</span>
                    </div>
                    <div class="summary-row q-mb-md">
                      <span class="label">Completadas</span>
                      <span class="value text-green">{{ completedCount }}</span>
                    </div>
                    <div class="summary-row">
                      <span class="label">Pendientes</span>
                      <span class="value text-warning">{{ pendingCount }}</span>
                    </div>
                    <div class="summary-row q-mt-md">
                      <span class="label">Rechazados</span>
                      <span class="value text-red">{{ rejectedCount }}</span>
                    </div>
                    <div class="summary-row q-mt-md">
                      <span class="label">Expirados</span>
                      <span class="value" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">{{ expiredCount }}</span>
                    </div>
                    <div class="summary-row q-mt-md">
                      <span class="label">Cancelados</span>
                      <span class="value" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">{{ cancelledCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-slot:after>
              <div class="right-panel">
                <q-tabs
                  v-model="activeTab"
                  dense
                  class="text-primary"
                  active-color="primary"
                  indicator-color="primary"
                >
                  <q-tab name="today" label="Hoy" />
                  <q-tab name="all" label="Todas" />
                </q-tabs>

                <q-tab-panels v-model="activeTab" animated class="tab-content">
                  <q-tab-panel name="today">
                    <div v-if="todayEvents.length > 0" class="events-list">
                      <div v-for="event in todayEvents" :key="event.id" class="q-mb-md">
                        <q-card
                          flat
                          bordered
                          class="event-card"
                          :class="{ completed: event.status === 'completed', expired: event.status === 'expired' || event.status === 'rejected' }"
                          @click="toggleExpanded(event.id)"
                        >
                          <q-card-section class="q-pa-md">
                            <div class="event-header">
                              <div>
                                <div class="text-h6 q-mb-xs">{{ event.title }}</div>
                                <div class="text-caption text-grey">
                                  <q-icon name="access_time" size="xs" /> {{ event.time }}
                                </div>
                                <div class="text-caption text-grey q-mt-xs">
                                  <q-icon name="location_on" size="xs" /> {{ event.location }}
                                </div>
                              </div>
                              <div class="event-right">
                                <q-badge
                                  v-bind="getEventStatusColor(event.status, $q.dark.isActive)"
                                  class="q-px-sm q-py-xs text-weight-medium text-uppercase"
                                >
                                  {{ statusLabel(event.status) }}
                                </q-badge>
                                <q-icon
                                  :name="expanded[event.id] ? 'expand_less' : 'expand_more'"
                                  color="primary"
                                  class="q-ml-md"
                                />
                              </div>
                            </div>

                            <q-slide-transition>
                              <div v-show="expanded[event.id]" class="q-mt-md">
                                <q-separator class="q-mb-md" />
                                <div class="detail-section-title q-mb-sm text-weight-bold text-primary">Evento</div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Descripción:</span>
                                  <span class="detail-value">{{ event.description }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Inicio:</span>
                                  <span class="detail-value">{{ formatEventTime(event.time) }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Duración:</span>
                                  <span class="detail-value">{{ event.eventHours ? event.eventHours + ' hrs' : 'N/A' }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Tarifa:</span>
                                  <span class="detail-value text-positive text-weight-bold">${{ event.rate }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Contacto:</span>
                                  <span class="detail-value">{{ event.contact }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Dirección:</span>
                                  <span class="detail-value">{{ event.customerAddress }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Ciudad:</span>
                                  <span class="detail-value">{{ event.customerCity }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Estado:</span>
                                  <span class="detail-value">{{ event.customerState }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Código Postal:</span>
                                  <span class="detail-value">{{ event.customerZipCode }}</span>
                                </div>
                                <div class="q-mt-sm">
                                  <q-btn dense outline color="secondary" icon="map" label="Cómo llegar" size="sm" @click.stop="openGoogleMaps(event)" />
                                </div>
                                <q-separator class="q-my-md" />
                                <div class="detail-section-title q-mb-sm text-weight-bold text-primary">Cliente</div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Nombre:</span>
                                  <span class="detail-value">{{ event.customerFirstName }} {{ event.customerLastName }}</span>
                                </div>
                                <q-separator class="q-my-md" />
                                <div v-if="event.status === 'pending'" class="action-section">
                                  <q-btn
                                    v-if="event.canComplete"
                                    color="positive"
                                    label="Marcar como completado"
                                    outline
                                    size="sm"
                                    icon="check_circle"
                                    @click.stop="markAsCompleted(event)"
                                    class="full-width"
                                  />
                                  <q-btn
                                    v-if="canCancelEvent(event)"
                                    color="negative"
                                    style="border-radius: 8px; font-weight: bold;"
                                    label="Cancelar evento"
                                    outline
                                    size="sm"
                                    icon="event_busy"
                                    @click.stop="openCancelDialog(event)"
                                    class="full-width"
                                  />
                                </div>
                              </div>
                            </q-slide-transition>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>
                    <div v-else class="text-center q-py-lg text-grey">
                      <q-icon name="calendar_today" size="lg" />
                      <p>Sin contratos para hoy</p>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="all">
                    <div v-if="contracts.length > 0" class="events-list">
                      <div v-for="event in contracts" :key="event.id" class="q-mb-md">
                        <q-card
                          flat
                          bordered
                          class="event-card"
                          :class="{ completed: event.status === 'completed', expired: event.status === 'expired' || event.status === 'rejected' }"
                          role="button"
                          :tabindex="0"
                          :aria-expanded="expanded[event.id] ? 'true' : 'false'"
                          @click="toggleExpanded(event.id)"
                          @keydown.enter.prevent="toggleExpanded(event.id)"
                          @keydown.space.prevent="toggleExpanded(event.id)"
                        >
                          <q-card-section class="q-pa-md">
                            <div class="event-header">
                              <div>
                                <div class="text-h6 q-mb-xs">{{ event.title }}</div>
                                <div class="text-caption text-grey">
                                  <q-icon name="event" size="xs" /> {{ formatDateDisplay(event.date) }}
                                </div>
                                <div class="text-caption text-grey q-mt-xs">
                                  <q-icon name="location_on" size="xs" /> {{ event.location }}
                                </div>
                              </div>
                              <div class="event-right">
                                <q-badge
                                  v-bind="getEventStatusColor(event.status, $q.dark.isActive)"
                                  class="q-px-sm q-py-xs text-weight-medium text-uppercase"
                                >
                                  {{ statusLabel(event.status) }}
                                </q-badge>
                                <q-icon
                                  :name="expanded[event.id] ? 'expand_less' : 'expand_more'"
                                  color="primary"
                                  class="q-ml-md"
                                />
                              </div>
                            </div>

                            <q-slide-transition>
                              <div v-show="expanded[event.id]" class="q-mt-md">
                                <q-separator class="q-mb-md" />
                                <div class="detail-section-title q-mb-sm text-weight-bold text-primary">Evento</div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Descripción:</span>
                                  <span class="detail-value">{{ event.description }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Inicio:</span>
                                  <span class="detail-value">{{ formatEventTime(event.time) }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Duración:</span>
                                  <span class="detail-value">{{ event.eventHours ? event.eventHours + ' hrs' : 'N/A' }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Tarifa:</span>
                                  <span class="detail-value text-positive text-weight-bold">${{ event.rate }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Contacto:</span>
                                  <span class="detail-value">{{ event.contact }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Dirección:</span>
                                  <span class="detail-value">{{ event.customerAddress }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Ciudad:</span>
                                  <span class="detail-value">{{ event.customerCity }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Estado:</span>
                                  <span class="detail-value">{{ event.customerState }}</span>
                                </div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Código Postal:</span>
                                  <span class="detail-value">{{ event.customerZipCode }}</span>
                                </div>
                                <div class="q-mt-sm">
                                  <q-btn dense outline color="secondary" icon="map" label="Cómo llegar" size="sm" @click.stop="openGoogleMaps(event)" />
                                </div>
                                <q-separator class="q-my-md" />
                                <div class="detail-section-title q-mb-sm text-weight-bold text-primary">Cliente</div>
                                <div class="detail-item q-mb-sm">
                                  <span class="detail-label">Nombre:</span>
                                  <span class="detail-value">{{ event.customerFirstName }} {{ event.customerLastName }}</span>
                                </div>
                                <q-separator class="q-my-md" />
                                <div v-if="event.status === 'pending'" class="action-section">
                                  <q-btn
                                    v-if="event.canComplete"
                                    color="positive"
                                    label="Marcar como completado"
                                    outline
                                    size="sm"
                                    icon="check_circle"
                                    @click.stop="markAsCompleted(event)"
                                    class="full-width"
                                  />
                                  <q-btn
                                    v-if="canCancelEvent(event)"
                                    color="negative"
                                    label="Cancelar evento"
                                    outline
                                    size="sm"
                                    icon="event_busy"
                                    @click.stop="openCancelDialog(event)"
                                    class="full-width"
                                  />
                                </div>
                              </div>
                            </q-slide-transition>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>
                    <div v-else class="text-center q-py-lg text-grey">
                      <q-icon name="event" size="lg" />
                      <p>Sin contratos registrados</p>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </template>
          </q-splitter>
        </div>
      </q-card-section>
    </q-card>

    <CancellationModal
      v-model="cancelDialogOpen"
      :sale="cancelTargetEvent"
      type="artist"
      :cancel-endpoint="`/api/artist/sales/${cancelTargetEvent?.id}/cancel`"
      @cancelled="onCancelled"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import langEs from 'quasar/lang/es';
import { api } from 'boot/axios';
import { mapActions } from 'vuex';
import { getEventStatusColor } from 'src/utils/badgeStyles';
import CancellationModal from 'components/CancellationModal.vue';
import { notifySuccess, notifyError, platformEvents } from 'src/utils/notify';

export default defineComponent({
  name: 'MyCalendar',
  components: { CancellationModal },

  setup() {
    const $q = useQuasar();
    $q.lang.set(langEs);
  },

  data() {
    return {
      splitter: 40,
      activeTab: 'today',
      selectedDate: this.getTodayString(),
      expanded: {},
      contracts: [],
      loading: true,
      cancelDialogOpen: false,
      cancelTargetEvent: null,
    };
  },
  computed: {
    todayEvents() {
      return this.contracts.filter((c) => c.date === this.getTodayString());
    },
    completedCount() {
      return this.contracts.filter((c) => c.status === 'completed').length;
    },
    pendingCount() {
      return this.contracts.filter((c) => c.status === 'pending').length;
    },
    expiredCount() {
      return this.contracts.filter((c) => c.status === 'expired').length;
    },
    rejectedCount() {
      return this.contracts.filter((c) => c.status === 'rejected').length;
    },
    cancelledCount() {
      return this.contracts.filter((c) => c.status === 'cancelled').length;
    },
    eventDates() {
      const eventsByDate = {};
      this.contracts.forEach((c) => {
        if (!eventsByDate[c.date]) {
          eventsByDate[c.date] = [];
        }
        eventsByDate[c.date].push(c);
      });
      return Object.keys(eventsByDate);
    },
    eventColor(date) {
      const events = this.contracts.filter(c => c.date === date);
      if (events.some(e => e.status === 'cancelled')) return 'grey-5';
      if (events.some(e => e.status === 'rejected' || e.status === 'expired')) return 'negative';
      if (events.some(e => e.status === 'completed')) return 'positive';
      return 'warning';
    },
    mode() {
      return this.$q.dark.isActive;
    },

  },
  methods: {
    getEventStatusColor,
    ...mapActions("userSanctions", [
      "evaluateCancellationSanction"
    ]),

    getTodayString() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return `${y}/${m}/${d}`;
    },

    async loadContracts() {
      try {
        const response = await api.get('/api/artist/sales/details');
        const allSales = (response.data?.sales && Array.isArray(response.data.sales))
          ? response.data.sales
          : [];
        if (allSales.length === 0 && !response.data?.sales) {
          notifyError('No se pudieron cargar los eventos. Intenta de nuevo más tarde.');
        }
        this.contracts = allSales
          .map((sale) => ({
              id: sale.id,
              title: `Evento ${sale.customer_first_name || 'Desconocido'}`,
              description: `Contrato para ${sale.customer_first_name || 'Desconocido'} ${sale.customer_last_name || 'Desconocido'}`,
              date: this.parseDateToString(sale.event_date),
              time: sale.event_hour,
              eventHours: sale.event_hours,
              location: sale.customer_address,
              rate: sale.amount,
              contact: sale.customer_phone,
              status: sale.event_status || 'pending',
              canComplete: sale.can_complete || false,
              customerFirstName: sale.customer_first_name || '',
              customerLastName: sale.customer_last_name || '',
              customerEmail: sale.customer_email || '',
              customerPhone: sale.customer_phone || '',
              customerAddress: sale.customer_address || '',
              customerCity: sale.customer_city || '',
              customerState: sale.customer_state || '',
              customerZipCode: sale.customer_zip_code || '',
            }));
      } catch (error) {
        console.error('Error loading artist-sales:', error);
        notifyError('Error cargando eventos. Intenta de nuevo más tarde.');
        this.contracts = [];
      } finally {
        this.loading = false;
      }
    },

    parseDateToString(dateVal) {
      if (!dateVal) return this.getTodayString();
      try {
        let dateStr = dateVal.toString();
        if (dateStr.includes('-')) {
          const datePart = dateStr.split('T')[0].split(' ')[0];
          const [y, mRaw, dRaw] = datePart.split('-');
          const m = String(mRaw).padStart(2, '0');
          const d = String(dRaw).padStart(2, '0');
          return `${y}/${m}/${d}`;
        }
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return this.getTodayString();
        const y = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}/${month}/${day}`;
      } catch {
        return this.getTodayString();
      }
    },

    toggleExpanded(id) {
      this.expanded = { ...this.expanded, [id]: !this.expanded[id] };
    },

    isEventDateAndTimePassed(dateStr, timeStr, eventHours) {
      if (!dateStr || !timeStr) return false;
      const [year, month, day] = dateStr.split('/');
      const [hour, minute] = timeStr.split(':');
      const eventEnd = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
      eventEnd.setHours(eventEnd.getHours() + (eventHours || 0));
      return new Date() > eventEnd;
    },

    async markAsCompleted(event) {
      try {
        const response = await api.put(`/api/artist/sales/${event.id}/complete`);
        const ok = response.data?.success;
        if (ok) {
          event.status = 'completed';
          this.expanded = { ...this.expanded, [event.id]: false };
        }
        ok
          ? notifySuccess('Evento marcado como completado')
          : notifyError(response.data?.message || 'Error al marcar como completado');
      } catch (error) {
        notifyError(error.response?.data?.message || 'Error al marcar como completado');
      }
    },

    canCancelEvent(event) {
      if (!event?.date) return false;
      if (event.status !== 'pending') return false;
      return event.date > this.getTodayString();
    },

    openCancelDialog(event) {
      this.cancelTargetEvent = event;
      this.cancelDialogOpen = true;
    },

    async onCancelled({ saleId }) {
      if (saleId) {
        await this.evaluateCancellationSanction(saleId);
      }
      platformEvents.eventCancelledByArtist();
      this.expanded = { ...this.expanded, [saleId]: false };
      await this.loadContracts();
    },

    openGoogleMaps(event) {
      const address = [
        event.customerAddress,
        event.customerCity,
        event.customerState,
        event.customerZipCode,
        'México'
      ].filter(Boolean).join(', ');
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    },

    statusLabel(status) {
      if (status === 'completed') return 'Completado';
      if (status === 'rejected') return 'Rechazado';
      if (status === 'expired') return 'Expirado';
      if (status === 'cancelled') return 'Cancelado';
      return 'Pendiente';
    },

    formatEventTime(timeStr) {
      if (!timeStr) return 'N/A';
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;
      const h = parseInt(parts[0], 10);
      const m = parts[1];
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
    },

    formatTime(dateStr) {
      if (!dateStr) return '--:--';
      try {
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? dateStr : d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '--:--';
      }
    },

    formatDateDisplay(dateStr) {
      try {
        const [year, month, day] = dateStr.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' });
      } catch {
        return dateStr;
      }
    },

    getEventsCountByDate(dateStr) {
      return this.contracts.filter((c) => c.date === dateStr).length;
    },

    hasMultipleEventsOnDate(dateStr) {
      return this.getEventsCountByDate(dateStr) > 1;
    },
  },
  mounted() {
    this.loadContracts();
  },
});
</script>

<style scoped lang="scss">
.calendar-container {
  padding: 20px;

  .page-header {
    margin-bottom: 24px;

    h4 {
      font-weight: 600;
      margin-bottom: 4px;
    }

    p {
      margin: 0;
      font-size: 13px;
    }
  }

  .calendar-splitter {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: white;
    overflow: hidden;

    :deep(.q-splitter__before),
    :deep(.q-splitter__after) {
      overflow: hidden;
    }
  }

  .left-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    background: #fafafa;

    h6 {
      margin: 0 0 16px 0;
      font-weight: 600;
      font-size: 14px;
    }

    :deep(.q-date) {
      width: 100%;

      .q-date__navigation {
        padding: 12px 8px;

        button {
          min-width: 32px;
          height: 32px;
        }
      }

      .q-date__content {
        padding: 8px;
      }
    }

    .summary-section {
      flex-grow: 1;

      .summary-card {
        border-radius: 8px;
        border: 1px solid #e0e0e0;

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;

          &:not(:last-child) {
            margin-bottom: 12px;
          }

          .label {
            font-size: 13px;
            font-weight: 500;
            color: #666;
          }

          .value {
            font-size: 20px;
            font-weight: 700;

            &.text-blue {
              color: #2196f3;
            }

            &.text-green {
              color: #4caf50;
            }

            &.text-warning {
              color: #ff9800;
            }
          }
        }
      }
    }
  }

  .right-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;

    :deep(.q-tabs) {
      flex-shrink: 0;
      border-bottom: 2px solid #f0f0f0;
      padding: 0 16px;

      .q-tab {
        min-height: 44px;
        font-weight: 500;
        font-size: 13px;
      }
    }

    .tab-content {
      flex: 1;
      overflow: hidden;

      :deep(.q-tab-panel) {
        height: 100%;
        overflow-y: auto;
        padding: 16px 20px;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #f5f5f5;
        }

        &::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;

          &:hover {
            background: #999;
          }
        }
      }
    }

    .events-list {
      .event-card {
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid #e0e0e0;
        border-left: 4px solid #ff9800;
        background: white;

        &:hover {
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        &.completed {
          border-left-color: #4caf50;
          background: #f9fff7;

          :deep(.q-card__section) {
            opacity: 0.95;
          }
        }

        &.expired {
          border-left-color: #f44336;
          background: #fff5f5;

          :deep(.q-card__section) {
            opacity: 0.85;
          }
        }

        :deep(.q-card__section) {
          padding: 12px 16px !important;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;

          > div:first-child {
            flex: 1;
            min-width: 0;

            .text-h6 {
              font-size: 15px;
              font-weight: 600;
              margin: 0 0 6px 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .text-caption {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              line-height: 1.4;
              color: #999;

              :deep(.q-icon) {
                flex-shrink: 0;
              }
            }
          }

          .event-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;

            :deep(.q-badge) {
              font-size: 11px;
              padding: 4px 8px;
              font-weight: 600;
              white-space: nowrap;
            }

            :deep(.q-icon) {
              cursor: pointer;
              font-size: 20px;
            }
          }
        }

        .detail-section-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #1976d2;
          margin: 8px 0 8px 0;
          padding-bottom: 4px;
          border-bottom: 2px solid #e0e0e0;
        }

        .detail-item {
          display: flex;
          gap: 8px;
          font-size: 13px;
          margin: 8px 0;

          &:last-child {
            margin-bottom: 0;
          }

          .detail-label {
            font-weight: 600;
            color: #555;
            min-width: 70px;
            flex-shrink: 0;
          }

          .detail-value {
            flex: 1;
            color: #333;
            word-break: break-word;

            &.text-positive {
              color: #4caf50;
            }
          }
        }

        .action-section {
          display: flex;
          flex-direction: column;
          gap: 8px;

          :deep(.q-btn) {
            font-weight: 600;
            padding: 8px 16px;
          }
        }
      }
    }
  }
}

.calendar-container.calendar-dark {
  min-height: calc(100vh - 50px);
  background: #0f172a;
  color: #e2e8f0;

  .page-header {
    h4 {
      color: #f8fafc;
    }

    p {
      color: #94a3b8 !important;
    }
  }

  .calendar-splitter {
    border-color: #334155;
    background: #111827;

    :deep(.q-splitter__separator) {
      background: #334155;
    }
  }

  .left-panel,
  .right-panel,
  .tab-content,
  :deep(.q-tab-panels),
  :deep(.q-tab-panel) {
    background: #111827;
    color: #e2e8f0;
  }

  .left-panel {
    h6 {
      color: #f8fafc;
    }

    :deep(.q-date) {
      background: #1e293b;
      color: #e2e8f0;
      border-color: #334155;

      .q-date__header {
        background: #0f172a;
        color: #f8fafc;
      }

      .q-date__navigation,
      .q-date__calendar-weekdays {
        color: #cbd5e1;
      }

      .q-date__calendar-item {
        color: #e2e8f0;
      }

      .q-date__calendar-days-container {
        background: #1e293b;
      }
    }

    .summary-section {
      .summary-card {
        background: #1e293b !important;
        border-color: #334155;

        .summary-row {
          .label {
            color: #cbd5e1;
          }
        }
      }
    }
  }

  .right-panel {
    :deep(.q-tabs) {
      border-bottom-color: #334155;
      background: #0f172a;
      color: #f8fafc;

      .q-tab {
        color: #f8fafc;
      }

      .q-tab--active {
        color: #60a5fa;
      }
    }

    .tab-content {
      :deep(.q-tab-panel) {
        &::-webkit-scrollbar-track {
          background: #0f172a;
        }

        &::-webkit-scrollbar-thumb {
          background: #475569;

          &:hover {
            background: #64748b;
          }
        }
      }
    }

    .events-list {
      .event-card {
        background: #1e293b;
        border-color: #334155;
        border-left-color: #f59e0b;
        color: #e2e8f0;

        &:hover {
          box-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
        }

        &.completed {
          background: #16281f;
          border-left-color: #22c55e;
        }

        &.expired {
          background: #2d1b1b;
          border-left-color: #ef4444;
        }

        .event-header {
          > div:first-child {
            .text-h6 {
              color: #f8fafc;
            }

            .text-caption {
              color: #94a3b8 !important;
            }
          }
        }

        .detail-section-title {
          color: #60a5fa;
          border-bottom-color: #334155;
        }

        .detail-item {
          .detail-label {
            color: #cbd5e1;
          }

          .detail-value {
            color: #e2e8f0;

            &.text-positive {
              color: #4ade80;
            }
          }
        }

        :deep(.q-separator) {
          background: #334155;
        }
      }
    }
  }

  .text-center {
    p {
      color: #94a3b8;
    }
  }
}

.text-center {
  :deep(.q-icon) {
    margin: 0;
  }

  p {
    margin: 8px 0 0 0;
    font-size: 13px;
    color: #999;
  }
}
</style>
