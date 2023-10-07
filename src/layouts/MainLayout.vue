<template>
  <q-layout view="lHh Lpr fff">
    <!-- Inicio del header -->
    <q-header
      elevated
      :class="mode ? 'bg-dark text-white-8' : 'bg-white text-grey-8'"
      height-hint="64"
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
          <q-icon
            name="fas fa-solid fa-cloud-moon"
            color="primary"
            size="40px"
          />

          <transition
            appear
            enter-active-class="animated rubberBand"
            :duration="1000"
          >
            <span class="q-ml-sm">Música GSM</span>
          </transition>
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
          <q-route-tab to="/about" label="More" />
        </q-tabs>
        <!-- Fin de Links para navegar entre paginas -->

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- Inicio Botones de inicio de sesion y dashboard -->
          <q-tabs v-if="$q.screen.gt.xs">
            <q-route-tab
              to="/register"
              label="Registrar"
              class="q-mr-sm"
              v-if="isAuthenticated == false"
            />

            <q-route-tab
              to="/dashboard/home"
              label="Dashboard"
              v-if="isAuthenticated == true"
            />
          </q-tabs>
          <q-tabs>
            <q-btn
              outline
              to="/login"
              color="primary"
              label="Ingresar"
              v-if="isAuthenticated == false"
              class="q-mr-md"
            />
          </q-tabs>
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
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center q-mt-md q-ml-md">
            <q-icon
              name="fas fa-solid fa-cloud-moon"
              color="primary"
              size="40px"
            ></q-icon>
            <span class="q-ml-sm">Música GSM</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <div v-if="isAuthenticated == true">
            <q-separator class="q-my-md" />

            <q-item clickable class="q-ml-md" to="/dashboard/home">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dashboard</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <q-separator class="q-my-md" />

          <q-item
            v-for="link in links2"
            :key="link.text"
            clickable
            :to="link.to"
            class="q-ml-md"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />
          <div v-if="isAuthenticated == false">
            <q-item
              class="q-ml-md"
              v-for="link in links3"
              :key="link.text"
              clickable
              :to="link.to"
            >
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="q-my-md" />
          </div>
          <q-item>
            <q-item-section avatar class="q-ml-md">
              Modo Obscuro
            </q-item-section>
            <q-item-section>
              <q-toggle
                v-model="isActiveDarkMode"
                checked-icon="nightlight"
                color="primary"
                unchecked-icon="nightlight"
                @update:model-value="darkMode(isActiveDarkMode)"
              />
            </q-item-section>
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
          Conocenos a traves de nuestras redes sociales
        </q-toolbar-title>
        <div class="q-col-gutter-md q-mr-md">
          <q-icon name="fab fa-brands fa-facebook-f" size="20px" />
          <q-icon name="fab fa-brands fa-twitter" size="20px" />
          <q-icon name="fab fa-brands fa-instagram" size="20px" />
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
                <p class="text-weight-bold">Música GSM</p>
                <p>
                  Here you can use rows and columns to organize your footer
                  content. Lorem ipsum dolor sit amet, consectetur adipisicing
                  elit.
                </p>
              </div>

              <div class="col-12 col-xs-12 col-sm-3 col-md-3">
                <p class="text-weight-bold">Legal</p>
                <q-list class="text-white text-weight-light">
                  <q-item clickable class="q-pa-none">
                    <q-item-section class="text-weight-regular text-grey-5">
                      Términos y condiciones
                    </q-item-section>
                  </q-item>
                  <q-item clickable class="q-pa-none">
                    <q-item-section class="text-weight-regular text-grey-5">
                      Política de privacidad
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-xs-12 col-sm-3 col-md-3">
                <p class="text-weight-bold">Contacto</p>
                <p>
                  <q-icon name="home" size="15px" class="q-mb-xs" /> México,
                  Méx.
                </p>
                <p>
                  <q-icon name="email" size="15px" class="q-mb-xs" />
                  prueba@email.com
                </p>
                <p>
                  <q-icon name="phone" size="15px" class="q-mb-xs" />
                  +52 55 34 13 13
                </p>
              </div>
              <div class="col-12 col-xs-12 col-sm-3 col-md-3">
                <p class="text-weight-bold">Contacto</p>
                <p>
                  <q-icon name="home" size="15px" class="q-mb-xs" /> México,
                  Méx.
                </p>
                <p>
                  <q-icon name="email" size="15px" class="q-mb-xs" />
                  prueba@email.com
                </p>
                <p>
                  <q-icon name="phone" size="15px" class="q-mb-xs" />
                  +52 55 34 13 13
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
          <div class="text-center">2022 © Copyright MusicaGSM.com</div>
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

export default {
  name: "GooglePhotosLayout",
  components: { SearchBar,ProfilePhoto },
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
    darkMode(val) {
      this.$q.dark.set(val);
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
  created() {
    this.getArtistss();
    this.isActiveDarkMode = this.mode;
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("artistList", ["stateArtistList"]),

    mode: function () {
      return this.$q.dark.isActive;
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
