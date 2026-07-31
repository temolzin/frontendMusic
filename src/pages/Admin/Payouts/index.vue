<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-sm items-center q-mb-md">
      <div class="col-12">
        <div class="text-h5">Liquidaciones por Pagar</div>
        <p class="text-subtitle1 text-grey-7 q-mt-xs">
          Gestiona las transferencias de los eventos finalizados y consulta el historial de liquidaciones realizadas.
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
            <strong>Nota sobre comisiones OpenPay y establecimientos:</strong>
            <ul>
              <li class="q-mb-xs">
                Los pagos realizados con tarjeta mediante <strong>OpenPay</strong> incluyen el desglose de su comisión transaccional digital.
              </li>
            </ul>
            <ul>
              <li>
                Los pagos en efectivo (como <strong>tiendas de autoservicio tipo Oxxo</strong>) también incluyen la comisión de OpenPay descontada de la liquidación del artista.
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
              <q-tab name="pending" label="Liquidaciones Pendientes" />
              <q-tab name="history" label="Historial de Liquidaciones" />
            </q-tabs>
          </div>
          <div v-if="activeTab === 'history'" class="col-12 col-md-auto">
            <q-input
              dense
              debounce="100"
              v-model="searchFilter"
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

    <div v-if="activeTab === 'pending'">
      <q-table
        :rows="pendingPayouts || []"
        :columns="columns"
        row-key="sale_id"
        :loading="loadingPending"
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
            <q-td key="net_artist_payout" :props="props" class="text-weight-bold" :class="totalPenalties(props.row) > 0 ? 'text-primary' : 'text-positive'">
              ${{ formatCurrency(computedAdjustedNet(props.row)) }} MXN
            </q-td>
            <q-td key="event_status" :props="props">
              <q-badge
                :color="props.row.event_status === 'completed' ? 'positive' : 'warning'"
                class="text-weight-bold"
              >
                {{ props.row.event_status === 'completed' ? 'COMPLETADO' : 'PENDIENTE' }}
              </q-badge>
            </q-td>
            <q-td key="payout_status" :props="props">
              <q-badge
                :color="props.row.status === 'liquidated' ? 'positive' : !props.row.can_release ? 'warning' : 'orange'"
                class="text-weight-bold"
              >
                {{ props.row.status === 'liquidated' ? 'LIQUIDADO' : !props.row.can_release ? 'RETENIDO (3 DÍAS)' : 'PENDIENTE' }}
              </q-badge>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'">
            <q-td colspan="100%">
              <div class="q-pa-md row q-col-gutter-md">
                <div class="col-12 col-md-5">
                  <q-card flat bordered class="fill-height">
                    <q-card-section class="bg-primary text-white q-py-xs">
                      <div class="text-subtitle2">Desglose de la Transacción</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section v-if="props.row.is_penalty_only" class="q-py-md text-center">
                      <q-icon name="event_busy" color="grey-6" size="md" />
                      <div class="text-body2 text-grey-8 q-mt-sm">
                        Este evento fue cancelado — no genera pago, solo penalización.
                      </div>
                      <q-separator class="q-my-sm" />
                      <div class="text-subtitle2 text-negative q-mb-xs">
                        Penalizaciones pendientes
                      </div>
                      <div v-for="penalty in props.row.penalties" :key="penalty.sale_id" class="row justify-between q-py-xs text-negative">
                        <span>Cancelación venta #{{ penalty.sale_id }} ({{ penalty.penalty_percentage }}%)</span>
                        <span>- ${{ formatCurrency(penalty.penalty_amount) }} MXN</span>
                      </div>
                      <q-separator class="q-my-xs" />
                      <div class="row justify-between q-py-xs text-subtitle1 text-weight-bold text-negative">
                        <span>Total a descontar:</span>
                        <span>- ${{ formatCurrency(props.row.total_penalties) }} MXN</span>
                      </div>
                    </q-card-section>
                    <q-card-section v-else class="q-py-sm">
                      <div class="row justify-between q-py-xs">
                        <span :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'">Total pagado por cliente:</span>
                        <span class="text-weight-medium">${{ formatCurrency(props.row.amount) }} MXN</span>
                      </div>
                      <div class="row justify-between q-py-xs text-negative">
                        <span>Comisión OpenPay:</span>
                        <span class="row items-center">
                          <q-checkbox
                            v-model="applyFeeMap[props.row.sale_id]"
                            dense
                            size="sm"
                            color="negative"
                            class="q-mr-xs"
                            @update:model-value="onFeeToggle(props.row)"
                          />
                          - ${{ formatCurrency(computedOpenpayFee(props.row)) }} MXN
                        </span>
                      </div>
                      <div class="row justify-between q-py-xs text-negative">
                        <span>Comisión Plataforma (10%):</span>
                        <span>- ${{ formatCurrency(props.row.platform_fee) }} MXN</span>
                      </div>
                      <q-separator class="q-my-xs" />
                      <div class="row justify-between q-py-xs text-subtitle1 text-weight-bold text-positive">
                        <span>Subtotal a Transferir:</span>
                        <span>${{ formatCurrency(computedNetPayout(props.row)) }} MXN</span>
                      </div>
                      <template v-if="props.row.penalties && props.row.penalties.length > 0">
                        <q-separator class="q-my-xs" />
                        <div class="text-subtitle2 text-negative q-mb-xs q-mt-sm">
                          Penalizaciones pendientes
                        </div>
                        <div v-for="penalty in props.row.penalties" :key="penalty.sale_id" class="row justify-between q-py-xs text-negative">
                          <span>Cancelación venta #{{ penalty.sale_id }} ({{ penalty.penalty_percentage }}%)</span>
                          <span>- ${{ formatCurrency(penalty.penalty_amount) }} MXN</span>
                        </div>
                        <q-separator class="q-my-xs" />
                        <div class="row justify-between q-py-xs text-subtitle1 text-weight-bold text-negative">
                          <span>Total penalizaciones:</span>
                          <span>- ${{ formatCurrency(props.row.total_penalties) }} MXN</span>
                        </div>
                      </template>
                      <q-separator class="q-my-xs" />
                      <div class="row justify-between q-py-xs text-subtitle1 text-weight-bold" :class="totalPenalties(props.row) > 0 ? 'text-primary' : 'text-positive'">
                        <span>Monto Neto Final a Transferir:</span>
                        <span>${{ formatCurrency(computedAdjustedNet(props.row)) }} MXN</span>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-7">
                  <q-card flat bordered :class="[$q.dark.isActive ? 'bg-modedark text-white' : 'bg-red-1', 'fill-height flex flex-center text-center q-pa-md']" v-if="props.row.artist.payout_method">
                    <q-card-section :class="[$q.dark.isActive ? 'bg-grey-9 text-grey-2' : 'bg-grey-3 text-grey-9', 'q-py-xs text-center']">
                      <div class="text-subtitle2 text-weight-bold">Datos Bancarios del Artista</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="row q-col-gutter-sm justify-center">
                      <div class="col-12 text-center q-mb-xs">
                        <div :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'" class="text-caption">Titular de la Cuenta</div>
                        <div class="text-body2 text-weight-medium text-uppercase">
                          {{ props.row.artist.payout_method.account_holder }}
                        </div>
                      </div>
                      <div class="col-12 text-center q-mb-xs">
                        <div :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'" class="text-caption">Banco</div>
                        <div class="text-body2 text-weight-medium text-uppercase">
                          {{ props.row.artist.payout_method.bank_name }}
                        </div>
                      </div>
                      <div class="col-12 text-center q-mb-xs">
                        <div :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'" class="text-caption">RFC</div>
                        <div class="text-body2 text-weight-medium text-uppercase">
                          {{ props.row.artist.payout_method.rfc || 'No Registrado' }}
                        </div>
                      </div>
                      <div class="col-12 text-center q-mt-md column items-center">
                        <div :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'" class="text-caption q-mb-xs">Cuenta CLABE (18 dígitos)</div>
                        <div :class="['row items-center q-pa-xs rounded-borders q-mx-auto', $q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2']" style="width: 100%; max-width: 320px;">
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
                      <div v-if="!props.row.can_release" class="col-12 q-mt-sm">
                        <q-banner rounded dense class="bg-amber-2 text-dark text-left">
                          <template v-slot:avatar>
                            <q-icon name="schedule" color="warning" size="sm" />
                          </template>
                          <div class="text-caption">
                            <strong>Liquidación en periodo de aclaración (3 días):</strong><br />
                            El evento concluyó el <b>{{ props.row.event_date }}</b>.<br />
                            Podrás liberar este pago a partir del <b>{{ formatDate(props.row.available_at) }}</b>.
                          </div>
                        </q-banner>
                      </div>
                    </q-card-section>
                    <q-card-actions align="right" class="q-pb-md q-pr-md column items-end">
                      <q-btn
                        label="Confirmar Transferencia Realizada"
                        color="positive"
                        icon="check_circle"
                        class="text-weight-bold"
                        :disable="props.row.event_status !== 'completed' || props.row.status === 'liquidated' || !props.row.can_release"
                        @click.stop="confirmRelease(props.row)"
                      >
                        <q-tooltip v-if="props.row.status === 'liquidated'">
                          Esta liquidación ya fue transferida y pagada al artista.
                        </q-tooltip>
                        <q-tooltip v-else-if="props.row.event_status !== 'completed'">
                          No puedes liquidar este pago hasta que el artista marque el evento como COMPLETADO.
                        </q-tooltip>
                        <q-tooltip v-else-if="!props.row.can_release">
                          Deben pasar 3 días desde el evento antes de poder liberar esta liquidación.
                        </q-tooltip>
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                  <q-card flat bordered :class="[$q.dark.isActive ? 'bg-red-10 text-white' : 'bg-red-1', 'fill-height flex flex-center text-center q-pa-md']" v-else>
                    <div>
                      <q-icon name="warning" color="negative" size="md" />
                      <div :class="$q.dark.isActive ? 'text-white' : 'text-red-9'" class="text-subtitle1 text-weight-bold q-mt-sm">Faltan Datos Bancarios</div>
                      <div :class="$q.dark.isActive ? 'text-grey-3' : 'text-grey-8'" class="text-caption">
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
    </div>

    <div v-else-if="activeTab === 'history'">
      <q-table
        v-if="filteredHistory && filteredHistory.length > 0"
        :rows="filteredHistory"
        :columns="historyColumns"
        row-key="sale_id"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="Aún no hay registros en el historial de liquidaciones"
        rows-per-page-label="Registros por página:"
        flat
        bordered
        class="payouts-table"
      >
        <template v-slot:body-cell-sale_id="props">
          <q-td :props="props" class="text-center">
            #{{ props.row.sale_id }}
          </q-td>
        </template>

        <template v-slot:body-cell-artist_name="props">
          <q-td :props="props" class="text-center text-weight-medium">
            {{ props.row.artist_name }}
          </q-td>
        </template>

        <template v-slot:body-cell-admin_name="props">
          <q-td :props="props" class="text-center">
            {{ props.row.admin_name }}
          </q-td>
        </template>

        <template v-slot:body-cell-created_at="props">
          <q-td :props="props" class="text-center">
            {{ formatDate(props.row.created_at) }}
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="text-center text-weight-bold text-positive">
            ${{ formatCurrency(props.row.amount) }} MXN
          </q-td>
        </template>
      </q-table>

      <div 
        v-else-if="loadingHistory" 
        class="text-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div 
        v-else-if="!loadingHistory" 
        class="text-center q-py-xl">
        <q-icon name="history" size="4em" color="grey-5" />
        <p class="text-grey-6 q-mt-md">Aún no hay registros en el historial de liquidaciones.</p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { notifySuccess, notifyError } from "src/utils/notify";

const columns = [
  { name: "expand", label: "Detalles", align: "center" },
  { name: "sale_id", label: "ID Venta", field: "sale_id", align: "center", sortable: true },
  { name: "artist_name", label: "Artista", field: (row) => row.artist.name, align: "center", sortable: true },
  { name: "event_date", label: "Fecha Evento", field: "event_date", align: "center" },
  { name: "net_artist_payout", label: "Pago Neto Artista", field: "adjusted_net_payout", align: "center", sortable: true },
  { name: "event_status", label: "Estado del Evento", field: "event_status", align: "center" },
  { name: "payout_status", label: "Estado de la Liquidación", field: "status", align: "center" },
];

const historyColumns = [
  { name: "sale_id", label: "ID Venta", field: "sale_id", align: "center", sortable: true },
  { name: "artist_name", label: "Artista", field: "artist_name", align: "center", sortable: true },
  { name: "admin_name", label: "Liquidado por", field: "admin_name", align: "center", sortable: true },
  { name: "created_at", label: "Fecha / Hora", field: "created_at", align: "center", sortable: true },
  { name: "amount", label: "Monto Liquidado", field: "amount", align: "center", sortable: true },
];

export default {
  name: "AdminPayoutsIndex",

  data() {
    return {
      activeTab: "pending",
      columns,
      historyColumns,
      loadingPending: false,
      searchFilter: "",
      applyFeeMap: {},
    };
  },

  computed: {
    ...mapGetters("payouts", {
      pendingPayouts: "statePendingPayouts",
    }),
    ...mapGetters("payoutLogs", {
      payoutLogs: "getPayoutLogs",
    }),
    ...mapState("payoutLogs", ["loadingHistory"]),

    filteredHistory() {
      if (!this.payoutLogs || this.payoutLogs.length === 0) {
        return this.payoutLogs;
      }

      if (!this.searchFilter) {
        return this.payoutLogs;
      }

      const filter = this.searchFilter.toLowerCase().trim();

      return this.payoutLogs.filter((row) => {
        const saleId = String(row.sale_id || "").toLowerCase();
        const artistName = String(row.artist_name || "").toLowerCase();
        const adminName = String(row.admin_name || "").toLowerCase();

        return saleId.includes(filter) || artistName.includes(filter) || adminName.includes(filter);
      });
    },
  },

  watch: {
    activeTab(tab) {
      if (tab === "history" && (!this.payoutLogs || this.payoutLogs.length === 0) && !this.loadingHistory) {
        this.loadHistory();
      }
    },
  },

  async created() {
    await this.loadPending();
  },

  methods: {
    ...mapActions("payouts", ["fetchPendingPayouts", "releasePayout"]),
    ...mapActions("payoutLogs", ["fetchPayoutHistory"]),

    async loadPending() {
      this.loadingPending = true;
      try {
        await this.fetchPendingPayouts();
        this.initFeeMap();
      } catch (error) {
        notifyError("No se pudieron cargar las liquidaciones de los artistas.");
      } finally {
        this.loadingPending = false;
      }
    },

    async loadHistory() {
      try {
        await this.fetchPayoutHistory();
      } catch (error) {
        notifyError("No se pudo cargar el historial de liquidaciones.");
      }
    },

    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          notifySuccess("CLABE copiada al portapapeles", { timeout: 1500 });
        })
        .catch(() => {
          notifyError("No se pudo copiar de forma automática.");
        });
    },

    confirmRelease(payout) {
      this.$q
        .dialog({
          title: "Confirmar Liquidación",
          message: `¿Estás seguro de marcar la venta #${payout.sale_id} del artista "${payout.artist.name}" como pagada? 
          Asegúrate de haber realizado primero la transferencia SPEI manual en tu banca por 
          $${this.formatCurrency(this.computedAdjustedNet(payout))} MXN.${this.totalPenalties(payout) > 0 ? `\n\nNota: 
          Se descontaron $${this.formatCurrency(this.totalPenalties(payout))} MXN en penalizaciones por cancelaciones previas.` : ""}`,
          cancel: { label: "Cancelar", color: "grey", flat: true },
          ok: { label: "Sí, Marcar Pagado", color: "positive" },
          persistent: true,
        })
        .onOk(async () => {
          try {
            this.$q.loading.show({ message: "Actualizando estatus financiero..." });
            const applyFee = this.applyFeeMap[payout.sale_id] !== false;
            await this.releasePayout({ saleId: payout.sale_id, applyOpenpayFee: applyFee });
            notifySuccess("Liquidación registrada exitosamente.");
          } catch (error) {
            notifyError("Error al actualizar el estatus en el servidor.");
          } finally {
            this.$q.loading.hide();
          }
        });
    },

    formatDate(raw) {
      if (!raw) {
        return "";
      }

      const normalized = String(raw).replace(" ", "T");
      const date = new Date(normalized);

      if (Number.isNaN(date.getTime())) {
        return String(raw);
      }

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const hours24 = date.getHours();
      const hours12 = hours24 % 12 || 12;
      const period = hours24 >= 12 ? "PM" : "AM";

      return `${day}/${month}/${year} ${String(hours12).padStart(2, "0")}:${minutes} ${period}`;
    },

    formatCurrency(value) {
      return Number(value || 0).toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    initFeeMap() {
      const map = {};
      (this.pendingPayouts || []).forEach((p) => {
        map[p.sale_id] = true;
      });
      this.applyFeeMap = map;
    },

    onFeeToggle(row) {
      this.$forceUpdate();
    },

    computedOpenpayFee(row) {
      return this.applyFeeMap[row.sale_id] !== false ? parseFloat(row.openpay_fee) : 0;
    },

    computedNetPayout(row) {
      return parseFloat(row.amount) - this.computedOpenpayFee(row) - parseFloat(row.platform_fee);
    },

    totalPenalties(row) {
      return parseFloat(row.total_penalties || 0);
    },

    computedAdjustedNet(row) {
      return Math.max(0, this.computedNetPayout(row) - this.totalPenalties(row));
    },
  },
};
</script>

<style scoped>
.text-mono {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
}
</style>
