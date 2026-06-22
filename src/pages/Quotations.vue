<template>
  <div
    class="col-12 col-md-6 flex content-center justify-center"
    :class="mode ? 'bg-modedark' : 'bg-primary'"
    v-bind:style="{ minHeight: '100vh', padding: '1em 0' }"
  >
    <q-card
      class="my-card shadow-box shadow-2"
      :class="`shadow-10`"
      flat
      v-bind:style="$q.screen.lt.sm ? { width: '100%', margin: '0' } : { width: '75%' }"
    >
      <q-card-section :horizontal="!$q.screen.lt.sm">
        <q-img
          v-show="!$q.screen.lt.sm"
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
              <img 
                :src="$q.dark.isActive ? '/vibeerlogowithouttext.png' : '/viberlogowithouttext-black.png'" 
                @click="$router.push('/')" 
                style="height: 64px; cursor: pointer; vertical-align: middle;"
              >
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
                  @update:model-value="loadOccupiedDates"
                >
                </q-select>
              </div>
              <div class="row-4">
                <p class="text-center q-mb-lg text-weight-regular text-h6">
                  Información específica del evento
                </p>

                <div class="row items-center justify-center">
                  <q-input filled v-model="newQuotation.event_date" class="full-width q-mb-md">
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
                            :locale="spanishLocale()"
                            @input="showDate = false"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Cerrar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <div class="row items-center justify-center no-wrap full-width q-mb-sm">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="remove_circle_outline"
                      @click="event_hours = Math.max(1, event_hours - 1)"
                    />
                    <div class="text-center text-h6 q-px-md">
                      {{ event_hours + " hora(s)" }}
                    </div>
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
                  :rules="[
                    (val) => !!val || 'La ciudad es requerida',
                    (val) => /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/.test(val) || 'La ciudad solo puede contener letras'
                  ]" required
                >
                </q-input>
                <q-input
                  v-model="newQuotation.address"
                  type="text"
                  label="Direccion *"
                  :rules="[
                    (val) => !!val || 'El domicilio es requerido',
                    (val) => val.trim().length >= 5 || 'El domicilio debe tener al menos 5 caracteres'
                  ]" required
                >
                </q-input>
                <q-toggle
                  v-model="googleMapsEnabled"
                  label="¿Deseas ubicar tu evento en el mapa?"
                  color="primary"
                  @update:model-value="onToggleMap"
                />
                <div v-if="googleMapsEnabled" class="col-12 q-mt-md">
                  <q-card flat bordered>
                    <q-card-section class="q-pa-sm text-center text-grey-7">
                      <small>Arrastra el marcador para ajustar la ubicación</small>
                    </q-card-section>
                    <q-card-section class="q-pa-sm">
                      <div ref="mapContainer" style="width: 100%; height: 320px; border-radius: 4px;"></div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
              <div class="row-5">
                <p class="text-center q-mb-lg text-weight-regular text-h6">
                  Contacto
                </p>

                <q-input
                  v-model="newQuotation.phone"
                  type="tel"
                  label="Telefono *"
                  maxlength="10"
                  @keypress="(e) => !/[0-9]/.test(e.key) && e.preventDefault()"
                  :rules="[
                    (val) => !!val || 'El teléfono es requerido',
                    (val) => /^[0-9]+$/.test(val) || 'Solo se permiten números',
                    (val) => val.toString().length === 10 || 'El teléfono debe tener exactamente 10 dígitos'
                  ]" required
                >
                </q-input>
                <q-input
                  v-model="newQuotation.email"
                  type="email"
                  label="Email *"
                  :rules="[
                    (val) => !!val || 'El email es requerido',
                    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido'
                  ]" required
                >
                </q-input>
                <q-input
                  v-model="newQuotation.full_name"
                  type="text"
                  label="Nombre *"
                  :rules="[
                    (val) => !!val || 'El nombre es requerido',
                    (val) => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                    (val) => /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/.test(val) || 'El nombre solo puede contener letras'
                  ]" required
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
import { api } from "boot/axios";

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
      googleMapsEnabled: false,
      latitude: null,
      longitude: null,
      googlePlaceId: null,
      googleMapsLoaded: false,
      userPosition: null,
      googleMapsApiKey: null,
      mapInstance: null,
      markerInstance: null,
      occupiedDates: [],
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
  created() {
    this.getArtists();
  },
  computed: {
    ...mapGetters("artistList", ["stateArtistList"]),
    ...mapGetters("quotations", ["stateQuotations"]),

    mode: function () {
      return this.$q.dark.isActive;
    },
    dateOption() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}/${mm}/${dd}`;

      return (date) => {
        const isValidDate = date >= todayStr;
        const isOccupied = this.occupiedDates.includes(date);
        return isValidDate && !isOccupied;
      };
    },
  },
  methods: {
    ...mapActions("artistList", ["getArtists"]),
    ...mapActions("quotations", ["newQuotations"]),

    async submitForm() {
      this.loading = false;

      const artistIdReal = this.newQuotation.artist_id ? this.newQuotation.artist_id.value : null;

      if (
        artistIdReal &&
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
          await this.newQuotations({ ...this.newQuotation, artist_id: artistIdReal, latitude: this.latitude, longitude: this.longitude, google_place_id: this.googlePlaceId });

          $q.notify({
            type: "positive",
            message: "Cotización registrada",
          });

          this.$router.push(this.$route.query.to || "/");
        } catch (err) {
          const errors = err.response?.data?.errors;
          let msg = err.response?.data?.message || "Error de conexión";
          if (errors) {
            const firstField = Object.keys(errors)[0];
            msg = errors[firstField][0];
          }

          $q.notify({
            type: "negative",
            message: msg,
          });
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
    async onToggleMap(val) {
      if (val) {
        await this.loadGoogleMapsApi();
        const pos = await this.getCurrentPosition();
        this.userPosition = pos;
        this.$nextTick(() => this.initMap());
      }
      if (!val) {
        this.latitude = null;
        this.longitude = null;
        this.googlePlaceId = null;
      }
    },
    getCurrentPosition() {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve({ lat: 19.4326, lng: -99.1332 });
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve({ lat: 19.4326, lng: -99.1332 }),
          { timeout: 5000, enableHighAccuracy: false }
        );
      });
    },
    spanishLocale() {
      return {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        firstDayOfWeek: 1
      };
    },
    async loadGoogleMapsApi() {
      if (window.google || this.googleMapsLoaded) return;
      try {
        const res = await this.$api.get('/api/google-maps-key');
        this.googleMapsApiKey = res.data.data?.google_maps_api_key;
      } catch {
        this.googleMapsApiKey = null;
        return;
      }
      if (!this.googleMapsApiKey) return;
      this.googleMapsLoaded = true;
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places&language=es`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    },
    initMap() {
      if (!this.$refs.mapContainer) return;
      const defaultPos = this.userPosition || { lat: 19.4326, lng: -99.1332 };
      this.initMapAtPosition(defaultPos);
    },
    initMapAtPosition(position) {
      if (!this.$refs.mapContainer || !window.google) return;
      this.mapInstance = new google.maps.Map(this.$refs.mapContainer, {
        center: position,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });
      this.markerInstance = new google.maps.Marker({
        map: this.mapInstance,
        position: position,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });
      const onMarkerMoved = (latLng) => {
        this.latitude = latLng.lat();
        this.longitude = latLng.lng();
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: this.latitude, lng: this.longitude } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            this.fillAddressFromGeocodeResult(results[0]);
          }
        });
      };
      this.markerInstance.addListener('dragend', () => {
        onMarkerMoved(this.markerInstance.getPosition());
      });
      this.mapInstance.addListener('click', (e) => {
        this.markerInstance.setPosition(e.latLng);
        this.mapInstance.panTo(e.latLng);
        onMarkerMoved(e.latLng);
      });
      if (!this.latitude) {
        this.latitude = position.lat;
        this.longitude = position.lng;
      }
    },
    fillAddressFromGeocodeResult(result) {
      this.googlePlaceId = result.place_id || null;
      const componentMap = {};
      for (const comp of result.address_components) {
        componentMap[comp.types[0]] = comp.long_name;
      }
      this.newQuotation.city = componentMap['locality'] || componentMap['sublocality'] || componentMap['postal_town'] || '';
      this.newQuotation.address = result.formatted_address || '';
    },
    async loadOccupiedDates() {
      const artistId = this.newQuotation.artist_id?.value;
      if (!artistId) return;
      try {
        const response = await api.get(`/api/artist-sales/public?artist_id=${artistId}`);
        if (response.data?.sales && Array.isArray(response.data.sales)) {
          this.occupiedDates = response.data.sales.map((sale) => {
            const dateVal = sale.event_date;
            if (!dateVal) return null;
            const dateStr = dateVal.toString();
            const datePart = dateStr.split('T')[0].split(' ')[0];
            const [y, mRaw, dRaw] = datePart.split('-');
            return `${y}/${String(mRaw).padStart(2, '0')}/${String(dRaw).padStart(2, '0')}`;
          }).filter(d => d !== null);
        }
      } catch {
        this.occupiedDates = [];
      }
    },
    filteredData() {
      let filtered = [];

      if (this.filterGender && this.filterGender !== "Todos") {
        filtered = this.stateArtistList.filter?.((artist) => {
          return artist.musical_genders?.some?.(
            (gender) => gender.name === this.filterGender
          );
        }) ?? [];
      }
      if (!this.filterGender || this.filterGender === "Todos") {
        filtered = Array.isArray(this.stateArtistList) ? this.stateArtistList : [];
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
