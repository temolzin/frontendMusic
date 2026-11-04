<template>
  <div>
    <q-card flat bordered class="q-mb-lg">
      <q-card-section class="q-pa-md">
        <div class="row items-center q-col-gutter-md">
          <div class="col-auto">
            <q-btn-toggle
              v-model="period"
              :options="periodOptions"
              toggle-color="primary"
              unelevated
              @update:model-value="onPeriodChange"
            />
          </div>
          <div class="col q-ml-auto text-right" v-if="reportData">
            <q-btn outline color="primary" icon="file_download" label="PDF" class="q-mr-sm" @click="exportPdf" />
            <q-btn outline color="primary" icon="table_view" label="CSV" @click="exportCsv" />
          </div>
        </div>
        <div class="row items-center q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-2">
            <q-select
              outlined
              dense
              v-model="selectedYear"
              :options="yearOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Año"
              :disable="period !== 'year'"
              @update:model-value="onYearChange"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined dense readonly :value="monthInputLabel" label="Mes" :disable="period !== 'month'" @click="openMonthDialog">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" @click="openMonthDialog" />
              </template>
            </q-input>
            <q-dialog v-model="monthDialog">
              <q-card style="min-width: 320px">
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Seleccionar mes</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-select outlined dense v-model="tempMonthYear" :options="monthYearOptions" label="Año" />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-select
                        outlined
                        dense
                        v-model="tempMonthNumber"
                        :options="monthSelections"
                        option-value="value"
                        option-label="label"
                        emit-value
                        map-options
                        label="Mes"
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" v-close-popup />
                  <q-btn unelevated color="primary" label="Aplicar" @click="applyMonthSelection" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined dense readonly v-model="fromDate" label="Desde (día)" :disable="period !== 'week'">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale" @show="snapshotFromDate">
                    <q-card class="q-pa-sm">
                      <q-date v-model="fromDate" mask="YYYY-MM-DD" @update:model-value="onManualDateChange" />
                      <div class="row justify-end q-col-gutter-sm q-mt-sm">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup @click="onFromCancel" />
                        <q-btn flat label="Cerrar" color="primary" v-close-popup />
                      </div>
                    </q-card>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined dense readonly v-model="toDate" label="Hasta (día)" :disable="period !== 'week'">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale" @show="snapshotToDate">
                    <q-card class="q-pa-sm">
                      <q-date v-model="toDate" mask="YYYY-MM-DD" @update:model-value="onManualDateChange" />
                      <div class="row justify-end q-col-gutter-sm q-mt-sm">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup @click="onToCancel" />
                        <q-btn flat label="Cerrar" color="primary" v-close-popup />
                      </div>
                    </q-card>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn outline color="primary" icon="restart_alt" label="Limpiar rango" @click="clearRange" />
          </div>
        </div>
        <div class="q-mt-sm q-ml-xs text-caption" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'">
          {{ rangeLabel }}
        </div>
      </q-card-section>
    </q-card>
    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md" v-for="n in 5" :key="n">
        <q-card flat bordered class="kpi-card">
          <q-card-section>
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="QAvatar" />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div ref="reportBody">
    <div v-if="!loading && reportData" class="row q-col-gutter-md items-stretch">
      <div class="col-12 col-sm-6 col-md">
        <q-card flat bordered class="kpi-card">
          <q-card-section class="column justify-between full-height">
            <div>
              <div class="row items-center no-wrap q-mb-sm">
                <q-avatar rounded icon="account_balance_wallet" color="blue-8" text-color="white" size="36px" class="q-mr-sm" />
                <span class="text-body2 text-weight-medium">Ventas netas</span>
              </div>
              <div class="kpi-value text-weight-bolder">{{ formatCurrency(kpis.net_sales) }}</div>
            </div>
            <div class="trend-container">
              <div :class="getTrendClass(kpis.net_sales_trend)" class="text-caption text-weight-bold">
                <q-icon :name="getTrendIcon(kpis.net_sales_trend)" /> {{ kpis.net_sales_trend }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md">
        <q-card flat bordered class="kpi-card">
          <q-card-section class="column justify-between full-height">
            <div>
              <div class="row items-center no-wrap q-mb-sm">
                <q-avatar rounded icon="trending_up" color="green-8" text-color="white" size="36px" class="q-mr-sm" />
                <span class="text-body2 text-weight-medium">Ganancias de la plataforma</span>
              </div>
              <div class="kpi-value text-weight-bolder">{{ formatCurrency(kpis.platform_earnings) }}</div>
            </div>
            <div class="trend-container">
              <div :class="getTrendClass(kpis.platform_earnings_trend)" class="text-caption text-weight-bold">
                <q-icon :name="getTrendIcon(kpis.platform_earnings_trend)" /> {{ kpis.platform_earnings_trend }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md">
        <q-card flat bordered class="kpi-card">
          <q-card-section class="column justify-between full-height">
            <div>
              <div class="row items-center no-wrap q-mb-sm">
                <q-avatar rounded icon="event_available" color="orange-8" text-color="white" size="36px" class="q-mr-sm" />
                <span class="text-body2 text-weight-medium">Eventos realizados</span>
              </div>
              <div class="kpi-value text-weight-bolder">{{ kpis.events }}</div>
            </div>
            <div class="trend-container">
              <div :class="getTrendClass(kpis.events_trend)" class="text-caption text-weight-bold">
                <q-icon :name="getTrendIcon(kpis.events_trend)" /> {{ kpis.events_trend }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md">
        <q-card flat bordered class="kpi-card">
          <q-card-section class="column justify-between full-height">
            <div>
              <div class="row items-center no-wrap q-mb-sm">
                <q-avatar rounded icon="groups" color="purple-8" text-color="white" size="36px" class="q-mr-sm" />
                <span class="text-body2 text-weight-medium">Contrataciones</span>
              </div>
              <div class="kpi-value text-weight-bolder">{{ kpis.contracts }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md">
        <q-card flat bordered class="kpi-card">
          <q-card-section class="column justify-between full-height">
            <div>
              <div class="row items-center no-wrap q-mb-sm">
                <q-avatar rounded icon="point_of_sale" color="teal-8" text-color="white" size="36px" class="q-mr-sm" />
                <span class="text-body2 text-weight-medium">Ticket promedio</span>
              </div>
              <div class="kpi-value text-weight-bolder">{{ formatCurrency(kpis.avg_ticket) }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="!loading && reportData" class="row q-col-gutter-md q-mt-md items-stretch">
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="full-height">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bolder">Evolución de ganancias</q-item-label>
              <q-item-label caption>Ventas netas vs. ganancias de la plataforma por período</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <apexchart type="area" height="300" :options="lineChartOptions" :series="lineChartSeries" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-lg-5">
        <q-card flat bordered class="full-height">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6 text-weight-bolder">Top artistas</q-item-label>
              <q-item-label caption>Los 5 mejores por ventas netas</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section>
            <apexchart type="bar" height="300" :options="barChartOptions" :series="barChartSeries" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-if="!loading && reportData" class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-lg-7">
      <q-card flat bordered>
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bolder">Desglose por período</q-item-label>
            <q-item-label caption>Detalle de ventas netas por período</q-item-label>
          </q-item-section>
        </q-item>
          <q-card-section class="q-pa-none">
            <q-table
              :rows="breakdownTableRows"
              :columns="breakdownColumns"
              row-key="label"
              flat
              hide-pagination
              :pagination="{ rowsPerPage: 0 }"
              class="no-shadow"
            >
              <template v-slot:body-cell-net_sales="props">
                <q-td :props="props"> {{ formatCurrency(props.row.net_sales) }} </q-td>
              </template>
              <template v-slot:body-cell-platform_earnings="props">
                <q-td :props="props"> {{ formatCurrency(props.row.platform_earnings) }} </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
<div class="col-12 col-lg-5">
  <q-card flat bordered>
    <q-item>
      <q-item-section>
        <q-item-label class="text-h6 text-weight-bolder">Distribución por género</q-item-label>
        <q-item-label caption>Ventas netas agrupadas por género musical</q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section>
      <apexchart type="donut" height="300" :options="donutChartOptions" :series="donutChartSeries" />
    </q-card-section>
</q-card>
</div>
      </div>
      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-lg-5">
          <q-card flat bordered>
            <q-item>
              <q-item-section>
                <q-item-label class="text-h6 text-weight-bolder">Distribución por tipo de evento</q-item-label>
                <q-item-label caption>Ventas netas agrupadas por tipo de evento</q-item-label>
              </q-item-section>
            </q-item>
            <q-card-section>
              <apexchart type="donut" height="300" :options="eventTypeDonutChartOptions" :series="eventTypeDonutChartSeries" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { mapGetters, mapActions } from "vuex";
import VueApexCharts from "vue3-apexcharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { createPdfHero, createPdfWrapper, drawPdfFooter } from "src/utils/pdfReport";
import { notifyError } from "src/utils/notify";
import { formatCurrency } from "src/utils/moneyFormat";

const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default {
  name: "ReportsDashboard",

  components: {
    apexchart: VueApexCharts,
  },

  setup() {
    const $q = useQuasar();
    return { $q };
  },

  data() {
    return {
      period: "month",
      selectedYear: 0,
      selectedMonthDate: null,
      monthDialog: false,
      tempMonthYear: new Date().getFullYear(),
      tempMonthNumber: new Date().getMonth() + 1,
      fromDate: null,
      toDate: null,
      fromDateBackup: null,
      toDateBackup: null,
      loading: false,
      periodOptions: [
        { label: "Semana", value: "week" },
        { label: "Mes", value: "month" },
        { label: "Año", value: "year" },
      ],
    };
  },

  computed: {
    ...mapGetters("adminReports", {
      reportData: "getReportData",
    }),

    rangeParams() {
      return this.fromDate && this.toDate ? { from: this.fromDate, to: this.toDate } : {};
    },

    rangeLabel() {
      const defaultLabels = {
        week: "Mostrando últimos 6 semanas",
        year: "Mostrando últimos 5 años",
        month: "Mostrando últimos 6 meses",
      };
      return this.fromDate && this.toDate
        ? `Mostrando del ${this.formatDateLabel(this.fromDate)} al ${this.formatDateLabel(this.toDate)}`
        : defaultLabels[this.period];
    },

    yearOptions() {
      const year = new Date().getFullYear();
      return [
        { label: "Todos los años", value: 0 },
        ...Array.from({ length: 8 }, (_, i) => ({ label: String(year - i), value: year - i })),
      ];
    },

    monthInputLabel() {
      const [year, month] = String(this.selectedMonthDate || "").split("-");
      return year && month ? `${MONTH_NAMES[Number(month) - 1]} ${year}` : "Todos los meses";
    },

    monthYearOptions() {
      const year = new Date().getFullYear();
      return Array.from({ length: 11 }, (_, i) => year - i);
    },

    monthSelections() {
      return MONTH_NAMES.map((name, i) => ({ label: name, value: i + 1 }));
    },

    generatedLabel() {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      return `Generado el ${dd}/${mm}/${now.getFullYear()}`;
    },

    kpis() {
      return this.reportData?.kpis || {};
    },

    chartData() {
      return this.reportData?.chart || { labels: [], series: { net_sales: [], platform_earnings: [] } };
    },

    lineChartSeries() {
      return [
        { name: "Ventas netas", data: this.chartData.series.net_sales },
        { name: "Ganancias plataforma", data: this.chartData.series.platform_earnings },
      ];
    },

    lineChartOptions() {
      return {
        chart: {
          toolbar: { show: false },
          fontFamily: "inherit",
        },
        colors: ["#673ab7", "#1976d2"],
        stroke: { curve: "smooth", width: 2.5 },
        fill: {
          type: "gradient",
          gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 },
        },
        dataLabels: { enabled: false },
        xaxis: { categories: this.chartData.labels },
        yaxis: { labels: { formatter: (value) => this.formatCompact(value) } },
        tooltip: { y: { formatter: (value) => formatCurrency(value) } },
        legend: { position: "top" },
        grid: { borderColor: "#e0e0e0" },
      };
    },

    barChartSeries() {
      return [{ name: "Ventas netas", data: this.reportData?.top_artists.map((a) => a.net_sales) || [] }];
    },

    barChartOptions() {
      return {
        chart: { toolbar: { show: false }, fontFamily: "inherit" },
        colors: ["#673ab7"],
        plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
        dataLabels: { enabled: false },
        xaxis: { categories: this.reportData?.top_artists.map((a) => a.name) || [] },
        yaxis: { labels: { formatter: (value) => this.formatCompact(value) } },
        tooltip: { y: { formatter: (value) => formatCurrency(value) } },
        legend: { show: false },
        grid: { borderColor: "#e0e0e0" },
      };
    },

    donutChartSeries() {
      return this.reportData?.genres.map((g) => g.net_sales) || [];
    },

    eventTypeDonutChartSeries() {
      return (this.reportData?.event_types || []).map((g) => g.net_sales);
    },

    donutChartOptions() {
      return {
        chart: { fontFamily: "inherit" },
        labels: this.reportData?.genres.map((g) => g.name) || [],
        legend: { position: "bottom" },
        tooltip: { y: { formatter: (value) => formatCurrency(value) } },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  formatter: (w) => this.formatCompact(w.globals.seriesTotals.reduce((a, b) => a + b, 0)),
                },
              },
            },
          },
        },
      };
    },

    eventTypeDonutChartOptions() {
      return {
        chart: { fontFamily: "inherit" },
        labels: (this.reportData?.event_types || []).map((g) => g.name),
        legend: { position: "bottom" },
        tooltip: { y: { formatter: (value) => formatCurrency(value) } },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  formatter: (w) => this.formatCompact(w.globals.seriesTotals.reduce((a, b) => a + b, 0)),
                },
              },
            },
          },
        },
      };
    },

    breakdownColumns() {
      return [
        { name: "label", label: "Período", field: "label", align: "left" },
        { name: "net_sales", label: "Ventas netas", field: "net_sales", align: "right", sortable: true },
        { name: "platform_earnings", label: "Ganancias plataforma", field: "platform_earnings", align: "right", sortable: true },
        { name: "events", label: "Eventos", field: "events", align: "center", sortable: true },
      ];
    },

    breakdownTableRows() {
      return this.reportData?.breakdown || [];
    },
  },

  methods: {
    formatCurrency,
    ...mapActions("adminReports", ["fetchReportsEarnings"]),

    formatDateLabel(value) {
      const [year, month, day] = String(value || "").split("-");
      return year && month && day ? `${day}/${month}/${year}` : value || "";
    },

    formatCompact(value) {
      const num = Number(value || 0);
      return Math.abs(num) >= 1000 ? `$${(num / 1000).toFixed(1)}k` : `$${String(Math.round(num))}`;
    },

    getTrendClass(trend) {
      const neutral = !trend || trend === "Sin datos" || trend.startsWith("+$");
      return neutral
        ? this.$q.dark.isActive
          ? "text-grey-5"
          : "text-grey-8"
        : trend.startsWith("+")
          ? "text-positive"
          : "text-negative";
    },

    getTrendIcon(trend) {
      const neutral = !trend || trend === "Sin datos" || trend.startsWith("+$");
      return neutral ? "remove" : trend.startsWith("+") ? "arrow_upward" : "arrow_downward";
    },

    buildRangeParams() {
      return this.fromDate && this.toDate ? { from: this.fromDate, to: this.toDate } : {};
    },

    onPeriodChange() {
      this.clearRange(false);
      this.loadReport();
    },

    onYearChange(value) {
      const hasYear = value > 0;
      hasYear || this.clearRange(false);
      this.selectedMonthDate = hasYear ? null : this.selectedMonthDate;
      this.fromDate = hasYear ? `${value}-01-01` : this.fromDate;
      this.toDate = hasYear ? `${value}-12-31` : this.toDate;
      hasYear && this.loadReport();
    },

    openMonthDialog() {
      const selected = this.selectedMonthDate ? String(this.selectedMonthDate).split("-") : null;
      this.tempMonthYear = selected ? Number(selected[0]) : new Date().getFullYear();
      this.tempMonthNumber = selected ? Number(selected[1]) : new Date().getMonth() + 1;
      this.monthDialog = true;
    },

    applyMonthSelection() {
      const year = this.tempMonthYear;
      const month = String(this.tempMonthNumber).padStart(2, "0");
      const lastDay = new Date(year, this.tempMonthNumber, 0).getDate();
      this.selectedMonthDate = `${year}-${month}-01`;
      this.selectedYear = 0;
      this.fromDate = `${year}-${month}-01`;
      this.toDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
      this.monthDialog = false;
      this.loadReport();
    },

    onManualDateChange() {
      this.selectedYear = 0;
      this.selectedMonthDate = null;
      this.loadReport();
    },

    snapshotFromDate() {
      this.fromDateBackup = this.fromDate;
    },

    snapshotToDate() {
      this.toDateBackup = this.toDate;
    },

    onFromCancel() {
      this.fromDate = this.fromDateBackup;
      this.loadReport();
    },

    onToCancel() {
      this.toDate = this.toDateBackup;
      this.loadReport();
    },

    clearRange(shouldReload = true) {
      this.selectedYear = 0;
      this.selectedMonthDate = null;
      this.fromDate = null;
      this.toDate = null;
      shouldReload && this.loadReport();
    },

    async loadReport() {
      this.loading = true;
      try {
        const params = { period: this.period, ...this.buildRangeParams() };
        await this.fetchReportsEarnings(params);
      } catch {
        notifyError("Error al cargar los reportes.");
      } finally {
        this.loading = false;
      }
    },

    exportName(ext) {
      const range = this.fromDate && this.toDate
        ? `${this.fromDate}-${this.toDate}`
        : `ultimos-6-${this.period === "week" ? "semanas" : this.period === "year" ? "años" : "meses"}`;
      return `reporte-general-${this.period}-${range}.${ext}`;
    },

    async exportCsv() {
      if (!this.reportData) return;
      const rows = [
        ["Período", "Ventas netas", "Ganancias plataforma", "Eventos"],
        ...this.breakdownTableRows.map((r) => [r.label, r.net_sales, r.platform_earnings, r.events]),
      ];
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = this.exportName("csv");
      link.click();
      URL.revokeObjectURL(link.href);
    },

    async exportPdf() {
      const body = this.$refs.reportBody;
      if (!body) return;
      try {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const wrapper = createPdfWrapper();
        const blocks = this.buildPdfBlocks(body);

        const measured = [];
        for (const block of blocks) {
          wrapper.appendChild(block);
          const canvas = await html2canvas(block, {
            useCORS: true,
            backgroundColor: "#ffffff",
            width: 794,
            windowWidth: 794,
            logging: false,
          });
          const imgData = canvas.toDataURL("image/png");
          const scale = pageWidth / canvas.width;
          measured.push({ imgData, height: canvas.height * scale });
          block.remove();
        }

        const maxHeight = pageHeight - 12;
        const pages = [];
        let current = { blocks: [], used: 0 };
        for (const m of measured) {
          if (current.blocks.length && current.used + m.height > maxHeight) {
            pages.push(current);
            current = { blocks: [], used: 0 };
          }
          current.blocks.push(m);
          current.used += m.height;
        }
        pages.push(current);

        pages.forEach((pg, index) => {
          index > 0 && pdf.addPage();
          const firstPage = index === 0;
          const contentWidth = firstPage ? pageWidth : pageWidth * 0.85;
          const x = (pageWidth - contentWidth) / 2;
          let y = firstPage ? 0 : 22;
          pg.blocks.forEach((m) => {
            const h = m.height * (contentWidth / pageWidth);
            pdf.addImage(m.imgData, "PNG", x, y, contentWidth, h);
            y += h + (firstPage ? 0 : 8);
          });
        });
        for (let i = 0; i < pdf.getNumberOfPages(); i++) {
          pdf.setPage(i + 1);
          drawPdfFooter(pdf, {
            pageWidth,
            pageHeight,
            pageNumber: i + 1,
            totalPages: pdf.getNumberOfPages(),
          });
        }
        wrapper.remove();
        pdf.save(this.exportName("pdf"));
      } catch {
        notifyError("Error al generar el PDF.");
      }
    },

    buildPdfBlocks(body) {
      const rows = Array.from(body.children);
      const blocks = [
        createPdfHero({
          title: "Reporte de ganancias de la plataforma",
          subtitle: this.generatedLabel,
        }),
      ];
      rows[0] && blocks.push(this.buildKpiBlock(rows[0]));
      rows[1]?.children[0] && blocks.push(this.buildWideBlock(rows[1].children[0]));
      const secondCharts = [
        rows[1]?.children[1] ?? null,
        rows[2]?.children[1] ?? null,
      ];
      secondCharts.forEach((col) => col && blocks.push(this.buildWideBlock(col)));
      rows[2]?.children[0] && blocks.push(this.buildWideBlock(rows[2].children[0]));
      return blocks;
    },

    buildKpiBlock(row) {
      const inner = row.cloneNode(true);
      inner.style.cssText = "display:flex;flex-wrap:wrap;align-items:stretch;";
      Array.from(inner.children).forEach((c, i) => {
        const w = i < 3 ? "33.33333" : "50";
        c.style.cssText += `;width:${w}%;flex:0 0 ${w}%;max-width:${w}%;`;
      });
      const wrapper = document.createElement("div");
      wrapper.style.cssText = "width:100%;box-sizing:border-box;padding:0 16px 12px;";
      wrapper.appendChild(inner);
      return wrapper;
    },

    buildWideBlock(col) {
      const clone = col.cloneNode(true);
      clone.style.cssText = "width:100%;box-sizing:border-box;flex:0 0 100%;max-width:100%;padding:0 16px 12px;";
      return clone;
    },
  },

  mounted() {
    this.loadReport();
  },
};
</script>

<style scoped>
.kpi-card {
  border-radius: 12px;
}

.trend-container {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}
</style>
