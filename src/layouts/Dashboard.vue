<template>
  <div class="hhh LpR fff">
    <q-layout view="lHh Lpr lff" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-cyan-19">
        <q-toolbar>
          <q-toolbar-title class="text-weight-bold">Header</q-toolbar-title>
          <q-btn stretch flat to="/login" v-if="!isAuthenticated">Login</q-btn>
          <q-btn stretch flat @click="logout" v-else>Logout</q-btn>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" show-if-above :width="270" :breakpoint="400">
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list padding>
            <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section> Inicio </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>

              <q-item-section> Star </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section> Send </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section> Drafts </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_960_720.jpg"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="70px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">{{ getMe.name }}</div>
            <div>{{ getMe.email }}</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { ref } from "vue";
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  setup() {
    return {
      drawer: ref(false),
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/signOut");
      this.$router.push("/login");
    },
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("auth", ["getMe"]),
  },
};
</script>
