<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row items-center q-mb-lg">
        <h1 class="text-h4 text-primary q-ma-none">Mi Calendario</h1>
        <q-space />
        <q-btn
          label="Recargar"
          icon="refresh"
          color="primary"
          flat
          @click="reloadBookings"
          :loading="loading"
        />
      </div>

      <q-banner
        v-if="error"
        class="bg-negative text-white q-mb-md rounded-borders"
        dense
      >
        {{ error }}
      </q-banner>

      <q-splitter v-model="splitterModel" class="calendar-splitter">
        <template v-slot:before>
          <div class="q-pa-md">
            <q-card>
              <q-card-section class="bg-primary text-white text-center">
                <h5 class="q-my-none">{{ currentMonth }}</h5>
              </q-card-section>
              <q-card-section>
                <q-date
                  v-model="selectedDate"
                  @update:model-value="selectDate"
                  :events="occupiedDates"
                  event-color="red"
                  minimal
                />
              </q-card-section>
            </q-card>

            <q-card class="q-mt-md">
              <q-card-section>
                <div class="text-subtitle2 q-mb-md">Leyenda</div>
                <div class="row items-center q-mb-sm">
                  <q-badge color="red" class="q-mr-md" />
                  <span>Días con contrataciones</span>
                </div>
                <q-separator class="q-my-md" />
                <div class="text-subtitle2 q-mb-md">Resumen</div>
                <div class="q-mb-sm">
                  <div class="text-overline">Total de contrataciones</div>
                  <div class="text-h6 text-primary">{{ bookings.length }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-overline">Confirmadas</div>
                  <div class="text-h6 text-green">{{ confirmedCount }}</div>
                </div>
                <div>
                  <div class="text-overline">Pendientes</div>
                  <div class="text-h6 text-orange">{{ pendingCount }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>

        <template v-slot:after>
          <q-tabs
            v-model="activeTab"
            dense
            class="text-primary bg-grey-2"
            indicator-color="primary"
            align="left"
          >
            <q-tab name="day" label="Contrataciones del día" />
            <q-tab name="month" label="Todas las contrataciones" />
          </q-tabs>

          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="day">
              <div class="q-pa-md">
                <div class="text-subtitle1 q-mb-md">
                  Contrataciones para {{ selectedDateFormatted }}
                </div>

                <div v-if="bookingsBySelectedDate.length === 0" class="text-center q-py-lg">
                  <q-icon name="event_note" size="64px" color="grey-5" />
                  <p class="text-grey">No hay contrataciones para este día</p>
                </div>

                <q-list v-else separator>
                  <q-item
                    v-for="booking in bookingsBySelectedDate"
                    :key="booking.id"
                    clickable
                    @click="selectBooking(booking)"
                    :active="activeBooking?.id === booking.id"
                    active-class="bg-blue-1"
                  >
                    <q-item-section avatar>
                      <q-icon name="event" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ booking.eventName }}</q-item-label>
                      <q-item-label caption>
                        {{ booking.clientName }}
                      </q-item-label>
                      <q-item-label caption>
                        <q-badge :color="getStatusColor(booking.status)">
                          {{ booking.status }}
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-right">
                        <div class="text-subtitle2">{{ booking.time }}</div>
                        <div class="text-caption text-grey">
                          {{ formatPrice(booking.price) }}
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-tab-panel>

            <q-tab-panel name="month">
              <div class="q-pa-md">
                <div class="text-subtitle1 q-mb-md">
                  Total de contrataciones: {{ bookings.length }}
                </div>

                <div v-if="bookings.length === 0" class="text-center q-py-lg">
                  <q-icon name="calendar_today" size="64px" color="grey-5" />
                  <p class="text-grey">No hay contrataciones registradas</p>
                </div>

                <q-list v-else separator>
                  <q-item
                    v-for="booking in bookings"
                    :key="booking.id"
                    clickable
                    @click="selectBooking(booking)"
                    :active="activeBooking?.id === booking.id"
                    active-class="bg-blue-1"
                  >
                    <q-item-section avatar>
                      <q-icon name="event" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ booking.eventName }}</q-item-label>
                      <q-item-label caption>
                        {{ booking.clientName }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ formatDate(booking.date) }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-badge :color="getStatusColor(booking.status)">
                        {{ booking.status }}
                      </q-badge>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <q-separator v-if="activeBooking" />
          <div v-if="activeBooking" class="q-pa-md bg-grey-1">
            <q-card>
              <q-card-section class="bg-primary text-white">
                <h5 class="q-my-none">{{ activeBooking.eventName }}</h5>
              </q-card-section>

              <q-card-section>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Cliente</div>
                      <div class="text-body1">{{ activeBooking.clientName }}</div>
                    </div>

                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Teléfono</div>
                      <div class="text-body1">
                        <a :href="`tel:${activeBooking.phone}`">
                          {{ activeBooking.phone }}
                        </a>
                      </div>
                    </div>

                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Email</div>
                      <div class="text-body1">
                        <a :href="`mailto:${activeBooking.email}`">
                          {{ activeBooking.email }}
                        </a>
                      </div>
                    </div>

                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Fecha</div>
                      <div class="text-body1">{{ formatDate(activeBooking.date) }}</div>
                    </div>

                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Hora</div>
                      <div class="text-body1">{{ activeBooking.time }}</div>
                    </div>
                  </div>

                  <div class="col-12 col-md-6">
                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Ubicación</div>
                      <div class="text-body1">{{ activeBooking.location }}</div>
                    </div>

                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Ciudad</div>
                      <div class="text-body1">{{ activeBooking.city }}</div>
                    </div>

                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Dirección</div>
                      <div class="text-body1">{{ activeBooking.address }}</div>
                    </div>

                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Estado</div>
                      <q-badge :color="getStatusColor(activeBooking.status)" size="lg">
                        {{ activeBooking.status }}
                      </q-badge>
                    </div>

                    <div class="q-mb-md">
                      <div class="text-overline text-grey">Precio</div>
                      <div class="text-h6 text-primary">
                        {{ formatPrice(activeBooking.price) }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-separator />
              <q-card-section class="bg-grey-2">
                <div class="text-subtitle2 q-mb-md">Cambiar estado</div>
                <div class="row q-gutter-md">
                  <q-btn
                    v-if="activeBooking.status !== 'Confirmada'"
                    label="Confirmar"
                    color="green"
                    flat
                    size="sm"
                    @click="changeBookingStatus(activeBooking.id, 'confirmada')"
                    :loading="updatingStatus"
                  />
                  <q-btn
                    v-if="activeBooking.status !== 'Pendiente'"
                    label="Marcar Pendiente"
                    color="orange"
                    flat
                    size="sm"
                    @click="changeBookingStatus(activeBooking.id, 'pendiente')"
                    :loading="updatingStatus"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'

export default defineComponent({
  name: 'MyCalendar',
  data() {
    return {
      splitterModel: 40,
      activeTab: 'day',
      selectedDate: date.formatDate(new Date(), 'YYYY/MM/DD'),
      activeBooking: null,
      loading: false,
      error: null,
      updatingStatus: false
    }
  },
  computed: {
    ...mapState('artistCalendar', [
      'bookings',
      'loading',
      'error'
    ]),
    ...mapGetters('artistCalendar', [
      'getBookingsByDate',
      'getOccupiedDates'
    ]),
    occupiedDates() {
      return this.getOccupiedDates.map(d => this.formatDateForEvent(d))
    },
    bookingsBySelectedDate() {
      return this.getBookingsByDate(this.selectedDate)
    },
    selectedDateFormatted() {
      return this.formatDate(this.selectedDate)
    },
    currentMonth() {
      const d = new Date(this.selectedDate)
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      return `${monthNames[d.getMonth()]} ${d.getFullYear()}`
    },
    confirmedCount() {
      return this.bookings.filter(b => b.status?.toLowerCase() === 'confirmada').length
    },
    pendingCount() {
      return this.bookings.filter(b => b.status?.toLowerCase() === 'pendiente').length
    }
  },
  methods: {
    ...mapActions('artistCalendar', [
      'fetchBookings',
      'selectDate',
      'selectBooking'
    ]),
    formatToday() {
      const today = new Date()
      return date.formatDate(today, 'YYYY/MM/DD')
    },
    formatDate(dateStr) {
      if (!dateStr) return '-'
      try {
        const d = new Date(dateStr)
        return date.formatDate(d, 'DD/MM/YYYY')
      } catch {
        return dateStr
      }
    },
    formatDateForEvent(dateStr) {
      if (!dateStr) return null
      try {
        const d = new Date(dateStr)
        return date.formatDate(d, 'YYYY/MM/DD')
      } catch {
        return null
      }
    },
    formatPrice(price) {
      if (!price) return '$0.00'
      return `$${parseFloat(price).toFixed(2)}`
    },
    getStatusColor(status) {
      const colors = {
        'confirmada': 'green',
        'confirmado': 'green',
        'pending': 'orange',
        'pendiente': 'orange',
        'cancelada': 'red',
        'cancelado': 'red',
        'completada': 'blue',
        'completado': 'blue'
      }
      return colors[status?.toLowerCase()] || 'grey'
    },
    selectDate(newDate) {
      this.selectedDate = newDate
      this.activeBooking = null
    },
    selectBooking(booking) {
      this.activeBooking = booking
    },
    async reloadBookings() {
      try {
        await this.fetchBookings()
      } catch (error) {
        console.error('Error loading bookings:', error)
      }
    },
    async changeBookingStatus(bookingId, newStatus) {
      this.updatingStatus = true
      try {
        const result = await this.$store.dispatch('artistCalendar/updateBookingStatus', {
          bookingId,
          status: newStatus
        })
        
        await this.fetchBookings()
        
        const updatedBooking = this.bookings.find(b => b.id === bookingId)
        if (updatedBooking) {
          this.activeBooking = updatedBooking
        }
        
        this.$q.notify({
          type: 'positive',
          message: 'Estado actualizado correctamente',
          position: 'top'
        })
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al actualizar el estado',
          position: 'top'
        })
        console.error('Error changing status:', error)
      } finally {
        this.updatingStatus = false
      }
    }
  },
  mounted() {
    this.reloadBookings()
  }
})
</script>

<style scoped>
.calendar-splitter {
  height: calc(100vh - 250px);
}

@media (max-width: 1024px) {
  .calendar-splitter {
    height: auto;
  }
}
</style>
