<template>
  <q-page padding>
    <div class="q-pa-md row items-center justify-center">
      <q-card class="my-card col-12 col-sm-12 col-md-6 col-lg-6">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section class="q-pa-sm">
            <q-item-label class="text-h6 q-mt-sm">
              {{ getMe.name }}
              <q-btn v-if="$can('edit-profile')" round color="primary" icon="edit"/>
            </q-item-label>
            <q-item-label caption>{{ getMe.email }}</q-item-label>
          </q-item-section>
        </q-item>
        <hr />
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-mb-sm">
          {{ getMe }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Index",
  computed: {
    ...mapGetters("auth", ["getMe"]),
  },
};
</script>

<style scoped></style>
