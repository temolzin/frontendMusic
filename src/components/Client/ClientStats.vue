<template>
  <div class="client-stats q-pa-md q-mt-md q-mb-md">
    <div class="row items-end justify-between q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-8">
        <div class="text-overline text-grey-6">Panel del cliente</div>
        <div class="text-h4 text-weight-bold">Resumen de tu actividad</div>
        <div class="text-body2 text-grey-7 q-mt-sm">
          Total histórico en grande y un desglose discreto de tu estado actual.
        </div>
      </div>

      <div class="col-12 col-md-4 text-left text-md-right">
        <div class="text-caption text-grey-6">Periodo reportado</div>
        <div class="text-subtitle1 text-weight-medium">
          {{ overviewMeta.periodDays ? `${overviewMeta.periodDays} días` : 'Sin definir' }}
        </div>
        <div class="text-caption text-grey-6 q-mt-xs">
          Actualizado: {{ overviewMeta.generatedAt || 'Pendiente' }}
        </div>
      </div>
    </div>

    <q-banner v-if="errorMessage" class="bg-red-1 text-negative q-mb-md" rounded>
      <template #avatar>
        <q-icon name="error_outline" color="negative" />
      </template>
      {{ errorMessage }}
    </q-banner>

    <div v-if="loading" class="row q-col-gutter-md">
      <div v-for="placeholder in 3" :key="placeholder" class="col-12 col-md-4">
        <q-card class="client-stat-card q-pa-md">
          <q-skeleton type="text" width="42%" />
          <q-skeleton type="text" width="68%" height="48px" class="q-mt-md" />
          <q-skeleton type="text" width="56%" class="q-mt-sm" />
          <q-skeleton type="text" width="100%" class="q-mt-lg" />
          <q-skeleton type="text" width="94%" />
          <q-skeleton type="text" width="88%" />
        </q-card>
      </div>
    </div>

    <div v-else-if="cards.length" class="row q-col-gutter-md">
      <div v-for="card in cards" :key="card.key" class="col-12 col-md-4">
        <q-card class="client-stat-card full-height">
          <q-card-section class="row items-start no-wrap justify-between q-pb-sm">
            <div>
              <div class="text-h5 text-weight-bold q-mt-xs">{{ card.label }}</div>
            </div>

            <q-avatar :color="cardAccent(card.key).color" text-color="white" size="42px">
              <q-icon :name="cardAccent(card.key).icon" size="22px" />
            </q-avatar>
          </q-card-section>

          <q-card-section class="q-pt-none q-pb-sm">
            <div class="text-caption text-grey-6">Total histórico</div>
            <div class="text-h2 text-weight-bolder q-mt-xs total-value">
              {{ formatNumber(card.total) }}
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <div class="text-caption text-grey-6 q-mb-sm">Desglose sutil del estado actual</div>

            <div v-if="card.key === 'cart'" class="column q-gutter-sm">
              <div class="breakdown-row">
                <div class="row items-center justify-between q-mb-xs">
                  <div class="text-body2 text-grey-8">Artículos en carrito</div>
                  <div class="text-weight-medium">{{ formatNumber(card.breakdown.total_items) }}</div>
                </div>
                <q-linear-progress rounded size="6px" :value="cartProgress(card.breakdown.total_items)" color="primary" track-color="grey-3" />
              </div>
              <div class="breakdown-row">
                <div class="row items-center justify-between q-mb-xs">
                  <div class="text-body2 text-grey-8">Monto total</div>
                  <div class="text-weight-medium">${{ formatMoney(card.breakdown.total_amount) }}</div>
                </div>
                <q-linear-progress rounded size="6px" :value="cartMoneyProgress(card.breakdown.total_amount)" color="primary" track-color="grey-3" />
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                Estado: {{ formatStatus(card.breakdown.status) }}
              </div>
              <div v-if="Array.isArray(card.items) && card.items.length" class="q-mt-sm">
                <div class="text-caption text-grey-6 q-mb-xs">Items recientes</div>
                <div v-for="item in card.items.slice(0, 2)" :key="item.id" class="item-line">
                  <div class="row items-start justify-between no-wrap">
                    <div class="text-body2 text-grey-8 ellipsis">{{ item.artist_name }}</div>
                    <div class="text-weight-medium">${{ formatMoney(item.subtotal) }}</div>
                  </div>
                  <div class="text-caption text-grey-6">{{ formatNumber(item.hours) }} h x ${{ formatMoney(item.price) }}</div>
                </div>
              </div>
            </div>

            <div v-else-if="card.key === 'purchases'" class="column q-gutter-sm">
              <div class="breakdown-row">
                <div class="row items-center justify-between q-mb-xs">
                  <div class="text-body2 text-grey-8">Compras acumuladas</div>
                  <div class="text-weight-medium">{{ formatNumber(card.breakdown.total_purchases) }}</div>
                </div>
                <q-linear-progress rounded size="6px" :value="purchaseProgress(card.breakdown.total_purchases)" color="secondary" track-color="grey-3" />
              </div>
              <div class="breakdown-row">
                <div class="row items-center justify-between q-mb-xs">
                  <div class="text-body2 text-grey-8">Gasto total</div>
                  <div class="text-weight-medium">${{ formatMoney(card.breakdown.total_spent) }}</div>
                </div>
                <q-linear-progress rounded size="6px" :value="spendProgress(card.breakdown.total_spent)" color="secondary" track-color="grey-3" />
              </div>
              <div v-if="card.breakdown.last_purchase" class="text-caption text-grey-7 q-mt-xs">
                Última compra: {{ card.breakdown.last_purchase.artist_name }} · ${{ formatMoney(card.breakdown.last_purchase.amount) }} · {{ formatDateTime(card.breakdown.last_purchase.date) }}
              </div>
            </div>

            <div v-else-if="card.key === 'favourites'" class="column q-gutter-sm">
              <div class="breakdown-row">
                <div class="row items-center justify-between q-mb-xs">
                  <div class="text-body2 text-grey-8">Agregados últimos 30 días</div>
                  <div class="text-weight-medium">{{ formatNumber(card.breakdown.added_last_30_days) }}</div>
                </div>
                <q-linear-progress rounded size="6px" :value="favouriteProgress(card.breakdown.added_last_30_days)" color="accent" track-color="grey-3" />
              </div>
              <div v-if="Array.isArray(card.examples) && card.examples.length" class="q-mt-sm">
                <div class="text-caption text-grey-6 q-mb-xs">Agregados recientemente</div>
                <div v-for="example in card.examples.slice(0, 2)" :key="example.artist_id" class="item-line">
                  <div class="row items-start justify-between no-wrap">
                    <div class="text-body2 text-grey-8 ellipsis">{{ example.artist_name }}</div>
                    <div class="text-caption text-grey-6">{{ formatDateTime(example.added_at) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-caption text-grey-7">
              No hay detalles disponibles para esta tarjeta.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card v-else class="q-pa-lg text-center text-grey-7">
      <q-icon name="dashboard_customize" size="42px" class="q-mb-sm" />
      <div class="text-subtitle1 text-weight-medium">No hay métricas disponibles todavía.</div>
    </q-card>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const CARD_ORDER = ["cart", "purchases", "favourites"];

export default {
  name: "ClientStats",
  setup() {
    const loading = ref(true);
    const errorMessage = ref("");
    const overviewMeta = ref({
      periodDays: null,
      generatedAt: "",
    });
    const cards = ref([]);
    const accentMap = {
      cart: { color: "primary", icon: "shopping_cart" },
      purchases: { color: "secondary", icon: "receipt_long" },
      favourites: { color: "accent", icon: "favorite" },
    };

    const normalizeCards = (items) => {
      const byKey = new Map(items.map((card) => [card.key, card]));
      const ordered = CARD_ORDER.map((key) => byKey.get(key)).filter(Boolean);
      const extras = items.filter((card) => !CARD_ORDER.includes(card.key));
      return [...ordered, ...extras];
    };

    const cardAccent = (key) => accentMap[key] || { color: "grey-7", icon: "analytics" };

    const formatNumber = (value) => {
    const number = Number(value);
    return new Intl.NumberFormat("es-ES").format(Number.isFinite(number) ? number : 0);
};

const formatMoney = (value) => {
  const number = Number(value);
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(number) ? number : 0);
};

    const formatDateTime = (value) => {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return new Intl.DateTimeFormat("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    };

    const formatStatus = (value) => {
      if (!value) return "Sin estado";
      return String(value)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const cartProgress = (value) => Math.min(Number(value ?? 0) / 10, 1);
    const cartMoneyProgress = (value) => Math.min(Number(value ?? 0) / 5000, 1);
    const purchaseProgress = (value) => Math.min(Number(value ?? 0) / 20, 1);
    const spendProgress = (value) => Math.min(Number(value ?? 0) / 10000, 1);
    const favouriteProgress = (value) => Math.min(Number(value ?? 0) / 10, 1);

    const fetchOverview = async () => {
      loading.value = true;
      errorMessage.value = "";

      try {
        const response = await api.get("/api/client/dashboard-overview");
        const payload = response.data;

        if (!payload?.success || !payload?.data) {
          throw new Error("La respuesta del panel no tiene el formato esperado.");
        }

        overviewMeta.value = {
          periodDays: payload.data.period_days ?? null,
          generatedAt: formatDateTime(payload.data.generated_at),
        };

        cards.value = normalizeCards(payload.data.cards || []);
      } catch (error) {
        errorMessage.value =
          error?.response?.data?.message ||
          error?.message ||
          "No se pudo cargar el resumen del panel del cliente.";

        cards.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchOverview();
    });

    return {
      loading,
      errorMessage,
      overviewMeta,
      cards,
      cardAccent,
      formatNumber,
      formatMoney,
      formatDateTime,
      formatStatus,
      cartProgress,
      cartMoneyProgress,
      purchaseProgress,
      spendProgress,
      favouriteProgress,
    };
  },
};
</script>

<style lang="sass" scoped>
.client-stats
  background: radial-gradient(circle at top left, rgba(25, 118, 210, 0.08), transparent 42%), linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.98))
  border-radius: 18px

.client-stat-card
  border-radius: 18px
  min-height: 100%
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08)
  border: 1px solid rgba(148, 163, 184, 0.18)

.total-value
  letter-spacing: -0.04em
  line-height: 1

.breakdown-row + .breakdown-row
  padding-top: 4px

.item-line + .item-line
  margin-top: 8px
  padding-top: 8px
  border-top: 1px solid rgba(148, 163, 184, 0.22)
</style>
