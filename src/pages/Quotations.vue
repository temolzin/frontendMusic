<template>
  <div
    class="col-12 col-md-6 flex content-center justify-center"
    :class="mode ? 'bg-modedark' : 'bg-primary'"
    v-bind:style="{ height: '63em' }"
  >
    <q-card
      class="my-card shadow-box shadow-2"
      :class="`shadow-10`"
      flat
      v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '75%' }"
    >
      <q-card-section horizontal>
        <q-img
          class="col-5 col-sm-1 col-md-5"
          src="https://img.freepik.com/fotos-premium/fondo-escenario-concierto-musica-vivo_800563-6822.jpg"
          v-bind:style="$q.screen.lt.sm ? { width: '0%' } : { width: '40%' }"
        />

        <q-card-section
          class="col-7 col-sm-12 col-md-7"
          v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '60%' }"
        >
          <div class="row">
            <div class="col-6 text-left q-px-md" style="font-size: 2em">
              <q-btn round flat icon="fas fa-arrow-left" to="/" />
            </div>
            <div class="col-6 text-right q-px-md" style="font-size: 2em">
              <q-btn
                round
                color="primary"
                icon="fas fa-solid fa-cloud-moon"
                to="/"
              />
            </div>
          </div>
          <div class="row-2">
            <q-form
              class="template_filters q-gutter-md q-px-lg q-py-lg q-px-xl my-form"
              @submit.prevent="submitForm"
            >
              <div class="row-3">
                <p class="text-center q-mb-lg text-weight-regular text-h6">
                  Categorización del evento
                </p>
                <p class="text-center q-mb-sm text-weight-light">
                  Se parte de esta nueva experiencia de contratación de
                  servicios musicales
                </p>

                <q-select
                  class="filter"
                  v-model="filterGender"
                  label="Género Musical"
                  :options="generosMusicales()"
                >
                </q-select>

                <q-select
                  class="filter"
                  label="Artistas *"
                  v-model="newQuotation.artist_id"
                  :options="filteredData()"
                >
                </q-select>
              </div>
              <div class="row-4">
                <p class="text-center q-mb-lg text-weight-regular text-h6">
                  Información específica del evento
                </p>

                <div class="row items-center space-between" style="justify-content: center">
                  <q-input filled v-model="newQuotation.event_date">
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        @click="showDate = true"
                      >
                        <q-popup-proxy
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="newQuotation.event_date"
                            :options="dateOption"
                            @input="showDate = false"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <div class="space-between">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="remove_circle_outline"
                      @click="event_hours = Math.max(1, event_hours - 1)"
                    />
                  </div>
                  <div class="col-3 text-center text-h6 q-px-md">
                    {{ event_hours + " hora(s)" }}
                  </div>
                  <div class="row q-gutter-md" style="justify-content: center">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="add_circle_outline"
                      @click="event_hours = Math.min(24, event_hours + 1)"
                    />
                  </div>
                </div>
                <q-input
                  v-model="newQuotation.city"
                  type="text"
                  label="Cuidad *"
                >
                </q-input>
                <q-input
                  v-model="newQuotation.address"
                  type="text"
                  label="Direccion *"
                >
                </q-input>
              </div>
              <div class="row-5">
                <p class="text-center q-mb-lg text-weight-regular text-h6">
                  Contacto
                </p>

                <q-input
                  v-model="newQuotation.phone"
                  type="tel"
                  label="Telefono *"
                >
                </q-input>
                <q-input
                  v-model="newQuotation.email"
                  type="email"
                  label="Email *"
                >
                </q-input>
                <q-input
                  v-model="newQuotation.full_name"
                  type="text"
                  label="Nombre *"
                >
                </q-input>

                <br />

                <div class="text-center">
                  <q-btn
                    label="Continuar"
                    type="submit"
                    color="blue"
                    align="center"
                  ></q-btn>
                </div>
              </div>
              <div class="q-pt-sm">
                <p class="text-center q-mt-md">
                  Al continuar, estás aceptando los
                  <u>Términos y condiciones de uso</u>. Consulta nuestra
                  <u>Política de privacidad</u>.
                </p>

                <div class="text-center">
                  ¿Ya tienes una cuenta?
                  <router-link class="text-primary" to="/login">
                    Iniciar sesión
                  </router-link>
                </div>
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { useQuasar, QSelect } from "quasar";
import { mapActions } from "vuex";
import { ref } from "vue";
import { mapGetters } from "vuex";

let $q;

export default {
  components: {
    QSelect,
  },
  name: "Quotations",
  data() {
    return {
      event_hours: 1,
      skeleton: true,
      showFilters: false,
      showDate: false,
      filterGender: "",
      newQuotation: {
        artist_id: "",
        event_date: "Selecciona la fecha",
        event_hours: "",
        city: "",
        address: "",
        phone: "",
        email: "",
        full_name: "",
      },
    };
  },
  created() {},
  computed: {
    ...mapGetters("artistList", ["stateArtistList"]),
    ...mapGetters("quotations", ["stateQuotations"]),

    mode: function () {
      return this.$q.dark.isActive;
    },
    dateOption() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = today.getMonth() + 1;
      const dd = today.getDate();

      return (date) => {
        const [year, month, day] = date.split("/");
        return new Date(year, month - 1, day) >= new Date(yyyy, mm - 1, dd);
      };
    },
  },
  methods: {
    ...mapActions("artistList", ["getArtists"]),
    ...mapActions("quotations", ["newQuotations"]),

    async submitForm() {
      this.loading = false;

      if (
        this.newQuotation.artist_id &&
        this.event_hours &&
        this.newQuotation.event_date &&
        this.newQuotation.city &&
        this.newQuotation.address &&
        this.newQuotation.phone &&
        this.newQuotation.email &&
        this.newQuotation.full_name
      ) {
        try {
          this.newQuotation.event_hours = this.event_hours;
          await this.newQuotations(this.newQuotation);
          $q.notify({
            type: "positive",
            message: "Cotización registrada",
          });
          const toPath = this.$route.query.to || "/";
          this.$router.push(toPath);
        } catch (err) {
          $q.notify({
            type: "negative",
            message: err.response.data,
          });

          if (err.response.data.error) {
            $q.notify({
              type: "negative",
              message: err.response.data.error,
            });
          }
        }
      } else {
        $q.notify({
          type: "negative",
          message:
            "Los datos no son válidos. Por favor, completa todos los campos.",
        });
        this.loading = true;
      }
    },
    changeQuantity(artist, cantHours, type) {
      if (type) {
        this.product.hours = cantHours + 1;
      } else {
        this.product.hours = cantHours - 1;
      }
    },
    removeDuplicates(arr) {
      const uniqueArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (uniqueArr.indexOf(arr[i]) === -1) {
          uniqueArr.push(arr[i]);
        }
      }
      return uniqueArr;
    },
    generosMusicales() {
      let genders = ["Todos"];
      if (
        Array.isArray(this.stateArtistList) &&
        this.stateArtistList.length > 0
      ) {
        this.stateArtistList.forEach((artist) => {
          artist.musical_genders.forEach((gender) => {
            genders.push(gender.name);
          });
        });
      }
      return this.removeDuplicates(genders);
    },
    filteredData() {
      let filtered = [];

      if (this.filterGender && this.filterGender !== "Todos") {
        filtered = this.stateArtistList.filter((artist) => {
          return artist.musical_genders.some(
            (gender) => gender.name === this.filterGender
          );
        });
      }
      return filtered.length > 0
        ? filtered.map((artist) => {
            return { label: artist.name, value: artist.id };
          })
        : [];
    },
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style lang="sass" scoped>
.shadow-box
  margin: 25px
  border-radius: 20px
  font-size: 12px
</style>
<style scoped>
.my-form {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
