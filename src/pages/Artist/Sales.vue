<template>
  <q-page class="q-pa-md">

    <q-table
      v-if="artist != null && stateArtistSales && stateArtistSales.length > 0"
      :rows="stateArtistSales || []"
      :columns="columns"
      row-key="openpay_transaction_id"
      :filter="filter"
      no-data-label="Sin ventas registradas"
      no-results-label="Ningún resultado coincide"
      rows-per-page-label="Ventas por página"
      :rows-per-page-options="[5, 10, 20]"
      flat
      bordered
      class="sales-table"
    >
      <template v-slot:top-left>
        <p class="text-h5 q-mb-none q-mt-sm">Mis Ventas</p>
      </template>
      <template v-slot:top-right>
        <q-input
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar..."
          color="primary"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-cliente="props">
        <q-td :props="props">
          <div class="text-weight-bold">
            {{ props.row.customer_first_name }} {{ props.row.customer_last_name }}
          </div>
          <div class="text-caption text-grey">{{ props.row.customer_email }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-lugar="props">
        <q-td :props="props">
          <div class="text-weight-medium">
            <q-icon name="location_on" size="14px" color="grey" class="q-mr-xs" />
            {{ props.row.customer_city }}
          </div>
          <div class="text-caption text-grey q-ml-md">{{ props.row.customer_state }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-evento="props">
        <q-td :props="props">
          <div v-if="props.row.event_date">
            <q-icon name="event" size="14px" color="primary" class="q-mr-xs" />
            <span class="text-weight-medium">{{ formatDate(props.row.event_date) }}</span>
          </div>
          <div v-if="props.row.event_hour" class="text-caption text-grey q-ml-md">
            {{ props.row.event_hour }} hrs
          </div>
          <span v-if="!props.row.event_date" class="text-grey text-caption">Sin fecha</span>
        </q-td>
      </template>

      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <span class="text-weight-bold text-positive text-h6">
            ${{ Number(props.row.amount).toLocaleString('es-MX') }}
          </span>
        </q-td>
      </template>

    </q-table>

    <notice-not-info v-if="artist == null" />

    <notice-no-sales
      v-if="artist != null && (!stateArtistSales || stateArtistSales.length === 0)"
    />

  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useQuasar } from "quasar";
import NoticeNoSales from "src/components/Artist/NoticeNoSales.vue";
import NoticeNotInfo from "src/components/Artist/NoticeNotInfo.vue";

let $q;

const columns = [
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: (row) => `${row.customer_first_name} ${row.customer_last_name}`,
    sortable: true,
  },
  {
    name: "lugar",
    label: "Lugar del evento",
    align: "left",
    field: "customer_city",
    sortable: true,
  },
  {
    name: "evento",
    label: "Fecha del evento",
    align: "left",
    field: "event_date",
    sortable: true,
  },
  {
    name: "amount",
    label: "Monto",
    align: "left",
    field: "amount",
    sortable: true,
  },
];

export default {
  name: "ArtistSales",
  components: { NoticeNoSales, NoticeNotInfo },

  data() {
    return {
      columns,
      filter: "",
    };
  },

  computed: {
    ...mapGetters("artistSales", ["stateArtistSales"]),
    ...mapState({ artist: (state) => state.artist.artist }),
  },

  methods: {
    ...mapActions("artistSales", ["getArtistSales"]),
    ...mapActions("artist", ["getArtist"]),

    async getArtistSaless() {
      try {
        await this.getArtist();
        if (this.artist != null) {
          await this.getArtistSales();
        }
      } catch (err) {
        if (err?.response?.data?.message) {
          $q.notify({ type: "negative", message: err.response.data.message });
        }
      }
    },

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },

  created() {
    $q = useQuasar();
    this.getArtistSaless();
  },

  mounted() {},
};
</script>

<style scoped>
.sales-table {
  border-radius: 12px;
}
</style>
