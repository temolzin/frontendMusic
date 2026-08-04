<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 text-weight-bold q-mb-lg">Configuración OpenPay</div>

    <q-card class="shadow-4" style="max-width: 600px;">
      <q-card-section class="q-pt-sm q-pb-sm">
        <div class="text-subtitle2 text-grey q-mb-sm">Credenciales de la pasarela de pago</div>

        <q-input
          v-model="form.openpay_id"
          label="ID de OpenPay"
          outlined
          class="q-mb-sm"
        />

        <q-input
          v-model="form.openpay_secret"
          label="Llave Secreta"
          outlined
          :type="showSecret ? 'text' : 'password'"
          class="q-mb-sm"
        >
          <template #append>
            <q-icon
              :name="showSecret ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showSecret = !showSecret"
            />
          </template>
        </q-input>

        <q-input
          v-model="form.openpay_public_key"
          label="Llave Pública"
          outlined
          class="q-mb-sm"
        />

        <q-toggle
          v-model="form.openpay_sandbox_mode"
          label="Modo Sandbox (pruebas)"
          color="primary"
          class="q-mt-sm"
        />
        <div class="text-caption text-grey q-ml-xs">
          <template v-if="form.openpay_sandbox_mode">Activado — las transacciones serán simuladas</template>
          <template v-else>Desactivado — las transacciones serán reales (producción)</template>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-sm">
        <q-btn
          unelevated
          label="Guardar"
          color="primary"
          :loading="loading"
          @click="save"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { notifySuccess, notifyError } from 'src/utils/notify';

export default defineComponent({
  name: 'OpenpayKeysIndex',
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const showSecret = ref(false)

    const form = ref({
      openpay_id: '',
      openpay_secret: '',
      openpay_public_key: '',
      openpay_sandbox_mode: true,
    })

    const load = async () => {
      try {
        const res = await api.get('/api/admin/openpay-keys')
        if (res.data.success && res.data.data) {
          form.value.openpay_id = res.data.data.openpay_id
          form.value.openpay_secret = res.data.data.openpay_secret
          form.value.openpay_public_key = res.data.data.openpay_public_key
          form.value.openpay_sandbox_mode = res.data.data.openpay_sandbox_mode ?? true
        }
      } catch (e) {
        notifyError('Error cargando credenciales', { position: "top" })
      }
    }

    const save = async () => {
      loading.value = true
      try {
        await api.put('/api/admin/openpay-keys', form.value)
        notifySuccess('Credenciales guardadas correctamente', { position: "top" })
      } catch (e) {
        notifyError('Error al guardar las credenciales', { position: "top" })
      } finally {
        loading.value = false
      }
    }

    onMounted(load)

    return { form, loading, showSecret, save }
  }
})
</script>
