<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el to="/dashboard/home" label="Inicio" icon="home" />
        <q-breadcrumbs-el label="Géneros Musicales" icon="widgets" />
      </q-breadcrumbs>
    </div>

    <p class="q-mt-sm q-mb-lg text-h4 text-weight-light">
      Explora por género musical
      <q-spinner-audio color="accent" class="q-pb-sm" />
    </p>

    <div class="row q-col-gutter-md">
      <div
        class="col-12 col-sm-6 col-md-4"
        v-for="(gender, index) in clientMusicalGenders"
        :key="index"
      >
        <q-card
          class="gender-card cursor-pointer"
          @click="search(gender.slug)"
          flat
        >
          <div class="gender-card__inner">
            <div
              class="gender-card__glow"
              :style="{ background: 'radial-gradient(circle, ' + colorHex(gender.color) + '55 0%, transparent 70%)' }"
            ></div>
            <div
              class="gender-card__image"
              :style="{
                backgroundImage: gender.image
                  ? `url('${gender.image}')`
                  : 'none',
              }"
            >
              <q-icon
                v-if="!gender.image"
                :name="iconMap(gender.slug)"
                size="40px"
                class="gender-card__icon"
                :style="{ color: colorHex(gender.color) }"
              />
            </div>
            <span class="gender-card__name">{{ gender.name }}</span>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import { onBeforeUnmount } from "vue";
import { notifyError } from "src/utils/notify";

let $q;
export default {
  setup() {
    const $q = useQuasar();
    let timer;

    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    return {
      showLoading() {
        $q.loading.show();
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 2000);
      },
    };
  },
  data() {
    return {
      searchSlug: null,
      slide: 1,
    };
  },
  methods: {
    ...mapActions("clientMusicalGenders", ["getMusicalGenders"]),
    iconMap(slug) {
      const map = {
        'mariachi': 'music_note',
        'corridos': 'guitar_acoustic',
        'ranchera': 'guitar_acoustic',
        'banda-sinaloense': 'album',
        'huapango-huasteco': 'music_video',
        'huapango-norteño': 'music_video',
        'chilena': 'radio',
      };
      return map[slug] || 'music_note';
    },
    colorHex(color) {
      const map = {
        'primary': '#1976D2',
        'secondary': '#26A69A',
        'accent': '#9C27B0',
        'dark': '#1D1D1D',
        'orange': '#FF9800',
        'yellow': '#FFEB3B',
        'red': '#F44336',
        'green': '#4CAF50',
        'blue-grey': '#607D8B',
        'blue': '#2196F3',
        'purple': '#9C27B0',
        'cyan': '#00BCD4',
        'teal': '#009688',
        'indigo': '#3F51B5',
        'pink': '#E91E63',
        'deep-purple': '#673AB7',
        'lime': '#CDDC39',
      };
      return map[color] || color;
    },
    gettMusicalGenders() {
      try {
        if (this.clientMusicalGenders[0] == null) {
          this.showLoading();
        }
        this.getMusicalGenders();
      } catch (err) {
        if (err.response.data.message) {
          notifyError(err.response.data.message);
        }
      }
    },
    search(name) {
      this.$router.push({
        name: "client.view-groups-by-genders-search",
        params: { slug: name },
      });
    },
  },
  created() {
    this.gettMusicalGenders();
  },
  computed: {
    ...mapState({
      clientMusicalGenders: (state) =>
        state.clientMusicalGenders.musicalGenders,
    }),
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style scoped>
.gender-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  border: none;
  background: #1a1a2e;
}

.gender-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
}

.gender-card__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px 32px;
  min-height: 280px;
  overflow: hidden;
}

.gender-card__glow {
  position: absolute;
  inset: -30px;
  pointer-events: none;
}

.gender-card__image {
  position: relative;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  z-index: 1;
}

.gender-card__icon {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.gender-card__name {
  position: relative;
  z-index: 1;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
</style>
