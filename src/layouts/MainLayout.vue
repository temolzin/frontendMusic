<template>
  <q-layout view="hhh LpR fff">

    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/register" label="Register" />
        <q-route-tab to="/login" label="Login" v-if="!isAuthenticated"/>
        <q-route-tab to="/about" label="About" />
        <q-route-tab to="/product" label="Product" />
        
        <q-route-tab to="/dashboard/home" label="Dashboard" v-if="isAuthenticated" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MainLayout",
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
  },
};
</script>
