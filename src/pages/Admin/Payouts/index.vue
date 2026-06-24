<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-sm items-center q-mb-md">
      <div class="col-12">
        <h1 class="text-h4 font-weight-bold q-my-none text-primary">
          <q-icon name="payments" class="q-mr-sm" />
          Liquidaciones por Pagar
        </h1>
        <p class="text-subtitle1 text-grey-7 q-mt-xs">
          Gestiona las transferencias de los eventos finalizados y desglosa las comisiones de forma justa.
        </p>
      </div>
    </div>
    <q-table
      :rows="payouts"
      :columns="columns"
      row-key="sale_id"
      :loading="loading"
      flat
      bordered
      no-data-label="No hay liquidaciones pendientes por pagar"
      rows-per-page-label="Registros por página:"
      class="payouts-table"
    >
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer" @click="props.expand = !props.expand">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="primary"
              round
              flat
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            />
          </q-td>
          <q-td key="sale_id" :props="props">#{{ props.row.sale_id }}</q-td>
          <q-td key="artist_name" :props="props" class="text-weight-medium">
            {{ props.row.artist.name }}
          </q-td>
          <q-td key="event_date" :props="props">
            {{ props.row.event_date }} a las {{ props.row.event_hour.substring(0, 5) }} hrs
          </q-td>
          <q-td key="net_artist_payout" :props="props" class="text-weight-bold text-positive">
            ${{ formatCurrency(props.row.net_artist_payout) }} MXN
          </q-td>
          <q-td key="status" :props="props">
            <q-badge 
              :color="props.row.event_status === 'completed' ? 'positive' : 'warning'"
              class="text-weight-bold"
            >
              {{ props.row.event_status === 'completed' ? 'COMPLETADO' : 'PENDIENTE' }}
            </q-badge>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props" class="bg-grey-1">
          <q-td colspan="100%">
            <div class="q-pa-md row q-col-gutter-md">
              <div class="col-12 col-md-5">
                <q-card flat bordered class="bg-white fill-height">
                  <q-card-section class="bg-primary text-white q-py-xs">
                    <div class="text-subtitle2">Desglose de la Transacción</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-py-sm">
                    <div class="row justify-between q-py-xs">
                      <span class="text-grey-8">Total pagado por cliente:</span>
                      <span class="text-weight-medium">${{ formatCurrency(props.row.amount) }} MXN</span>
                    </div>
                    <div class="row justify-between q-py-xs text-negative">
                      <span>Comisión OpenPay:</span>
                      <span>- ${{ formatCurrency(props.row.openpay_fee) }} MXN</span>
                    </div>
                    <div class="row justify-between q-py-xs text-negative">
                      <span>Comisión Plataforma (10%):</span>
                      <span>- ${{ formatCurrency(props.row.platform_fee) }} MXN</span>
                    </div>
                    <q-separator class="q-my-xs" />
                    <div class="row justify-between q-py-xs text-subtitle1 text-weight-bold text-positive">
                      <span>Monto Neto a Transferir:</span>
                      <span>${{ formatCurrency(props.row.net_artist_payout) }} MXN</span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-7">
                <q-card flat bordered class="bg-white fill-height" v-if="props.row.artist.payout_method">
                  <q-card-section class="bg-grey-3 text-grey-9 q-py-xs text-center">
                    <div class="text-subtitle2 text-weight-bold">Datos Bancarios del Artista</div>
                  </q-card-section>
                  <q-separator />             
                  <q-card-section class="row q-col-gutter-sm justify-center">
                    <div class="col-12 text-center q-mb-xs">
                      <div class="text-caption text-grey-6">Titular de la Cuenta</div>
                      <div class="text-body2 text-weight-medium text-uppercase">
                        {{ props.row.artist.payout_method.account_holder }}
                      </div>
                    </div>
                    <div class="col-12 text-center q-mb-xs">
                      <div class="text-caption text-grey-6">Banco</div>
                      <div class="text-body2 text-weight-medium text-uppercase">
                        {{ props.row.artist.payout_method.bank_name }}
                      </div>
                    </div>
                    <div class="col-12 text-center q-mb-xs">
                      <div class="text-caption text-grey-6">RFC</div>
                      <div class="text-body2 text-weight-medium text-uppercase">
                        {{ props.row.artist.payout_method.rfc || 'No Registrado' }}
                      </div>
                    </div>
                    <div class="col-12 text-center q-mt-md column items-center">
                      <div class="text-caption text-grey-6 q-mb-xs">Cuenta CLABE (18 dígitos)</div>
                      <div class="row items-center bg-grey-2 q-pa-xs rounded-borders q-mx-auto" style="width: 100%; max-width: 320px;">
                        <span class="text-body1 text-mono text-weight-bold q-px-sm">
                          {{ props.row.artist.payout_method.clabe }}
                        </span>
                        <q-space />
                        <q-btn
                          flat
                          round
                          dense
                          color="primary"
                          icon="content_copy"
                          @click.stop="copyToClipboard(props.row.artist.payout_method.clabe)"
                        >
                          <q-tooltip>Copiar CLABE</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right" class="q-pb-md q-pr-md">
                    <q-btn
                      label="Confirmar Transferencia Realizada"
                      color="positive"
                      icon="check_circle"
                      class="text-weight-bold"
                      :disable="props.row.event_status !== 'completed'"
                      @click.stop="confirmRelease(props.row)"
                    >
                      <q-tooltip v-if="props.row.event_status !== 'completed'">
                        No puedes liquidar este pago hasta que el artista marque el evento como COMPLETADO.
                      </q-tooltip>
                    </q-btn>
                  </q-card-actions>
                </q-card>
                <q-card flat bordered class="bg-red-1 fill-height flex flex-center text-center q-pa-md" v-else>
                  <div>
                    <q-icon name="warning" color="negative" size="md" />
                    <div class="text-subtitle1 text-red-9 text-weight-bold q-mt-sm">Faltan Datos Bancarios</div>
                    <div class="text-caption text-grey-8">
                      El artista no ha registrado su cuenta CLABE en su perfil.<br>
                      No se puede proceder con la liquidación automática.
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  name: "AdminPayoutsIndex",
  setup() {
    const $store = useStore();
    const $q = useQuasar();
    const loading = ref(false);
    const columns = [
      { name: "expand", label: "Detalles", align: "left" },
      { name: "sale_id", label: "ID Venta", field: "sale_id", align: "left", sortable: true },
      { name: "artist_name", label: "Artista", field: row => row.artist.name, align: "left", sortable: true },
      { name: "event_date", label: "Fecha Evento", field: "event_date", align: "left" },
      { name: "net_artist_payout", label: "Pago Neto Artista", field: "net_artist_payout", align: "right", sortable: true },
      { name: "status", label: "Estatus", align: "center" }
    ];

    const payouts = computed(() => $store.getters["payouts/statePendingPayouts"]);
    const loadPayouts = async () => {
      loading.value = true;
      try {
        await $store.dispatch("payouts/fetchPendingPayouts");
      } catch (error) {
        $q.notify({
          color: "negative",
          icon: "error",
          message: "No se pudieron cargar las liquidaciones de los artistas."
        });
      } finally {
        loading.value = false;
      }
    };
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          $q.notify({
            color: "secondary",
            icon: "assignment_turned_in",
            message: "CLABE copiada al portapapeles",
            timeout: 1500
          });
        })
        .catch(() => {
          $q.notify({
            color: "negative",
            icon: "error",
            message: "No se pudo copiar de forma automática."
          });
        });
    };
    const confirmRelease = (payout) => {
      $q.dialog({
        title: "Confirmar Liquidación",
        message: `¿Estás seguro de marcar la venta #${payout.sale_id} del artista "${payout.artist.name}" como pagada? Asegúrate de haber realizado primero la transferencia SPEI manual en tu banca por $${formatCurrency(payout.net_artist_payout)} MXN.`,
        cancel: { label: "Cancelar", color: "grey", flat: true },
        ok: { label: "Sí, Marcar Pagado", color: "positive" },
        persistent: true
      }).onOk(async () => {
        try {
          $q.loading.show({ message: "Actualizando estatus financiero..." });
          await $store.dispatch("payouts/releasePayout", payout.sale_id);
          $q.notify({
            color: "positive",
            icon: "thumb_up",
            message: "Liquidación registrada exitosamente."
          });
        } catch (error) {
          $q.notify({
            color: "negative",
            icon: "error",
            message: "Error al actualizar el estatus en el servidor."
          });
        } finally {
          $q.loading.hide();
        }
      });
    };

    const formatCurrency = (value) => {
      return parseFloat(value).toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    onMounted(() => {
      loadPayouts();
    });

    return {
      payouts,
      columns,
      loading,
      copyToClipboard,
      confirmRelease,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.text-mono {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
}
</style>
