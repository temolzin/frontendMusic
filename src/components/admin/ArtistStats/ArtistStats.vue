<template>
  <div>
    <q-card v-if="!ownView" flat bordered class="q-mb-lg">
      <q-card-section class="q-pa-sm">
        <div style="max-width: 360px;">
          <q-select
            outlined
            dense
            v-model="selectedArtistId"
            :options="artistsList"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            :loading="loading"
            label="Selecciona un artista"
            transition-show="jump-down"
            transition-hide="jump-up"
            @update:model-value="fetchArtistData"
          >
            <template v-slot:prepend>
              <q-avatar size="24px">
                <q-img :src="selectedArtistImage" />
              </q-avatar>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-avatar size="28px">
                    <q-img :src="scope.opt.image || 'icons/logovibeer-16x16.png'" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-caption" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">
                  Sin artistas disponibles
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </q-card-section>
    </q-card>
    <div v-if="loading" class="row q-col-gutter-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-skeleton height="280px" square />
          <q-card-section>
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="text" width="60%" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-9">
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col" v-for="n in 5" :key="n">
            <q-card flat bordered style="height: 180px;">
              <q-card-section>
                <q-skeleton type="text" class="q-mb-sm" />
                <q-skeleton type="QAvatar" />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-skeleton height="300px" />
      </div>
    </div>
    <div v-if="!loading && artistData" class="row q-col-gutter-lg items-stretch">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="full-height">
          <q-img
            :src="artistData.profile.image || 'https://cdn.pixabay.com/photo/2018/06/17/10/38/artist-3480274_1280.jpg'"
            style="height: 280px;"
          >
            <template v-slot:loading>
              <div class="absolute-full flex flex-center">
                <q-spinner-dots color="primary" size="32px" />
              </div>
            </template>
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                <q-icon name="person" size="48px" />
              </div>
            </template>
          </q-img>
          <q-list class="q-pa-sm">
            <q-item>
              <q-item-section>
                <q-item-label class="text-h5 text-weight-bolder">
                  {{ artistData.profile.name }}
                </q-item-label>
                <q-item-label caption class="q-mt-xs flex items-center">
                  <q-icon name="place" size="16px" class="q-mr-xs" />
                  {{ artistData.profile.zone }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold">Miembro desde</q-item-label>
                <q-item-label caption>{{ artistData.profile.member_since }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="artistData.profile.members">
              <q-item-section>
                <q-item-label class="text-weight-bold">Miembros</q-item-label>
                <q-item-label caption class="flex items-center">
                  <q-icon name="groups" size="16px" class="q-mr-xs" />
                  {{ formatMembers(artistData.profile.members) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold q-mb-sm">Géneros</q-item-label>
                <div class="q-gutter-xs">
                  <q-chip
                    v-for="genre in artistData.profile.genres"
                    :key="genre"
                    outline
                    color="primary"
                    size="sm"
                    class="text-weight-bold"
                  >
                    {{ genre }}
                  </q-chip>
                  <span v-if="!artistData.profile.genres || artistData.profile.genres.length === 0" class="text-caption" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">
                    Sin géneros registrados
                  </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold q-mb-sm">Redes sociales</q-item-label>
                <div class="q-gutter-sm">
                  <q-btn v-if="artistData.profile.socials?.instagram" type="a" flat round dense icon="fab fa-instagram" :href="artistData.profile.socials.instagram" target="_blank" rel="noopener noreferrer">
                    <q-tooltip>Instagram</q-tooltip>
                  </q-btn>
                  <q-btn v-if="artistData.profile.socials?.spotify" type="a" flat round dense icon="fab fa-spotify" :href="artistData.profile.socials.spotify" target="_blank" rel="noopener noreferrer">
                    <q-tooltip>Spotify</q-tooltip>
                  </q-btn>
                  <q-btn v-if="artistData.profile.socials?.soundcloud" type="a" flat round dense icon="fab fa-soundcloud" :href="artistData.profile.socials.soundcloud" target="_blank" rel="noopener noreferrer">
                    <q-tooltip>SoundCloud</q-tooltip>
                  </q-btn>
                  <q-btn v-if="artistData.profile.socials?.youtube" type="a" flat round dense icon="fab fa-youtube" :href="artistData.profile.socials.youtube" target="_blank" rel="noopener noreferrer">
                    <q-tooltip>YouTube</q-tooltip>
                  </q-btn>
                  <q-btn v-if="artistData.profile.socials?.facebook" type="a" flat round dense icon="fab fa-facebook" :href="artistData.profile.socials.facebook" target="_blank" rel="noopener noreferrer">
                    <q-tooltip>Facebook</q-tooltip>
                  </q-btn>
                  <q-btn v-if="artistData.profile.socials?.tiktok" type="a" flat round dense icon="fab fa-tiktok" :href="artistData.profile.socials.tiktok" target="_blank" rel="noopener noreferrer">
                    <q-tooltip>TikTok</q-tooltip>
                  </q-btn>
                  <q-btn v-if="artistData.profile.socials?.x || artistData.profile.socials?.twitter" type="a" flat round dense icon="fab fa-x-twitter" :href="artistData.profile.socials?.x || artistData.profile.socials?.twitter" target="_blank" rel="noopener noreferrer">
                    <q-tooltip>X / Twitter</q-tooltip>
                  </q-btn>
                  <span v-if="!hasSocials(artistData.profile.socials)" class="text-caption" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">
                    Sin redes registradas
                  </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold q-mb-sm">Estado de la cuenta</q-item-label>
                <div>
                  <q-badge
                    rounded
                    :color="artistData.profile.is_active ? 'positive' : 'negative'"
                    class="q-pa-sm text-weight-bold"
                  >
                    <q-icon
                      :name="artistData.profile.is_active ? 'check_circle' : 'block'"
                      size="14px"
                      class="q-mr-xs"
                    />
                    {{ artistData.profile.status }}
                  </q-badge>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div class="col-12 col-md-9 column">
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-6 col-md-4 col-xl">
            <q-card flat bordered class="kpi-card column justify-between">
              <q-card-section class="col column">
                <div class="col">
                  <div class="row items-center no-wrap q-mb-sm">
                    <q-avatar rounded icon="star_border" color="primary" text-color="white" size="36px" class="q-mr-sm" />
                    <span class="text-body2 text-weight-medium">Rating promedio</span>
                  </div>
                  <div class="kpi-value text-weight-bolder">
                    {{ artistData.kpis.rating }}
                    <span class="text-subtitle1 text-weight-medium" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">/ 5</span>
                  </div>
                  <div class="q-mt-xs">
                    <q-rating
                      v-model="artistData.kpis.rating"
                      max="5"
                      size="16px"
                      color="warning"
                      icon="star_border"
                      icon-selected="star"
                      icon-half="star_half"
                      readonly
                    />
                  </div>
                </div>
                <div class="trend-container">
                  <div :class="trendClass(artistData.kpis.rating_trend)" class="text-caption text-weight-bold" style="line-height: 1.2;">
                    <q-icon :name="trendIcon(artistData.kpis.rating_trend)" />
                    {{ artistData.kpis.rating_trend }}
                    <span v-if="artistData.kpis.rating_trend !== 'Sin datos' && !artistData.kpis.rating_trend.includes('período')">vs. período anterior</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-xl">
            <q-card flat bordered class="kpi-card column justify-between">
              <q-card-section class="col column">
                <div class="col">
                  <div class="row items-center no-wrap q-mb-sm">
                    <q-avatar rounded icon="account_balance_wallet" color="blue-8" text-color="white" size="36px" class="q-mr-sm" />
                    <span class="text-body2 text-weight-medium">Ingresos totales</span>
                  </div>
                  <div class="kpi-value text-weight-bolder" :title="`$${artistData.kpis.total_income} MXN`">
                    ${{ artistData.kpis.total_income }}
                  </div>
                  <div class="text-caption" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">MXN</div>
                </div>
                <div class="trend-container">
                  <div :class="trendClass(artistData.kpis.income_trend)" class="text-caption text-weight-bold" style="line-height: 1.2;">
                    <q-icon :name="trendIcon(artistData.kpis.income_trend)" />
                    {{ artistData.kpis.income_trend }}
                    <span v-if="artistData.kpis.income_trend !== 'Sin datos' && !artistData.kpis.income_trend.includes('período')">vs. período anterior</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4 col-md-4 col-xl">
            <q-card flat bordered class="kpi-card column justify-between">
              <q-card-section class="col column">
                <div class="col">
                  <div class="row items-center no-wrap q-mb-sm">
                    <q-avatar rounded icon="event_available" color="orange-8" text-color="white" size="36px" class="q-mr-sm" />
                    <span class="text-body2 text-weight-medium">Eventos realizados</span>
                  </div>
                  <div class="kpi-value text-weight-bolder">{{ artistData.kpis.events_count }}</div>
                </div>
                <div class="trend-container">
                  <div :class="trendClass(artistData.kpis.events_trend)" class="text-caption text-weight-bold" style="line-height: 1.2;">
                    <q-icon :name="trendIcon(artistData.kpis.events_trend)" />
                    {{ artistData.kpis.events_trend }}
                    <span v-if="artistData.kpis.events_trend !== 'Sin datos' && !artistData.kpis.events_trend.includes('período')">vs. período anterior</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4 col-md-6 col-xl">
            <q-card flat bordered class="kpi-card column justify-between">
              <q-card-section class="col column">
                <div class="col">
                  <div class="row items-center no-wrap q-mb-sm">
                    <q-avatar rounded icon="groups" color="green-8" text-color="white" size="36px" class="q-mr-sm" />
                    <span class="text-body2 text-weight-medium">Contrataciones</span>
                  </div>
                  <div class="kpi-value text-weight-bolder">{{ artistData.kpis.hires_count }}</div>
                </div>
                <div class="trend-container">
                  <div :class="trendClass(artistData.kpis.hires_trend)" class="text-caption text-weight-bold" style="line-height: 1.2;">
                    <q-icon :name="trendIcon(artistData.kpis.hires_trend)" />
                    {{ artistData.kpis.hires_trend }}
                    <span v-if="artistData.kpis.hires_trend !== 'Sin datos' && !artistData.kpis.hires_trend.includes('período')">vs. período anterior</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4 col-md-6 col-xl">
            <q-card flat bordered class="kpi-card column justify-between">
              <q-card-section class="col column">
                <div class="col">
                  <div class="row items-center no-wrap q-mb-sm">
                    <q-avatar rounded icon="gavel" color="red-8" text-color="white" size="36px" class="q-mr-sm" />
                    <span class="text-body2 text-weight-medium">Sanciones</span>
                  </div>
                  <div class="kpi-value text-weight-bolder">{{ artistData.kpis.sanctions_count }}</div>
                </div>
                <div class="trend-container">
                  <div class="text-caption text-weight-bold" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'" style="line-height: 1.2;">
                    <q-icon name="info_outline" /> {{ artistData.kpis.sanctions_trend }} en el período
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-col-gutter-lg col items-stretch">
          <div class="col-12 col-lg-7">
            <q-card flat bordered class="column full-height">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6 text-weight-bolder">Ingresos</q-item-label>
                  <q-item-label caption>Evolución de ingresos en el período seleccionado</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-select
                    outlined
                    dense
                    v-model="chartFilter"
                    :options="['Por semana', 'Por mes']"
                    style="min-width: 120px;"
                    transition-show="jump-down"
                    transition-hide="jump-up"
                    @update:model-value="refreshChart"
                  />
                </q-item-section>
              </q-item>
              <q-card-section class="col column q-pt-none">
                <div class="col" style="position: relative; width: 100%; margin-top: 10px; min-height: 250px;">
                  <div class="column justify-between absolute-full" style="height: calc(100% - 25px); padding-left: 55px;">
                    <div v-for="(yVal, idx) in artistData.chart.yLabels" :key="idx" style="border-top: 1px dashed #e0e0e0; position: relative;">
                      <span class="absolute text-caption" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'" style="left: -55px; top: -10px;">{{ yVal }}</span>
                    </div>
                  </div>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position: absolute; top: 0; left: 55px; width: calc(100% - 65px); height: calc(100% - 25px); overflow: visible;">
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#673ab7" stop-opacity="0.4" />
                        <stop offset="100%" stop-color="#673ab7" stop-opacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path :d="artistData.chart.svgPathArea" fill="url(#purpleGrad)" />
                    <path
                      :d="artistData.chart.svgPathLine"
                      fill="none"
                      stroke="#673ab7"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      vector-effect="non-scaling-stroke"
                    />
                  </svg>
                  <div
                    v-for="(pt, idx) in artistData.chart.points"
                    :key="'pt-' + idx"
                    :style="{
                      position: 'absolute',
                      left: `calc(55px + (100% - 65px) * ${pt.xPercent} / 100)`,
                      top: `calc((100% - 25px) * ${pt.yPercent} / 100)`,
                      transform: 'translate(-50%, -50%)',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      border: '2.5px solid #673ab7',
                      cursor: 'pointer',
                      zIndex: 2
                    }"
                  >
                    <q-tooltip>{{ pt.label }}: ${{ pt.val?.toLocaleString() }} MXN</q-tooltip>
                  </div>
                  <div
                    v-for="(pt, idx) in artistData.chart.points"
                    :key="'lbl-' + idx"
                    class="text-caption text-grey-7"
                    :style="{
                      position: 'absolute',
                      bottom: '0px',
                      left: `calc(55px + (100% - 65px) * ${pt.xPercent} / 100)`,
                      transform: idx === 0 ? 'translateX(0%)' : (idx === artistData.chart.points.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)'),
                      whiteSpace: 'nowrap',
                      fontSize: '11px'
                    }"
                  >
                    {{ pt.label }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-lg-5">
            <q-card flat bordered class="full-height">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bolder">Calendario de próximos eventos</q-item-label>
                </q-item-section>
              </q-item>
              <q-list separator>
                <q-item v-for="(event, idx) in artistData.upcoming_events" :key="idx" class="q-py-md">
                  <q-item-section avatar class="items-center" style="min-width: 56px;">
                    <q-item-label caption class="text-primary text-weight-bolder">{{ event.month }}</q-item-label>
                    <q-item-label class="text-h5 text-weight-bolder">{{ event.day }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ event.title }}</q-item-label>
                    <q-item-label caption>{{ event.location }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      outline
                      :color="eventBadgeColor(event.status)"
                      class="text-weight-bold q-pa-sm"
                      style="font-size: 12px; border-width: 1px;"
                    >
                      {{ event.status }}
                    </q-badge>
                  </q-item-section>
                </q-item>
                <q-item v-if="!artistData.upcoming_events || artistData.upcoming_events.length === 0">
                  <q-item-section class="text-center q-py-md" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'">
                    No hay próximos eventos pendientes
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { notifyError } from "src/utils/notify";

export default {
  name: "ArtistStats",

  setup() {
    const $q = useQuasar();
    return { $q };
  },

  data() {
    return {
      selectedArtistId: null,
      chartFilter: "Por mes",
      loading: false,
    };
  },

  props: {
    ownView: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters("statsArtist", {
      artistsList:   "getArtistsList",
      rawArtistData: "getArtistData",
    }),

    artistData() {
      const data = this.rawArtistData;
      if (!data) return null;

      return {
        profile: {
          name: data.profile?.name || "",
          image: data.profile?.avatar || data.profile?.image || "",
          zone: data.profile?.location || data.profile?.zone || "No especificada",
          member_since: data.profile?.member_since || "",
          members: data.profile?.members || null,
          is_active: data.profile?.is_active ?? true,
          status: (data.profile?.is_active ?? true) ? "Activo" : "Restringido",
          genres: data.profile?.genders || data.profile?.genres       || [],
          socials: (() => {
            const raw = data.profile?.socials || data.profile?.social_media;
            if (!raw) return {};
            if (Array.isArray(raw)) {
              const map = {};
              const keyMap = {
                'Instagram':   'instagram',
                'X (Twitter)': 'x',
                'YouTube':     'youtube',
                'Facebook':    'facebook',
                'TikTok':      'tiktok',
                'Spotify':     'spotify',
                'Apple Music': 'apple_music',
                'SoundCloud':  'soundcloud',
                'Bandcamp':    'bandcamp',
                'LinkedIn':    'linkedin',
              };
              raw.forEach((item) => {
                const key = keyMap[item.name] || item.name?.toLowerCase().replace(/\s+/g, '_');
                if (key && item.url) map[key] = item.url;
              });
              return map;
            }
            return raw;
          })(),
        },
        kpis: {
          rating: data.kpis?.rating || 0,
          rating_trend: data.kpis?.rating_trend || "Sin datos",
          total_income: data.kpis?.income || "0",
          income_trend: data.kpis?.income_trend || "Sin datos",
          events_count: data.kpis?.events || 0,
          events_trend: data.kpis?.events_trend || "Sin datos",
          hires_count: data.kpis?.contracts || 0,
          hires_trend: data.kpis?.hires_trend || "Sin datos",
          sanctions_count: data.kpis?.sanctions ?? 0,
          sanctions_trend: data.kpis?.sanctions_trend || "0 nuevas",
        },
        chart: this.generateSvgChart(data.chart?.labels || [], data.chart?.series || []),
        upcoming_events: this.mapUpcomingEvents(data.upcoming_events || []),
      };
    },

    selectedArtistImage() {
      const found = this.artistsList.find((a) => a.id === this.selectedArtistId);
      return found?.image || "icons/logovibeer-16x16.png";
    },
  },

  methods: {
    ...mapActions("statsArtist", ["fetchArtistsList", "fetchArtistAnalytics", "fetchMyArtistAnalytics"]),

    async fetchArtists() {
      this.loading = true;
      try {
        await this.fetchArtistsList();
      } catch {
        notifyError("Error al cargar la lista de artistas.");
      } finally {
        this.loading = false;
      }
    },

    async fetchArtistData() {
      if (!this.selectedArtistId) return;
      this.loading = true;
      try {
        await this.fetchArtistAnalytics({
          artistId: this.selectedArtistId,
          filter: this.chartFilter,
        });
      } catch {
        notifyError("Error al cargar las estadísticas del artista.");
      } finally {
        this.loading = false;
      }
    },

    async fetchMyArtistData() {
      this.loading = true;
      try {
        await this.fetchMyArtistAnalytics({ filter: this.chartFilter });
      } catch {
        notifyError("Error al cargar tus estadísticas.");
      } finally {
        this.loading = false;
      }
    },

    refreshChart() {
      this.ownView ? this.fetchMyArtistData() : this.fetchArtistData();
    },

    generateSvgChart(labels, series) {
      if (!series || series.length === 0) {
        return { labels: [], yLabels: ["$0", "$0", "$0", "$0", "$0"], svgPathArea: "", svgPathLine: "", points: [] };
      }
      const maxVal = Math.max(...series, 1000);
      const yLabels = [
        `$${Math.round(maxVal).toLocaleString()}`,
        `$${Math.round(maxVal * 0.75).toLocaleString()}`,
        `$${Math.round(maxVal * 0.5).toLocaleString()}`,
        `$${Math.round(maxVal * 0.25).toLocaleString()}`,
        "$0",
      ];
      const points = series.map((val, idx) => {
        const xPercent = series.length > 1 ? (idx / (series.length - 1)) * 100 : 50;
        const yPercent = 100 - ((val / maxVal) * 100);
        return { xPercent, yPercent, val, label: labels[idx] || "" };
      });
      const pathLine = `M ${points.map((p) => `${p.xPercent},${p.yPercent}`).join(" L ")}`;
      const pathArea = `${pathLine} L 100,100 L 0,100 Z`;
      return { labels, yLabels, svgPathArea: pathArea, svgPathLine: pathLine, points };
    },

    mapUpcomingEvents(events) {
      return events.map((ev) => {
        const parts = (ev.date || "").trim().split(" ");
        return {
          month: (parts[1] || "MES").toUpperCase(),
          day: parts[0] || "--",
          title: ev.title    || "Evento",
          location: ev.location || "Por definir",
          status: this.statusLabel(ev.status),
        };
      });
    },

    statusLabel(status) {
      if (status === "completed") return "Completado";
      if (status === "rejected")  return "Rechazado";
      if (status === "expired")   return "Expirado";
      if (status === "cancelled") return "Cancelado";
      return "Pendiente";
    },

    eventBadgeColor(status) {
      if (status === "Completado") return "positive";
      if (status === "Pendiente")  return "warning";
      if (["Cancelado", "Expirado", "Rechazado"].includes(status)) return "negative";
      return "primary";
    },

    hasSocials(socials) {
      return socials && Object.values(socials).some(Boolean);
    },

    formatMembers(members) {
      if (Array.isArray(members)) return members.join(", ");
      return `${members} ${members == 1 ? "integrante" : "integrantes"}`;
    },

    trendClass(trend) {
      if (!trend || trend === "Sin datos") return this.$q.dark.isActive ? 'text-grey-5' : 'text-grey-8';
      if (trend.startsWith("+")) return "text-positive";
      if (trend.startsWith("-")) return "text-negative";
      return this.$q.dark.isActive ? 'text-grey-5' : 'text-grey-8';
    },

    trendIcon(trend) {
      if (!trend || trend === "Sin datos") return "remove";
      if (trend.startsWith("+")) return "arrow_upward";
      if (trend.startsWith("-")) return "arrow_downward";
      return "remove";
    },
  },

  created() {
    this.ownView ? this.fetchMyArtistData() : this.fetchArtists();
  },
};
</script>

<style scoped>
.kpi-card {
  min-height: 175px;
  height: 100%;
}
.kpi-value {
  font-size: clamp(1.25rem, 1.8vw, 1.8rem);
  line-height: 1.15;
  word-break: break-word;
}
.trend-container {
  min-height: 36px;
  display: flex;
  align-items: flex-start;
}
</style>
