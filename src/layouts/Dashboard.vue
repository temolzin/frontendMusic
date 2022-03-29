<template>
  <!-- Quita el error 403 de las imagenes de Gmail -->
  <meta name="referrer" content="no-referrer" />
  <q-layout view="lHh LpR fFf">
    <!-- Inicio de header -->
    <q-header :class="mode ? 'text-white bg-dark' : 'bg-grey-2 text-dark'">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <!-- Bottom Serach -->
        <q-toolbar-title>
          <div class="row q-ma-md">
            <q-input
              rounded
              outlined
              dense
              v-model="text"
              placeholder="Buscar por artista, banda, sonido"
              class="GPL__toolbar-input col-12 col-sm-8 col-md-6"
            >
              <template v-slot:prepend>
                <q-icon v-if="text === ''" name="search" />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="text = ''"
                />
              </template>
            </q-input>
          </div>
        </q-toolbar-title>
        <!-- Fin Bottom Serach -->

        <!-- bottom dropdown  -->
        <div class="text-right" style="color: gray">
          <!-- Icons bell and wrench -->
          <small>
            <q-icon name="fas fa-bell" class="q-mr-md" />
            <q-icon name="fas fa-wrench" size="" />
          </small>
          <!-- FinIcons bell and wrench -->

          <!-- Card info profile -->
          <q-btn-dropdown class="q-ml-sm" round outline flat>
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-avatar size="40px">
                  <img :src="getMe.image" />
                </q-avatar>
              </div>
            </template>
            <div class="row no-wrap q-ma-md">
              <div class="column items-center">
                <q-avatar size="82px">
                  <img :src="getMe.image" class="" />
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  {{ getMe.name }}
                </div>
                <b style="text-transform: capitalize">{{ getMe.role[0] }}</b>
                <small class="q-mt-sm">{{ getMe.email }}</small>

                <div class="row q-mt-md q-ma-sm">
                  <q-btn
                    outline
                    color="indigo col-5"
                    label="Editar perfil"
                    push
                    size="sm"
                    v-close-popup
                    to="/dashboard/user/profile"
                    v-if="$can('edit-profile')"
                  />
                  <div class="col-2"></div>
                  <q-btn
                    outline
                    color="red col-5"
                    label="Cerrar Sesión"
                    push
                    size="sm"
                    v-close-popup
                    @click="logout"
                  />
                </div>
              </div>
            </div>
          </q-btn-dropdown>
          <!-- Card info profile -->
        </div>
        <!-- Fin bottom dropdown  -->
      </q-toolbar>
    </q-header>
    <!-- fin de header -->

    <!-- Menu left -->
    <q-drawer
      :class="mode ? 'bg-modedark' : 'bg-primary'"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 120px">
        <q-list padding class="text-white text-weight-light">
          <q-item
            to="/dashboard/home"
            clickable
            active-class="text-accent text-weight-bold"
            v-if="getMe.role[0] == 'administrador'"
          >
            <q-item-section class="text-weight-bold">
              DASHBOARD
            </q-item-section>
          </q-item>

          <q-item
            to="/dashboard/home"
            clickable
            active-class="text-accent text-weight-bold"
            v-if="getMe.role[0] == 'cliente'"
          >
            <q-item-section class="text-weight-bold"> INICIO </q-item-section>
          </q-item>

          <q-item
            to="/dashboard/home"
            clickable
            active-class="text-accent text-weight-bold"
            v-if="getMe.role[0] == 'artista'"
          >
            <q-item-section class="text-weight-bold">
              DASHBOARD
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/users"
            v-if="$can('view-users')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-users" />
            </q-item-section>
            <q-item-section> Usuarios </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/roles"
            v-if="$can('view-roles')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-street-view" />
            </q-item-section>

            <q-item-section> Roles </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/musical-genders/index"
            v-if="getMe.role[0] == 'administrador'"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-icons" />
            </q-item-section>

            <q-item-section> Generos Musicales </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/artist/index"
            v-if="$can('view-profile-artist')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-microphone" />
            </q-item-section>

            <q-item-section> Perfil de Artista </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/index"
            v-if="$can('view-profile-artist')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-cart-arrow-down" />
            </q-item-section>

            <q-item-section> Mis ventas</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/index"
            v-if="$can('view-profile-artist')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-address-card" />
            </q-item-section>

            <q-item-section> Mi Membrecía </q-item-section>
          </q-item>

          <q-item
            to="/dashboard/home"
            clickable
            active-class="text-accent text-weight-bold"
            v-if="getMe.role[0] == 'artista'"
          >
            <q-item-section class="text-weight-bold">
              OTRAS CONFIGURACIONES
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/index"
            v-if="$can('view-profile-artist')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-microphone" />
            </q-item-section>

            <q-item-section> Perfil de Artista </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/index"
            v-if="$can('view-profile-artist')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-cart-arrow-down" />
            </q-item-section>

            <q-item-section> Mis ventas</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/"
            v-if="$can('view-profile-artist')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-address-card" />
            </q-item-section>

            <q-item-section> Mi Membrecía </q-item-section>
          </q-item>
          <!-- <q-item >
              <q-item-section class="text-weight-bold" v-if="$can('create-card')"> COMPRAS </q-item-section>
            </q-item> -->

          <q-item clickable v-ripple to="/index" v-if="$can('create-card')">
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-store" />
            </q-item-section>

            <q-item-section> Tienda </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/client/musical-genders"
            v-if="$can('view-all-musicals-genders')"
            active-class="text-accent"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-list-ul" />
            </q-item-section>

            <q-item-section> Generos Musicales</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/" v-if="$can('create-card')">
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-tags" />
            </q-item-section>

            <q-item-section> Ofertas </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/" v-if="$can('create-card')">
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-heart" />
            </q-item-section>

            <q-item-section> Favoritos </q-item-section>
          </q-item>

          <q-item v-if="getMe.role[0] == 'cliente'">
            <q-item-section class="text-weight-bold">
              INFORMACIÓN
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/client/card"
            v-if="$can('create-card')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-credit-card" />
            </q-item-section>

            <q-item-section> Mis Tarjetas </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            v-if="$can('create-card')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-cart-arrow-down" />
            </q-item-section>

            <q-item-section> Mis Compras </q-item-section>
          </q-item>

          <q-item clickable active-class="text-accent text-weight-bold">
            <q-item-section class="text-weight-bold"
              >CONFIGURACIONES
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="q-pa-none">
            <q-item-section avatar>
              <q-toggle
                class="q-ma-none"
                v-model="isActiveDarkMode"
                checked-icon="nightlight"
                color="accent"
                unchecked-icon="nightlight"
                @update:model-value="darkMode(isActiveDarkMode)"
              />
            </q-item-section>

            <q-item-section> Modo Obscuro </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Inicio Icono de la marca -->
      <q-img class="absolute-top bg-transparent" style="height: 140px">
        <div class="absolute-center bg-transparent">
          <q-avatar size="140px">
            <q-icon name="fas fa-solid fa-cloud-moon" />
          </q-avatar>
        </div>
      </q-img>
      <!-- Fin Icono de la marca -->
    </q-drawer>
    <!-- Fin Menu left -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { mapGetters } from "vuex";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      isActiveDarkMode: ref(false),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      text: ref(""),
      mobileData: ref(false),
      bluetooth: ref(false),
    };
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/signOut");
      const toPath = this.$route.query.to || "/index";
      this.$router.push(toPath);
    },
    darkMode(val) {
      this.$q.dark.set(val);
    },
  },
  created() {
    this.isActiveDarkMode = this.mode;
  },
};
</script>

