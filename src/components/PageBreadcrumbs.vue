<template>
  <div v-if="crumbs.length > 1 || !showHome" class="q-mb-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        v-for="(item, index) in crumbs"
        :key="index"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
      />
    </q-breadcrumbs>
  </div>
</template>

<script>
export default {
  name: "PageBreadcrumbs",

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    showHome: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    crumbs() {
      const home = this.showHome
        ? [{ label: "Inicio", icon: "home", to: "/dashboard/home" }]
        : [];
      return [...home, ...this.items];
    },
  },
};
</script>
