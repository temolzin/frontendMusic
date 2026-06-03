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
            <SearchBar></SearchBar>
          </div>
        </q-toolbar-title>
        <!-- Fin Bottom Serach -->

        <!-- bottom dropdown  -->
        <div class="text-right" style="color: gray">
          <!-- Icons bell and wrench -->
          <small v-if="getMe.role[0] == 'cliente'">
            <router-link to="/client/shopping-cart">
              <icon-cart :fetch-on-create="false"></icon-cart>
            </router-link>
          </small>
          <!-- FinIcons bell and wrench -->

          <!-- Card info profile -->
          <ProfilePhoto></ProfilePhoto>
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
              PANEL
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

            <q-item-section> Géneros Musicales </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin/newsletter/index"
            v-if="getMe.role[0] == 'administrador'"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-newspaper" />
            </q-item-section>

            <q-item-section> Newsletter </q-item-section>
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
            to="/artist/artistSales"
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
            to="/artist/my-calendar"
            v-if="$can('view-profile-artist')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-calendar" />
            </q-item-section>

            <q-item-section>Mi Calendario</q-item-section>
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

            <q-item-section> Mi Membresía </q-item-section>
          </q-item>

            <q-item
            clickable
            v-ripple
            to="/client/store"
            v-if="$can('view-store')"
            active-class="text-accent"
          >
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

            <q-item-section> Géneros Musicales</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/artist-list" v-if="$can('create-card')">
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-tags" />
            </q-item-section>

            <q-item-section> Ofertas </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/client/favourite-artist" v-if="$can('view-favourite-artist')" active-class="text-accent text-weight-bold">
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
            to="/client/shopping-cart"
            clickable
            v-ripple
            v-if="$can('view-shopping-cart')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <icon-cart compact :fetch-on-create="false"></icon-cart>
            </q-item-section>

            <q-item-section> Mi Carrito </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/client/shopping-cart/view-my-order-details"
            v-if="$can('view-my-order-details')"
            active-class="text-accent text-weight-bold"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-solid fa-cart-arrow-down" />
            </q-item-section>

            <q-item-section> Mis Compras </q-item-section>
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

            <q-item-section> Modo Oscuro </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Inicio Icono de la marca -->
          <q-img class="absolute-top bg-transparent" style="height: 140px;">
            <div class="bg-transparent" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden;" @click="redirect">
              <img src="/logovibeer.ico" style="height: 50px; transform: scale(2.4); cursor: pointer;">
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
import { mapGetters, mapActions } from "vuex";
import iconCart from "src/components/ShoppingCart/iconCart.vue";
import SearchBar from "src/components/SearchBar/SearchBar.vue";
import ProfilePhoto from "src/components/ProfilePhoto.vue";

export default {
  components: { iconCart, SearchBar, ProfilePhoto },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      isActiveDarkMode: ref(false),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      options: ref(),
      allOptions: [],
      text: ref(""),
      mobileData: ref(false),
      bluetooth: ref(false),
      numberShopping: 0,
    };
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("artistList", ["stateArtistList"]),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
  watch: {
    getMe(user) {
      const saved = user?.id ? localStorage.getItem(`darkMode_${user.id}`) : null;
      const isDark = saved === 'true';
      this.$q.dark.set(isDark);
      this.isActiveDarkMode = isDark;
    },
},

  created() {
    this.getArtistss();
    this.fetchShoppingCartCount();
    const user = this.getMe;
    const saved = user?.id ? localStorage.getItem(`darkMode_${user.id}`) : null;
    const isDark = saved === 'true';
    this.$q.dark.set(isDark);
    this.isActiveDarkMode = isDark;
  },
  methods: {
    ...mapActions("artistList", ["getArtists"]),
    ...mapActions("shoppingCard", ["getCountListShoppingCard"]),
    async getArtistss() {
      try {
        await this.getArtists();
      } catch (err) {
        const message = err?.response?.data?.message || "No se pudieron cargar los artistas.";
        this.$q.notify({
          type: "negative",
          message,
        });
      }
    },
    async fetchShoppingCartCount() {
      try {
        await this.getCountListShoppingCard();
      } catch (err) {
        const message = err?.response?.data?.message || "No se pudo cargar el carrito.";
        this.$q.notify({
          type: "negative",
          message,
        });
      }
    },
    logout() {
      this.$q.dark.set(false);
      this.isActiveDarkMode = false;
      this.$store.dispatch("auth/signOut");
      const toPath = this.$route.query.to || "/";
      this.$router.push(toPath);
    },
    darkMode(val) {
      this.$q.dark.set(val);
      const user = this.getMe;
      if (user?.id) {
        localStorage.setItem(`darkMode_${user.id}`, val);
        this.$api.put('/api/user/dark-mode', { dark_mode: val });
      }
    },
    redirect() {
      const toPath = this.$route.query.to || "/";
      this.$router.push(toPath);
    },
    redirectToRoute(value) {
      this.$router.push(value);      
    },
    removeDuplicates(arr) {
      const uniqueArray = arr.filter((obj, index, self) =>
        index === self.findIndex((o) => o.name === obj.name)
      );
      return uniqueArray;
    },
    getMusicalGendersAndArtist() {
      let gendres = [];
      let artists = [];
      
      this.stateArtistList.forEach(artist => {
        artist.musical_genders.forEach(gendre => {
          const obj = {name : gendre.name, url: `/client/musical-genders/${gendre.slug}`};
          gendres.push(obj);
        });
      });

      this.stateArtistList.forEach(artist => {
        const obj = {name : artist.name, url: `/client/musical-genders/${artist.musical_genders[0].name}/${artist.slug}`};
        artists.push(obj);
      });

      this.allOptions = this.removeDuplicates([...gendres, ...artists]);
    },
    filterFn (val, update, abort) {
      this.getMusicalGendersAndArtist();
      if (val.length < 1) {
        abort()
        return
      } 
      
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.allOptions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
  },
  
};
</script>
