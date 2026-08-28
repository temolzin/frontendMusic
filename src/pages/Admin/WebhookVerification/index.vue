<template>
  <div class="q-pa-md">
    <PageBreadcrumbs :items="[{ label: 'Códigos de Verificación Webhook', icon: 'verified' }]" />
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <b class="text-h5 q-mb-md d-block">Códigos de Verificación Webhook</b>
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
            style="border-radius: 8px"
            @click="copyUrl"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-table
      :rows="codes"
      :columns="columns"
      row-key="id"
      flat
      bordered
      no-data-label="No se han recibido códigos de verificación aún"
      :rows-per-page-options="[10, 20, 30, 0]"
      :loading="loading"
    >
      <template v-slot:top>
        <b class="text-h6">Códigos Recibidos</b>
        <q-space />
        <div class="q-gutter-sm">
          <q-btn
            unelevated
            color="negative"
            icon="delete_sweep"
            label="Limpiar todos"
            size="sm"
            style="border-radius: 8px"
            :disable="!codes.length"
            @click="confirmClearAll"
          />
          <q-btn
            unelevated
            color="secondary"
            icon="refresh"
            label="Actualizar"
            size="sm"
            style="border-radius: 8px"
            @click="loadCodes"
            :loading="loading"
          />
        </div>
      </template>

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
          {{ formatDateTime(props.row.event_date, true) }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          <q-badge v-bind="getWebhookTimeColor(props.row.created_at, $q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
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
  </div>
</template>
<script>
import PageBreadcrumbs from "src/components/PageBreadcrumbs.vue";
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { getWebhookTimeColor } from 'src/utils/badgeStyles'
import { notifySuccess, notifyError } from 'src/utils/notify';
import { formatDate, formatDateTime } from 'src/utils/formatDate';

export default defineComponent({
  components: { PageBreadcrumbs },
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
      formatDateTime,
      timeAgo,
      getWebhookTimeColor
    }
  },
})
</script>
