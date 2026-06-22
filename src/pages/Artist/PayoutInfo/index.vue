<template>
  <q-page padding class="q-pa-md">
    <div class="row q-col-gutter-md justify-center">
      <div class="col-12 col-md-8">
        
        <q-banner 
          rounded 
          class="q-mb-md q-pa-md"
          :class="$q.dark.isActive ? 'bg-grey-9 text-grey-3' : 'bg-blue-1 text-blue-9'"
        >
          <template v-slot:avatar>
            <q-icon name="info" :color="$q.dark.isActive ? 'accent' : 'primary'" size="sm" />
          </template>
          <div class="text-weight-medium">
            ¡Registra la cuenta donde recibirás tus ganancias! Al completar tus eventos, utilizaremos esta información para transferirte tus fondos de manera segura a través de OpenPay. Asegúrate de verificar que todos tus datos sean correctos.
          </div>
        </q-banner>

        <q-card 
          class="q-pa-sm" 
          flat 
          bordered
          :class="$q.dark.isActive ? 'bg-grey-10 text-white border-grey-9' : 'bg-white text-black'"
        >
          <q-card-section>
            <div class="text-h6 text-weight-bold text-accent">
              <q-icon name="account_balance" class="q-mr-sm" />
              Datos de Cobro
            </div>
            <div class="text-subtitle2" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'">
              Configura tu cuenta bancaria destino para transferencias electrónicas.
            </div>
          </q-card-section>

          <q-separator :dark="$q.dark.isActive" inset />

          <q-card-section>
            <q-form @submit="savePayoutInfo" class="q-gutter-md">
                <q-input
                    outlined
                    :bg-color="$q.dark.isActive ? '' : 'grey-2'"
                    :dark="$q.dark.isActive"
                    v-model="payoutData.account_holder"
                    label="Titular de la cuenta *"
                    hint="Nombre completo del dueño de la cuenta o razón social"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'El nombre del titular es obligatorio' ]"
                    :disable="!isEditing"
                />
                <q-select
                    outlined
                    :bg-color="$q.dark.isActive ? '' : 'grey-2'"
                    :dark="$q.dark.isActive"
                    v-model="payoutData.bank_name"
                    :options="bankOptions"
                    label="Banco *"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Debes seleccionar un banco' ]"
                    :disable="!isEditing"
                />
                <q-input
                    outlined
                    :bg-color="$q.dark.isActive ? '' : 'grey-2'"
                    :dark="$q.dark.isActive"
                    v-model="payoutData.clabe"
                    label="CLABE Interbancaria *"
                    mask="##################"
                    unmasked-value
                    hint="Clave de 18 dígitos numéricos para transferencias SPEI"
                    lazy-rules
                    :rules="[
                    val => val && val.length === 18 || 'La CLABE debe tener exactamente 18 dígitos',
                    val => /^\d+$/.test(val) || 'La CLABE solo debe contener números'
                    ]"
                    :disable="!isEditing"
                />
                <q-input
                    outlined
                    :bg-color="$q.dark.isActive ? '' : 'grey-2'"
                    :dark="$q.dark.isActive"
                    v-model="payoutData.rfc"
                    label="RFC (Opcional)"
                    mask="XXXX######XXX"
                    hint="RFC asociado a la cuenta (12 o 13 caracteres)"
                    style="text-transform: uppercase;"
                    :disable="!isEditing"
                />
                
                <div class="row justify-end q-mt-lg q-gutter-sm">
                    <q-btn 
                      v-if="!isEditing"
                      label="Editar Información" 
                      color="warning" 
                      icon="edit"
                      class="text-weight-bold"
                      @click="isEditing = true"
                    />

                    <q-btn 
                      v-else
                      label="Guardar Información" 
                      type="submit" 
                      color="accent" 
                      icon="save"
                      class="text-weight-bold"
                    />
                </div>
            </q-form>
          </q-card-section>
        </q-card>

      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
useQuasar
import { useQuasar } from "quasar";
import { useStore } from "vuex";

export default {
  name: "PayoutInfoPage",
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const isEditing = ref(true);

    const payoutData = ref({
      account_holder: "",
      bank_name: "",
      clabe: "",
      rfc: ""
    });

    const bankOptions = [
      "BBVA", "Banamex", "Santander", "Banorte", "HSBC", 
      "Scotiabank", "Banco Azteca", "BanCoppel", "Inbursa", "STP"
    ];

    onMounted(async () => {
      $q.loading.show({ message: 'Cargando datos de cobro...' });
      await store.dispatch("payoutMethod/fetchPayoutMethod");
      
      const savedData = store.getters["payoutMethod/getPayoutData"];
      if (savedData && savedData.clabe) {
        payoutData.value = {
          account_holder: savedData.account_holder || "",
          bank_name: savedData.bank_name || "",
          clabe: savedData.clabe || "",
          rfc: savedData.rfc || ""
        };
        isEditing.value = false;
      }
      
      $q.loading.hide();
    });

    async function savePayoutInfo() {
      $q.loading.show({ message: 'Guardando en el servidor...' });
      
      try {
        await store.dispatch("payoutMethod/savePayoutMethod", payoutData.value);
        
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "cloud_done",
          message: "¡Datos de cobro guardados en el servidor con éxito!",
          position: "bottom"
        });

        isEditing.value = false;
      } catch (error) {
        const errorMessage = error.errors && error.errors.clabe 
          ? error.errors.clabe[0] 
          : "Hubo un error al guardar los datos bancarios.";
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: errorMessage,
          position: "bottom"
        });
      } finally {
        $q.loading.hide();
      }
    }

    return {
      payoutData,
      bankOptions,
      savePayoutInfo,
      isEditing
    };
  }
};
</script>
