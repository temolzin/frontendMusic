<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 95vw">
      <q-card-section class="row items-center bg-negative text-white q-pb-sm">
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-md">
        <div v-if="loadingPreview" class="text-center q-py-md">
          <q-spinner size="30px" color="negative" />
          <p class="text-grey q-mt-sm">Calculando penalización...</p>
        </div>
        <div v-if="!loadingPreview" class="text-weight-bold q-mb-sm">{{ confirmText }}</div>
        <q-list v-if="!loadingPreview" dense>
          <q-item v-if="type === 'artist'">
            <q-item-section>
              <q-item-label caption>Cliente</q-item-label>
              <q-item-label class="text-weight-medium">
                {{ sale?.customerFirstName || sale?.customer_first_name || '' }}
                {{ sale?.customerLastName || sale?.customer_last_name || '' }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="type === 'client'">
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
              <q-item-label class="text-weight-medium">{{       preview?.days_until_event ?? 0 }} días</q-item-label>
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
          <q-item v-if="      (preview?.penalty_percentage ?? 0) > 0">
            <q-item-section>
              <q-item-label caption>Penalización</q-item-label>
              <q-item-label class="text-weight-medium text-negative">
                {{ preview?.penalty_percentage ?? 0 }}% (${{ Number(preview?.penalty_amount ?? 0).toLocaleString('es-MX') }})
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="      (preview?.penalty_percentage ?? 0) === 0">
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
          <q-item v-if="type === 'client'">
            <q-item-section>
              <q-item-label caption>Reembolso</q-item-label>
              <q-item-label class="text-weight-medium text-primary">
                ${{ Number(preview?.refund_amount ?? 0).toLocaleString('es-MX') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-input
          v-if="!loadingPreview"
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
          :disable="!reason.trim() || loadingPreview"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { api } from 'boot/axios'
import { notifyError } from 'src/utils/notify'

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
    const reason = ref('')
    const loading = ref(false)
    const loadingPreview = ref(false)
    const preview = ref(null)

    const eventDate = computed(() => {
      if (!props.sale) return null
      const raw = props.sale.date || props.sale.event_date
      if (!raw) return null
      const sep = raw.includes('/') ? '/' : '-'
      const parts = raw.split(sep)
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
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

    const formattedDate = computed(() => {
      const ed = eventDate.value
      if (!ed) return ''
      return ed.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })
    })

    watch(() => props.modelValue, async (open) => {
      if (open && props.sale?.id) {
        preview.value = null
        loadingPreview.value = true
        try {
          const res = await api.get(`/api/sales/${props.sale.id}/cancellation-preview`, {
            params: { role: props.type }
          })
          if (res.data?.success) {
            preview.value = res.data.data
          }
        } catch {
          preview.value = null
        } finally {
          loadingPreview.value = false
        }
      }
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
        notifyError(error.response?.data?.message || 'Error al cancelar')
      } finally {
        loading.value = false
      }
    }

    return {
      reason,
      loading,
      loadingPreview,
      preview,
      amount,
      label,
      dialogTitle,
      confirmText,
      formattedDate,
      confirm,
    }
  }
}
</script>
