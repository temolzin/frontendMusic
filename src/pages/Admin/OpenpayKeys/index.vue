<template>
  <div class="q-pa-md">
    <q-card flat bordered class="q-mt-md">
      <q-card-section class="q-pa-md">
        <b class="text-h5 q-mb-md d-block">Configuración OpenPay</b>
        <div class="text-body2 text-grey q-mb-lg">
          Configura tus credenciales de la pasarela de pago para procesar las transacciones.
        </div>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-medium q-mb-xs">ID de OpenPay</div>
            <q-input
              v-model="form.openpay_id"
              placeholder="Ingresa tu ID de comercio"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-medium q-mb-xs">Llave Secreta</div>
            <q-input
              v-model="form.openpay_secret"
              placeholder="Ingresa tu llave secreta"
              outlined
              dense
              :type="showSecret ? 'text' : 'password'"
            >
              <template #append>
                <q-icon
                  :name="showSecret ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showSecret = !showSecret"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-medium q-mb-xs">Llave Pública</div>
            <q-input
              v-model="form.openpay_public_key"
              placeholder="Ingresa tu llave pública"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6 flex items-center">
            <div>
              <q-toggle
                v-model="form.openpay_sandbox_mode"
                label="Modo Sandbox (pruebas)"
                color="primary"
                class="text-subtitle2 text-weight-medium"
              />
              <div class="text-caption text-grey q-ml-md q-mt-xs">
                <template v-if="form.openpay_sandbox_mode">Activado — las transacciones serán simuladas</template>
                <template v-else>Desactivado — las transacciones serán reales (producción)</template>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          unelevated
          color="primary"
          style="border-radius: 8px;"
          label="GUARDAR CREDENCIALES"
          icon="save"
          :loading="loading"
          @click="save"
        />
      </q-card-actions>
    </q-card>
  </div>
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
