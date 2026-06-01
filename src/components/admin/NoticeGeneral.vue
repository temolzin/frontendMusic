<template>
    <div class="q-ma-none">
      <q-carousel
        animated
        v-model="slide"
        navigation
        infinite
        :autoplay="autoplay"
        arrows
        transition-prev="slide-right"
        transition-next="slide-left"
      >
        <q-carousel-slide
          :name="1"
          img-src="https://cdn.pixabay.com/photo/2017/08/02/21/01/macbook-2573421_1280.jpg"
        >
          <div class="absolute-center custom-caption">
            <div class="text-h2">Usuarios</div>
            <div class="text-subtitle1">
                Para mantener los registros actualizados y garantizar una gestión eficiente
                de usuarios, te invitamos a administrar tu lista de usuarios o agregar nuevos.
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" to="/admin/users"/>
          </div>
        </q-carousel-slide>
  
        <q-carousel-slide
          :name="2"
          img-src="https://cdn.pixabay.com/photo/2018/07/12/21/32/subscribe-3534409_1280.jpg"
        >
          <div class="absolute-center custom-caption">
            <div class="text-h2">Roles</div>
            <div class="text-subtitle1">
                Para garantizar una mayor seguridad, es esencial mantener actualizados y
                gestionar de manera adecuada los roles en el sistema.
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" to="/admin/roles"/>
          </div>
        </q-carousel-slide>
  
        <q-carousel-slide
          :name="3"
          img-src="https://cdn.pixabay.com/photo/2014/05/21/15/18/musician-349790_960_720.jpg"
        >
          <div class="absolute-center custom-caption">
            <div class="text-h2">Géneros Musicales</div>
            <div class="text-subtitle1">
                ¡Agrega nuevos géneros musicales y amplía nuestra increíble lista!
            </div>
            <q-btn outline label="Ver más" class="q-mt-md" to="/admin/musical-genders/index"/>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div class="admin-overview q-pa-md q-mt-lg q-mb-md">
      <div class="row items-end justify-between q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-8">
          <div class="text-overline text-grey-6">Panel administrativo</div>
          <div class="text-h4 text-weight-bold">Resumen general del sistema</div>
          <div class="text-body2 text-grey-7 q-mt-sm">
            Revisa la información más relevante de lo que ha pasado últimamente
          </div>
        </div>

        <div class="col-12 col-md-4 text-left text-md-right">
          <div class="text-caption text-grey-6">Periodo reportado</div>
          <div class="text-subtitle1 text-weight-medium">
            {{ overviewMeta.periodDays ? `${overviewMeta.periodDays} días` : "Sin definir" }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Actualizado: {{ overviewMeta.generatedAt || "Pendiente" }}
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
        <div v-for="placeholder in 4" :key="placeholder" class="col-12 col-md-6">
          <q-card class="dashboard-stat-card q-pa-md">
            <q-skeleton type="text" width="40%" />
            <q-skeleton type="text" width="65%" height="48px" class="q-mt-md" />
            <q-skeleton type="text" width="55%" class="q-mt-sm" />
            <q-skeleton type="text" width="100%" class="q-mt-lg" />
            <q-skeleton type="text" width="95%" />
            <q-skeleton type="text" width="90%" />
          </q-card>
        </div>
      </div>

      <div v-else-if="cards.length" class="row q-col-gutter-md">
        <div v-for="card in cards" :key="card.key" class="col-12 col-md-6">
          <q-card class="dashboard-stat-card full-height">
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
              <div class="column q-gutter-sm">
                <div
                  v-for="item in card.breakdown || []"
                  :key="`${card.key}-${item.label}`"
                  class="breakdown-row"
                >
                  <div class="row items-center justify-between q-mb-xs">
                    <div class="text-body2 text-grey-8">{{ item.label }}</div>
                    <div class="text-weight-medium">{{ formatNumber(item.value) }}</div>
                  </div>
                  <q-linear-progress
                    rounded
                    size="6px"
                    :value="breakdownProgress(card.breakdown, item.value)"
                    :color="cardAccent(card.key).color"
                    track-color="grey-3"
                  />
                </div>
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

  const CARD_ORDER = ["users", "musical_genders", "artists", "quotations"];

  export default {
    setup() {
      const slide = ref(1);
      const autoplay = ref(true);
      const loading = ref(true);
      const errorMessage = ref("");
      const overviewMeta = ref({
        periodDays: null,
        generatedAt: "",
      });
      const cards = ref([]);
      const accentMap = {
        users: { color: "primary", icon: "groups" },
        musical_genders: { color: "secondary", icon: "music_note" },
        artists: { color: "accent", icon: "mic" },
        quotations: { color: "orange-8", icon: "request_quote" },
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

      const formatDateTime = (value) => {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return String(value);

        return new Intl.DateTimeFormat("es-ES", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date);
      };

      const breakdownProgress = (breakdown, value) => {
        if (!Array.isArray(breakdown) || !breakdown.length) return 0;

        const maxValue = Math.max(...breakdown.map((item) => Number(item.value ?? 0)));

        if (!maxValue) return 0;

        return Math.min(Number(value ?? 0) / maxValue, 1);
      };

      const fetchOverview = async () => {
        loading.value = true;
        errorMessage.value = "";

        try {
          const response = await api.get("/api/admin/dashboard-overview");
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
            "No se pudo cargar el resumen del panel administrativo.";

          overviewMeta.value = {
            periodDays: null,
            generatedAt: "",
          };

          cards.value = [];
        } finally {
          loading.value = false;
        }
      };

      onMounted(() => {
        fetchOverview();
      });

      return {
        slide,
        autoplay,
        loading,
        errorMessage,
        overviewMeta,
        cards,
        cardAccent,
        formatNumber,
        breakdownProgress,
      };
    },
  };
</script>

<style lang="sass" scoped>
  .custom-caption
    text-align: center
    padding: 12px
    color: white
    background-color: rgba(0, 0, 0, .3)
    border-radius:10px

  .admin-overview
    background: radial-gradient(circle at top left, rgba(25, 118, 210, 0.08), transparent 42%), linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.98))
    border-radius: 18px

  .dashboard-stat-card
    border-radius: 18px
    min-height: 100%
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08)
    border: 1px solid rgba(148, 163, 184, 0.18)

  .total-value
    letter-spacing: -0.04em
    line-height: 1

  .breakdown-row + .breakdown-row
    padding-top: 4px
</style>
