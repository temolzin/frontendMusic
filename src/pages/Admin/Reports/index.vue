<template>
  <div class="q-pa-md">
    <b class="text-h5 q-mb-xl d-block">Reportes de ganancias</b>
    <ReportsDashboard />
  </div>
</template>

<script>
import ReportsDashboard from "src/components/admin/Reports/ReportsDashboard.vue";

export default {
  name: "AdminReports",
  components: {
    ReportsDashboard,
  },
};
</script>
