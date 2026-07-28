<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-sm items-center q-mb-md">
      <div class="col-12">
        <div class="text-h5">Reembolsos a Clientes</div>
        <p class="text-subtitle1 text-grey-7 q-mt-xs">
          Gestiona y procesa las devoluciones de dinero a clientes por cancelaciones de eventos a través de OpenPay.
        </p>
        <q-banner
          dense
          inline-actions
          rounded
          :class="[$q.dark.isActive ? 'bg-blue-10 text-blue-1' : 'bg-blue-1 text-blue-9', 'q-py-sm q-px-md']"
        >
          <template v-slot:avatar>
            <q-icon name="info" color="blue" size="sm" />
          </template>
          <div class="text-body2">
            <strong>Procesamiento de Reembolsos vía OpenPay:</strong>
            <ul>
              <li class="q-mb-xs">
                Al hacer click en <strong>Procesar Reembolso</strong>, OpenPay devolverá el monto neto correspondiente a la tarjeta del cliente.
              </li>
              <li>
                El porcentaje a reembolsar se calcula con base en la penalización por tiempo de cancelación definida en la plataforma.
              </li>
            </ul>
          </div>
        </q-banner>
        <div class="row q-col-gutter-md items-center q-mt-md">
          <div class="col">
            <q-tabs
              v-model="activeTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left"
            >
              <q-tab name="pending" label="Reembolsos Pendientes" />
              <q-tab name="history" label="Historial de Reembolsos" />
            </q-tabs>
          </div>
          <div class="col-12 col-md-auto">
            <q-input
              dense
              debounce="100"
              v-model="searchFilter"
              placeholder="Buscar..."
              color="primary"
              style="min-width: 280px"
            > 
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>
    <div>
      <q-table
        v-if="displayedRefunds && displayedRefunds.length > 0"
        :rows="displayedRefunds"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
        no-data-label="No hay registros de reembolsos"
        rows-per-page-label="Registros por página:"
        class="refunds-table" >
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
            <q-td key="sale_id" :props="props" class="text-weight-bold">
              #{{ props.row.cancellation?.artist_sale_id || 'N/A' }}
            </q-td>
            <q-td key="customer_name" :props="props" class="text-weight-medium">
              {{ props.row.customer?.name || 'Cliente desconocido' }}
            </q-td>
            <q-td key="reason" :props="props">
              {{ props.row.cancellation?.cancellation_reason || 'Sin motivo especificado' }}
            </q-td>
            <q-td key="refund_percentage" :props="props" class="text-weight-medium">
              {{ props.row.refund_percentage }}%
            </q-td>
            <q-td key="refund_amount" :props="props" class="text-weight-bold text-positive">
              ${{ formatCurrency(props.row.refund_amount) }} MXN
            </q-td>
            <q-td key="status" :props="props">
              <q-badge
                :color="getStatusBadgeColor(props.row.status)"
                class="text-weight-bold" >
                {{ getStatusLabel(props.row.status) }}
              </q-badge>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'">
            <q-td colspan="100%">
              <div class="q-pa-md row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-card flat bordered class="fill-height">
                    <q-card-section class="bg-primary text-white q-py-xs">
                      <div class="text-subtitle2">Desglose de Cancelación y Reembolso</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="q-py-sm">
                      <div class="row justify-between q-py-xs">
                        <span :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'">Porcentaje a devolver:</span>
                        <span class="text-weight-medium">{{ props.row.refund_percentage }}%</span>
                      </div>
                      <q-separator class="q-my-xs" />
                      <div class="row justify-between q-py-xs text-subtitle1 text-weight-bold text-positive">
                        <span>Monto Neto a Reembolsar:</span>
                        <span>${{ formatCurrency(props.row.refund_amount) }} MXN</span>
                      </div>
                      <div v-if="props.row.openpay_refund_id" class="q-mt-sm text-caption text-grey-7">
                        <strong>OpenPay Refund ID:</strong> {{ props.row.openpay_refund_id }}
                      </div>
                    </q-card-section>
                  </q-card>
                  </div>
                <div class="col-12 col-md-6 flex flex-center">
                  <q-card flat bordered class="fill-height full-width flex flex-center text-center q-pa-md">
                    <div>
                      <div v-if="props.row.status === 'processed'">
                          <q-icon name="check_circle" color="positive" size="lg" />
                          <div class="text-subtitle1 text-weight-bold text-positive q-mt-sm">
                            Reembolso Procesado
                          </div>
                          <div class="text-caption text-grey-7">
                            Autorizado por: <strong>{{ props.row.authorized_by?.name || 'Administrador' }}</strong>
                          </div>
                      </div>
                      <div v-else>
                        <q-icon name="account_balance_wallet" color="primary" size="lg" />
                        <div class="text-subtitle1 text-weight-bold q-mt-sm">
                          Acción Requerida
                        </div>
                        <div class="text-caption text-grey-7 q-mb-md">
                          Haz clic para procesar automáticamente la devolución a través del gateway de OpenPay.
                        </div>
                        <q-btn
                          label="Procesar Reembolso en OpenPay"
                          color="primary"
                          icon="send"
                          class="text-weight-bold"
                          :disable="props.row.status === 'processed'"
                          @click.stop="confirmRefund(props.row)"
                        />
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div v-else-if="loading" class="text-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>
      <div v-else-if="!loading" class="text-center q-py-xl">
        <q-icon 
          :name="activeTab === 'history' ? 'history' : 'receipt_long'" 
          size="4em" 
          color="grey-5" 
        />
        <p class="text-grey-6 q-mt-md">
          {{ activeTab === 'history' ? 'Aún no hay registros en el historial de reembolsos.' : 'No hay solicitudes de reembolso pendientes.' }}
        </p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

const columns = [
  { name: "expand", label: "Detalles", align: "center" },
  { name: "sale_id", label: "ID Venta", field: (row) => row.cancellation?.artist_sale_id, align: "center", sortable: true },
  { name: "customer_name", label: "Cliente", field: (row) => row.customer?.name, align: "center", sortable: true },
  { name: "reason", label: "Motivo Cancelación", field: (row) => row.cancellation?.cancellation_reason, align: "center" },
  { name: "refund_percentage", label: "% Devolución", field: "refund_percentage", align: "center" },
  { name: "refund_amount", label: "Monto a Devolver", field: "refund_amount", align: "center", sortable: true },
  { name: "status", label: "Estado", field: "status", align: "center", sortable: true },
];

export default {
  name: "AdminRefundsIndex",

  data() {
    return {
      activeTab: "pending",
      columns,
      loading: false,
      searchFilter: "",
    };
  },

  computed: {
    ...mapGetters("refunds", {
      refundsList: "stateRefunds",
    }),

    displayedRefunds() {
      if (!this.refundsList || !Array.isArray(this.refundsList)) return [];
      let list = this.refundsList.filter((item) => {
        return this.activeTab === "pending"
          ? item.status === "pending"
          : item.status === "processed";
      });

      if (this.searchFilter) {
        const filter = this.searchFilter.toLowerCase().trim();
        list = list.filter((row) => {
          const saleId = String(row.cancellation?.artist_sale_id || "").toLowerCase();
          const customerName = String(row.customer?.name || "").toLowerCase();
          return saleId.includes(filter) || customerName.includes(filter);
        });
      }

      return list;
    },
  },

  async created() {
    await this.loadData();
  },

  methods: {
    ...mapActions("refunds", ["fetchRefunds", "processClientRefund"]),

    async loadData() {
      this.loading = true;
      try {
        await this.fetchRefunds();
      } catch (error) {
        this.$q.notify({
          color: "negative",
          icon: "error",
          message: "No se pudieron cargar las devoluciones de clientes.",
        });
      } finally {
        this.loading = false;
      }
    },

    confirmRefund(refund) {
      const saleId = refund.cancellation?.artist_sale_id || 'N/A';
      const customerName = refund.customer?.name || 'Cliente';

      this.$q
        .dialog({
          title: "Confirmar Reembolso en OpenPay",
          message: `¿Estás seguro de procesar el reembolso de la venta #${saleId} para "${customerName}" por un monto de $${this.formatCurrency(refund.refund_amount)} MXN?\n\nEsta acción enviará la transacción directamente a OpenPay.`,
          cancel: { label: "Cancelar", color: "grey", flat: true },
          ok: { label: "Sí, Procesar Reembolso", color: "primary" },
          persistent: true,
        })
        .onOk(async () => {
          try {
            this.$q.loading.show({ message: "Conectando con la API de OpenPay..." });
            await this.processClientRefund(refund.id);
            this.$q.notify({
              color: "positive",
              icon: "thumb_up",
              message: "¡Reembolso procesado exitosamente con OpenPay!",
            });
          } catch (error) {
            this.$q.notify({
              color: "negative",
              icon: "error",
              message: error.response?.data?.message || "Error al procesar el reembolso en el servidor.",
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },

    getStatusBadgeColor(status) {
      switch (status) {
        case "processed":
          return "positive";
        case "failed":
          return "negative";
        default:
          return "warning";
      }
    },

    getStatusLabel(status) {
      switch (status) {
        case "processed":
          return "PROCESADO";
        case "failed":
          return "FALLIDO";
        default:
          return "PENDIENTE";
      }
    },

    formatCurrency(value) {
      return Number(value || 0).toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
};
</script>
