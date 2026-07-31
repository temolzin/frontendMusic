<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 text-weight-bold q-mb-md">Códigos de Verificación Webhook</div>
    <q-card class="shadow-4 q-mb-lg">
      <q-card-section>
        <div class="text-body2 text-grey q-mb-md">
          Cuando configures un webhook en OpenPay, el sistema enviará un código de verificación a esta URL. Los códigos capturados aparecerán aquí. Copia el código y pégalo en el panel de OpenPay para completar la verificación.
        </div>
        <div class="text-subtitle2 text-weight-medium q-mb-xs">URL del Webhook</div>
        <div class="row items-center q-gutter-sm">
          <q-input
            :model-value="webhookUrl"
            outlined
            dense
            readonly
            class="col-grow"
            style="max-width: 500px;"
          />
          <q-btn
            unelevated
            color="primary"
            icon="content_copy"
            label="Copiar URL"
            @click="copyUrl"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-card class="shadow-4">
      <q-card-section class="q-pb-none">
        <div class="row items-center justify-between">
          <div class="text-h6">Códigos Recibidos</div>
          <div class="q-gutter-sm">
            <q-btn
              unelevated
              color="negative"
              icon="delete_sweep"
              label="Limpiar todos"
              :disable="!codes.length"
              @click="confirmClearAll"
            />
            <q-btn
              unelevated
              color="secondary"
              icon="refresh"
              label="Actualizar"
              @click="loadCodes"
              :loading="loading"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="codes"
          :columns="columns"
          row-key="id"
          flat
          bordered
          no-data-label="No se han recibido códigos de verificación aún"
          :rows-per-page-options="[10, 25, 50, 0]"
          :loading="loading"
        >
          <template v-slot:body-cell-verification_code="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <span class="text-weight-medium text-monospace">{{ props.row.verification_code }}</span>
                <q-btn
                  flat
                  dense
                  round
                  size="sm"
                  icon="content_copy"
                  color="primary"
                  @click="copyCode(props.row.verification_code)"
                >
                  <q-tooltip>Copiar código</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-event_date="props">
            <q-td :props="props">
              {{ formatDate(props.row.event_date) }}
            </q-td>
          </template>
          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              <q-badge :color="getTimeBadgeColor(props.row.created_at)">
                {{ timeAgo(props.row.created_at) }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                size="sm"
                icon="delete"
                color="negative"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Quitar código</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { notifySuccess, notifyError } from 'src/utils/notify';

export default defineComponent({
  name: 'WebhookVerificationIndex',
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const codes = ref([])
    const webhookUrl = ref('')

    const columns = [
      { name: 'verification_code', label: 'Código de Verificación', field: 'verification_code', align: 'left', sortable: true },
      { name: 'event_date', label: 'Fecha/Hora del Evento', field: 'event_date', align: 'left', sortable: true },
      { name: 'created_at', label: 'Recibido', field: 'created_at', align: 'center', sortable: true },
      { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
    ]

    const loadCodes = async () => {
      loading.value = true
      try {
        const res = await api.get('/api/admin/webhook-verification-codes')
        if (res.data.success) {
          codes.value = res.data.data
          webhookUrl.value = res.data.webhook_url
        }
      } catch (e) {
        notifyError('Error al cargar los códigos')
      } finally {
        loading.value = false
      }
    }

    const copyUrl = () => {
      navigator.clipboard.writeText(webhookUrl.value).then(() => {
        notifySuccess('URL copiada al portapapeles')
      }).catch(() => {
        notifyError('No se pudo copiar la URL')
      })
    }

    const copyCode = (code) => {
      navigator.clipboard.writeText(code).then(() => {
        notifySuccess(`Código "${code}" copiado al portapapeles`)
      }).catch(() => {
        notifyError('No se pudo copiar el código')
      })
    }

    const confirmDelete = (row) => {
      $q.dialog({
        title: 'Eliminar código',
        message: `¿Eliminar el código "${row.verification_code}"?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete(`/api/admin/webhook-verification-codes/${row.id}`)
          codes.value = codes.value.filter(c => c.id !== row.id)
          notifySuccess('Código eliminado')
        } catch (e) {
          notifyError('Error al eliminar el código')
        }
      })
    }

    const confirmClearAll = () => {
      $q.dialog({
        title: 'Limpiar todos los códigos',
        message: '¿Eliminar todos los códigos de verificación? Esta acción no se puede deshacer.',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await api.delete('/api/admin/webhook-verification-codes')
          codes.value = []
          notifySuccess('Todos los códigos fueron eliminados')
        } catch (e) {
          notifyError('Error al limpiar los códigos')
        }
      })
    }

    const formatDate = (date) => {
      if (!date) return '-'
      const d = new Date(date)
      return d.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }

    const timeAgo = (date) => {
      if (!date) return '-'
      const now = new Date()
      const diff = now - new Date(date)
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const weeks = Math.floor(days / 7)
      const months = Math.floor(days / 30)

      if (months > 0) return `hace ${months} mes${months > 1 ? 'es' : ''}`
      if (weeks > 0) return `hace ${weeks} semana${weeks > 1 ? 's' : ''}`
      if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
      if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
      if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      return 'hace unos segundos'
    }

    const getTimeBadgeColor = (date) => {
      if (!date) return 'grey'
      const now = new Date()
      const diff = now - new Date(date)
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours < 1) return 'positive'
      if (hours < 24) return 'warning'
      return 'grey'
    }

    onMounted(() => {
      loadCodes()
    })

    return {
      loading,
      codes,
      columns,
      webhookUrl,
      loadCodes,
      copyUrl,
      copyCode,
      confirmDelete,
      confirmClearAll,
      formatDate,
      timeAgo,
      getTimeBadgeColor,
    }
  },
})
</script>
