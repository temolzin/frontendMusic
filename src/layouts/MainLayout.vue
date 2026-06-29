<template>
  <q-layout view="lHh Lpr fff">
    <!-- Inicio del header -->
    <q-header
      elevated
      :class="mode ? 'bg-dark text-white-8' : 'bg-white text-grey-8'"
      height-hint="90"
    >
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <!-- Inicion de botón Hamburguesa Small -->
        <q-btn
          v-if="$q.screen.lt.sm"
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="list"
          class="q-mx-md"
        />
        <!-- Fin de botón Hamburguesa Small -->

        <!-- Incio icono y nombre lado izquierdo -->
        <q-toolbar-title
          shrink
          class="row items-center no-wrap q-ml-md"
          v-if="$q.screen.gt.sm"
        >
          <img :src="mode ? '/logovibeer.ico' : '/logovibeer-black.png'" style="height: 64px; transform: scale(1.4); transform-origin: left center;">
        </q-toolbar-title>
        <!-- Fin icono y nombre lado izquierdo -->

        <q-space />

        <!-- Inicio de input Search -->
        <SearchBar></SearchBar>
        <!-- Fin de input Search -->

        <!-- Inicio de Links para navegar entre paginas -->
        <q-tabs v-if="$q.screen.gt.xs">
          <q-route-tab to="/" label="Inicio" />
          <q-route-tab to="/artist-list" label="Artistas" />
          <q-route-tab to="/about" label="Más" />
          <q-route-tab to="/dashboard/home" label="Panel" v-if="isAuthenticated == true" />
        </q-tabs>
        <!-- Fin de Links para navegar entre paginas -->


        <div class="q-gutter-sm row items-center no-wrap">
          <!-- Inicio Botones de inicio de sesion y dashboard -->
          <q-tabs v-if="$q.screen.gt.xs">
            <q-route-tab
              to="/register"
              label="Registrar"
              class="q-mr-sm"
              v-if="isAuthenticated == false"
            />
          </q-tabs>

          <q-btn
            outline
            to="/login"
            color="primary"
            label="Ingresar"
            v-if="isAuthenticated == false"
            class="q-mr-md"
          />

          <q-toggle
            v-if="$q.screen.gt.xs"
            v-model="isActiveDarkMode"
            checked-icon="nightlight"
            color="primary"
            unchecked-icon="nightlight"
            @update:model-value="darkMode(isActiveDarkMode)"
          />
          <!-- Fin Botones de inicio de sesion y dashboard -->

          <!-- Card info profile -->
          <ProfilePhoto v-if="isAuthenticated == true"></ProfilePhoto>
          <!-- Card info profile -->
        </div>
      </q-toolbar>
    </q-header>
    <!-- Fin del header -->

    <!-- Inicio del Menú lateral izquierdo -->
   <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      :class="mode ? 'bg-modedark' : 'bg-primary'"
      @click="leftDrawerOpen = false"
    >
      <div style="height: 120px; position: relative;">
        <q-img class="absolute-top bg-transparent" style="height: 120px;">
          <div class="bg-transparent" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <img src="/logovibeer.ico" style="height: 50px; transform: scale(2.4);">
          </div>
        </q-img>
      </div>

      <q-scroll-area style="height: calc(100% - 120px);">
        <q-list padding class="text-white text-weight-light">
          <div v-if="isAuthenticated && getMe && getMe.role">
            <q-item v-if="getMe.role[0] == 'administrador'">
              <q-item-section class="text-weight-bold">PANEL</q-item-section>
            </q-item>
            <q-item v-if="getMe.role[0] == 'cliente'">
              <q-item-section class="text-weight-bold">INICIO</q-item-section>
            </q-item>
            <q-item v-if="getMe.role[0] == 'artista'">
              <q-item-section class="text-weight-bold">DASHBOARD</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/users" v-if="getMe.role[0] == 'administrador'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-users" /></q-item-section>
              <q-item-section> Usuarios </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/roles" v-if="getMe.role[0] == 'administrador'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-street-view" /></q-item-section>
              <q-item-section> Roles </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/musical-genders/index" v-if="getMe.role[0] == 'administrador'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-icons" /></q-item-section>
              <q-item-section> Géneros Musicales </q-item-section>
            </q-item>
             <q-item clickable v-ripple to="/admin/newsletter/index" v-if="getMe.role[0] == 'administrador'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-newspaper" /></q-item-section>
              <q-item-section> Envío de Correos </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/payouts" v-if="getMe.role[0] == 'administrador'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="payments" /></q-item-section>
              <q-item-section> Liquidaciones </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/artist/index" v-if="getMe.role[0] == 'artista'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-microphone" /></q-item-section>
              <q-item-section> Perfil de Artista </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/artist/artistSales" v-if="getMe.role[0] == 'artista'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-cart-arrow-down" /></q-item-section>
              <q-item-section> Mis ventas </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/artist/payout-info" v-if="getMe.role[0] == 'artista'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="account_balance" /></q-item-section>
              <q-item-section> Datos de Cobro </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/artist/artistSales" v-if="getMe.role[0] == 'artista'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-calendar" /></q-item-section>
              <q-item-section> Mi calendario </q-item-section>
            </q-item>
             <q-item clickable v-ripple to="/artist/artistSales" v-if="getMe.role[0] == 'artista'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="local_offer" /></q-item-section>
              <q-item-section> Mis ofertas </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/client/store" v-if="getMe.role[0] == 'cliente'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-store" /></q-item-section>
              <q-item-section> Tienda </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/client/musical-genders" v-if="getMe.role[0] == 'cliente'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-list-ul" /></q-item-section>
              <q-item-section> Géneros musicales </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/artist-list" v-if="getMe.role[0] == 'cliente'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-tags" /></q-item-section>
              <q-item-section> Ofertas </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/client/favourite-artist" v-if="getMe.role[0] == 'cliente'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-heart" /></q-item-section>
              <q-item-section> Favoritos </q-item-section>
            </q-item>
            <q-item v-if="getMe.role[0] == 'cliente'">
              <q-item-section class="text-weight-bold">
                INFORMACIÓN
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/client/shopping-cart" v-if="getMe.role[0] == 'cliente'" active-class="text-accent   text-weight-bold">
              <q-item-section avatar>
                <icon-cart compact :fetch-on-create="false"></icon-cart>
              </q-item-section>
                <q-item-section> Mi carrito </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/client/shopping-cart/view-my-order-details" v-if="getMe.role[0] == 'cliente'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-cart-arrow-down" /></q-item-section>
              <q-item-section> Mis compras </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/client/card" v-if="getMe.role[0] == 'cliente'" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon name="fas fa-solid fa-credit-card" /></q-item-section>
              <q-item-section> Mis tarjetas </q-item-section>
            </q-item>
          </div>
          <div v-else>
            <q-item>
              <q-item-section class="text-weight-bold">MENÚ</q-item-section>
            </q-item>
            <q-item v-for="link in links2" :key="link.text" clickable :to="link.to" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon :name="link.icon" /></q-item-section>
              <q-item-section>{{ link.text }}</q-item-section>
            </q-item>
            <q-item v-for="link in links3" :key="link.text" clickable :to="link.to" active-class="text-accent text-weight-bold">
              <q-item-section avatar><q-icon :name="link.icon" /></q-item-section>
              <q-item-section>{{ link.text }}</q-item-section>
            </q-item>
          </div>
          <q-item>
            <q-item-section class="text-weight-bold">CONFIGURACIONES</q-item-section>
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
    </q-drawer>
    <!-- Fin del Menú lateral izquierdo -->

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <q-toolbar class="row bg-primary text-white">
        <q-toolbar-title class="q-ml-md" style="font-size: 15px">
          Conócenos a través de nuestras redes sociales
        </q-toolbar-title>
        <div class="row items-center q-col-gutter-md q-mr-md">
          <a href="https://www.facebook.com/RootHeim" target="_blank" class="text-white">
            <q-icon name="fab fa-brands fa-facebook-f" size="20px" />
          </a>
          <a href="https://mx.linkedin.com/company/rootheim" target="_blank" class="text-white">
            <q-icon name="fab fa-brands fa-linkedin-in" size="20px" />
          </a>
          <a href="https://www.instagram.com/rootheimcompany/" target="_blank" class="text-white">
            <q-icon name="fab fa-brands fa-instagram" size="20px" />
          </a>
        </div>
      </q-toolbar>

      <q-card
        class="my-card text-grey-5 bg-modedark"
        style="border-radius: 0px"
      >
        <div class="row items-center justify-center">
          <div class="col-12">
            <div class="row items-center q-ma-lg justify-center">
              <div class="col-12 col-xs-12 col-sm-3 col-md-3">
                <p class="text-weight-bold">Vibeer</p>
                <p>
                  Plataforma dedicada a conectar artistas musicales con clientes
                  que buscan el mejor talento para sus eventos.
                </p>
              </div>

              <div class="col-12 col-xs-12 col-sm-3 col-md-3">
                <p class="text-weight-bold">Legal</p>
                <q-list class="text-white text-weight-light">
                  <q-item clickable class="q-pa-none" to="/terminos-condiciones">
                    <q-item-section class="text-weight-regular text-grey-5">
                      Términos y condiciones
                    </q-item-section>
                  </q-item>
                  <q-item clickable class="q-pa-none" to="/politica-privacidad">
                    <q-item-section class="text-weight-regular text-grey-5">
                      Política de privacidad
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-xs-12 col-sm-3 col-md-3">
                <p class="text-weight-bold">Explora</p>
                <q-list class="text-white text-weight-light">
                  <q-item clickable class="q-pa-none" to="/">
                    <q-item-section class="text-weight-regular text-grey-5">
                      Inicio
                    </q-item-section>
                  </q-item>
                  <q-item clickable class="q-pa-none" to="/artist-list">
                    <q-item-section class="text-weight-regular text-grey-5">
                      Artistas
                    </q-item-section>
                  </q-item>
                  <q-item clickable class="q-pa-none" to="/quotations">
                    <q-item-section class="text-weight-regular text-grey-5">
                      Cotizaciones
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-xs-12 col-sm-3 col-md-3">
                <p class="text-weight-bold">Contacto</p>
                <p>
                  <q-icon name="home" size="15px" class="q-mb-xs" /> Calle la Palma, 
                  Núm. Ext. 9, Col. Purificación, Teotihuacán, Méx. 55804
                </p>
                <p>
                  <q-icon name="email" size="15px" class="q-mb-xs" />
                  <a href="mailto:info@rootheim.com" class="text-grey-5"> info@rootheim.com </a>
                </p>
                <p>
                  <q-icon name="phone" size="15px" class="q-mb-xs" />
                  +52 56 1966 0990
                </p>
              </div>
            </div>
          </div>
        </div>

        <q-separator dark />
        <q-card-actions
          class="justify-center"
          style="background-color: rgba(0, 0, 0, 0.2)"
        >
          <div class="text-center">2022 © Copyright Vibeer.com</div>
        </q-card-actions>
      </q-card>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { mapGetters, mapActions } from "vuex";
import SearchBar from "src/components/SearchBar/SearchBar.vue";
import ProfilePhoto from "src/components/ProfilePhoto.vue";
import iconCart from "src/components/ShoppingCart/iconCart.vue";

export default {
  name: "GooglePhotosLayout",
  components: { SearchBar, ProfilePhoto , iconCart},
  setup() {
    const leftDrawerOpen = ref(false);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      isActiveDarkMode: ref(false),
      leftDrawerOpen,
      options: ref(),
      allOptions: [],

      links2: [
        { icon: "home", text: "Inicio", to: "/" },
        { icon: "music_note", text: "Artistas", to: "/artist-list" },
        { icon: "add", text: "Más..", to: "/about" },
      ],
      links3: [
        { icon: "person", text: "Ingresar", to: "/login" },
        { icon: "person_add_alt", text: "Registrar", to: "/register" },
      ],
      toggleLeftDrawer,
    };
  },

  methods: {
    ...mapActions("artistList", ["getArtists"]),
    ...mapActions("shoppingCard", ["getCountListShoppingCard"]),
    async getArtistss() {
      try {
        await this.getArtists();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
async fetchShoppingCartCount() {
  try {
    if (this.isAuthenticated) {
      await this.getCountListShoppingCard();
    }
  } catch (err) {
    const message = err?.response?.data?.message || "No se pudo cargar el carrito.";
    if (message === 'Unauthenticated.' || err?.response?.status === 401) {
      this.$q.notify({
        color: "primary",      
        textColor: "white",    
        icon: "sentiment_satisfied_alt", 
        message: '¡Hasta luego!',
        timeout: 2000,         
        position: "bottom"        
      });
      return; 
    }
    this.$q.notify({
      type: "negative",
      message,
    });
  }
},
    darkMode(val) {
      this.$q.dark.set(val);
      const user = this.getMe;
      if (user?.id) {
        localStorage.setItem(`darkMode_${user.id}`, val);
        this.$api.put('/api/user/dark-mode', { dark_mode: val });
      }
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
      let genders = [];
      let artists = [];
      
      this.stateArtistList.forEach(artist => {
        artist.musical_genders.forEach(gender => {
          const obj = {name : gender.name, url: `/client/musical-genders/${gender.slug}`};
          genders.push(obj);
        });
      });

      this.stateArtistList.forEach(artist => {
        const obj = {name : artist.name, url: `/client/musical-genders/${artist.musical_genders[0].name}/${artist.slug}`};
        artists.push(obj);
      });

      this.allOptions = this.removeDuplicates([...genders, ...artists]);
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
  async created() {
    this.getArtistss();
    this.fetchShoppingCartCount();
    const user = this.getMe;
    const saved = user?.id ? localStorage.getItem(`darkMode_${user.id}`) : null;
    const isDark = saved === 'true';
    this.$q.dark.set(isDark);
    this.isActiveDarkMode = isDark;
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
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
      this.fetchShoppingCartCount();
    },
  },
};
</script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
