<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 95vw">
      <q-card-section class="row items-center bg-negative text-white q-pb-sm">
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-md">
        <div class="text-weight-bold q-mb-sm">{{ confirmText }}</div>
        <q-list dense>
          <q-item v-if="type === 'artist'">
            <q-item-section>
              <q-item-label caption>Cliente</q-item-label>
              <q-item-label class="text-weight-medium">
                {{ sale?.customerFirstName || sale?.customer_first_name || '' }}
                {{ sale?.customerLastName || sale?.customer_last_name || '' }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else>
            <q-item-section>
              <q-item-label caption>Artista</q-item-label>
              <q-item-label class="text-weight-medium">{{ sale?.artist?.name || '' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Fecha del evento</q-item-label>
              <q-item-label class="text-weight-medium">{{ formattedDate }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Días restantes</q-item-label>
              <q-item-label class="text-weight-medium">{{ daysUntilEvent }} días</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Monto del evento</q-item-label>
              <q-item-label class="text-weight-medium text-positive">
                ${{ Number(amount).toLocaleString('es-MX') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="penaltyPercentage > 0">
            <q-item-section>
              <q-item-label caption>Penalización</q-item-label>
              <q-item-label class="text-weight-medium text-negative">
                {{ penaltyPercentage }}% (${{ Number(penaltyAmount).toLocaleString('es-MX') }})
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else>
            <q-item-section>
              <q-item-label caption>Penalización</q-item-label>
              <q-item-label class="text-weight-medium text-positive">0% (Sin penalización)</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="type === 'artist'">
            <q-item-section>
              <q-item-label caption>Reembolso al cliente</q-item-label>
              <q-item-label class="text-weight-medium text-primary">
                100% (${{ Number(amount).toLocaleString('es-MX') }})
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else>
            <q-item-section>
              <q-item-label caption>Reembolso</q-item-label>
              <q-item-label class="text-weight-medium text-primary">
                ${{ Number(refundAmount).toLocaleString('es-MX') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-input
          v-model="reason"
          type="textarea"
          outlined
          dense
          rows="3"
          label="Motivo de la cancelación *"
          :placeholder="'Explica por qué cancelas ' + (label === 'solicitud' ? 'la solicitud' : 'el evento') + '...'"
          :rules="[val => !!val || 'El motivo es requerido']"
          class="q-mt-md"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Volver" color="grey" v-close-popup />
        <q-btn
          unelevated
          label="Sí, cancelar"
          color="negative"
          icon="cancel"
          :loading="loading"
          :disable="!reason.trim()"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

export default {
  name: 'CancellationModal',
  props: {
    modelValue: Boolean,
    sale: Object,
    type: {
      type: String,
      default: 'client',
      validator: v => ['artist', 'client'].includes(v)
    },
    cancelEndpoint: String,
  },
  emits: ['update:modelValue', 'cancelled'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const reason = ref('')
    const loading = ref(false)

    const eventDate = computed(() => {
      if (!props.sale) return null
      const raw = props.sale.date || props.sale.event_date
      if (!raw) return null
      const sep = raw.includes('/') ? '/' : '-'
      const parts = raw.split(sep)
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    })

    const daysUntilEvent = computed(() => {
      const ed = eventDate.value
      if (!ed) return 0
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const diff = Math.ceil((ed - today) / (1000 * 60 * 60 * 24))
      return Math.max(0, diff)
    })

    const amount = computed(() => {
      return parseFloat(props.sale?.rate || props.sale?.amount || 0)
    })

    const label = computed(() => {
      if (props.type === 'artist') return 'evento'
      return props.sale?.approval_status === 'accepted' ? 'evento' : 'solicitud'
    })

    const dialogTitle = computed(() => `Cancelar ${label.value}`)
    const confirmText = computed(() => `¿Estás seguro de cancelar ${label.value === 'solicitud' ? 'esta solicitud' : 'este evento'}?`)

    const penaltyPercentage = computed(() => {
      const days = daysUntilEvent.value
      if (props.type === 'artist') {
        if (days >= 30) return 0
        if (days >= 7) return 50
        if (days >= 1) return 100
        return 0
      }
      if (props.sale?.approval_status !== 'accepted') return 0
      if (days >= 30) return 0
      if (days >= 7) return 50
      if (days >= 1) return 100
      return 0
    })

    const penaltyAmount = computed(() => {
      return Math.round(amount.value * (penaltyPercentage.value / 100) * 100) / 100
    })

    const refundAmount = computed(() => {
      return amount.value - penaltyAmount.value
    })

    const formattedDate = computed(() => {
      const ed = eventDate.value
      if (!ed) return ''
      return ed.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })
    })

    async function confirm() {
      if (!reason.value.trim()) return
      loading.value = true
      try {
        const response = await api.post(props.cancelEndpoint, { reason: reason.value })
        emit('cancelled', { saleId: props.sale?.id, response: response.data })
        reason.value = ''
        emit('update:modelValue', false)
      } catch (error) {
        $q.notify({
          type: 'negative',
          icon: 'error',
          message: error.response?.data?.message || 'Error al cancelar',
        })
      } finally {
        loading.value = false
      }
    }

    return {
      reason,
      loading,
      daysUntilEvent,
      amount,
      label,
      dialogTitle,
      confirmText,
      penaltyPercentage,
      penaltyAmount,
      refundAmount,
      formattedDate,
      confirm,
    }
  }
}
</script>
