<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el to="/dashboard/home" label="Inico" icon="home" />
        <q-breadcrumbs-el label="Generos Musicales" icon="widgets" />
      </q-breadcrumbs>
    </div>
    <!-- <div class="q-ma-none">
      <h4 class="q-mt-none q-mb-none">Recomendaciones</h4>
      <div>
        <q-spinner-ball color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerBall</q-tooltip>
      </div>
      <q-carousel
        v-model="slide"
        height="110px"
        class="q-ma-none"
        style="padding-left: 0px; padding-right: 0px"
      >
        <q-carousel-slide :name="1" class="column no-wrap q-ma-none">
          <div
            class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
          >
            <q-btn
              v-for="(clientMusicalGender, index) in clientMusicalGenders"
              :key="index"
              class="rounded-borders col-3 col-sm-3 col-md-3"
              :color="clientMusicalGender.color"
              :label="clientMusicalGender.name"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div> -->

    <p class="q-mt-sm q-mb-md text-h4">
      Géneros
      <q-spinner-audio color="accent" class="q-pb-sm" />
      <q-tooltip :offset="[0, 8]">QSpinnerAudio</q-tooltip>
    </p>

    <div class="row q-col-gutter-lg">
      <div
        class="col-6 col-sm-3 col-md-3"
        v-for="(clientMusicalGender, index) in clientMusicalGenders"
        :key="index"
      >
        <div class="my-content">
          <q-btn
            :color="clientMusicalGender.color"
            :label="clientMusicalGender.name"
            class="q-pa-lg botom"
            @click="search(clientMusicalGender.slug)"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import { onBeforeUnmount } from "vue";

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
    gettMusicalGenders() {
      try {
        if (this.clientMusicalGenders[0] == null) {
          this.showLoading();
        }
        this.getMusicalGenders();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    search(name) {
      // console.log(name);
      this.$router.push({
        name: "client.view-groups-by-genders-search",
        params: {
          slug: name,
        },
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
.botom {
  min-width: 100%;
  max-height: 60px;
  text-align: center;
  padding-top: 20px;
  padding-left: 0px;
  padding-right: 0px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
</style>
