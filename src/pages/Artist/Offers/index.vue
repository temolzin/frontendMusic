<template>
  <q-page class="q-pa-lg">
    <q-table
      :rows="offers"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      no-data-label="No tienes ofertas registradas"
      rows-per-page-label="Registros por página"
      :rows-per-page-options="[10, 20, 30, 0]"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
      :grid="$q.screen.lt.md"
      bordered
      flat
    >
      <template v-slot:top>
        <b class="text-h5">
          Mis Ofertas
          <q-btn
          color="primary"
          style="border-radius: 8px; font-weight: bold;"
          icon="fas fa-plus"
          label="Nueva Oferta"
          size="sm"
          @click="openForm()"
        />
        </b>
        <q-space />
        <q-input dense debounce="100" color="primary" v-model="filter" placeholder="Buscar en ofertas...">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-is_active="props">
        <q-td :props="props">
          <q-badge v-bind="getOfferStatusColor(props.row.is_active, $q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
            {{ props.row.is_active ? 'Activa' : 'Inactiva' }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-discount_percentage="props">
        <q-td :props="props">
          <div class="row items-center justify-center q-gutter-sm">
            <span class="text-negative text-strike">{{ formatCurrency(props.row.original_price) }}</span>
            <q-icon name="arrow_forward" size="xs" class="text-grey-7" />
            <span class="text-primary text-weight-bold">{{ formatCurrency(props.row.discounted_price) }}</span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-start_date="props">
        <q-td :props="props">
          {{ formatDate(props.row.start_date) }}
        </q-td>
      </template>

      <template v-slot:body-cell-end_date="props">
        <q-td :props="props">
          {{ formatDate(props.row.end_date) }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn 
            round 
            unelevated 
            icon="edit" 
            color="primary" 
            size="sm"
            @click="openForm(props.row)"
            class="q-mr-sm"
          >
            <q-tooltip class="bg-primary text-body2">Editar</q-tooltip>
          </q-btn>
          <q-btn
            round
            unelevated
            icon="delete"
            color="negative"
            size="sm"
            :disable="props.row.has_pending_sale"
            @click="confirmDelete(props.row.id)"
          >
            <q-tooltip v-if="props.row.has_pending_sale" class="bg-negative text-body2">
              No se puede eliminar: hay una venta esperando respuesta del artista que usó esta oferta.
            </q-tooltip>
            <q-tooltip v-else class="bg-negative text-body2">Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="q-pa-sm">
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label caption>{{ col.label }}</q-item-label>
                  <q-item-label v-if="col.name === 'is_active'">
                    <q-badge v-bind="getOfferStatusColor(props.row.is_active, $q.dark.isActive)" class="q-px-sm q-py-xs text-weight-medium text-uppercase">
                      {{ props.row.is_active ? 'Activa' : 'Inactiva' }}
                    </q-badge>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'discount_percentage'">
                    <div class="row items-center q-gutter-sm">
                      <span class="text-negative text-strike">{{ formatCurrency(props.row.original_price) }}</span>
                      <q-icon name="arrow_forward" size="xs" class="text-grey-7" />
                      <span class="text-primary text-weight-bold">{{ formatCurrency(props.row.discounted_price) }}</span>
                    </div>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'start_date'">
                    {{ formatDate(props.row.start_date) }}
                  </q-item-label>
                  <q-item-label v-if="col.name === 'end_date'">
                    {{ formatDate(props.row.end_date) }}
                  </q-item-label>
                  <q-item-label v-if="col.name === 'actions'">
                    <q-btn 
                      round 
                      unelevated 
                      icon="edit" 
                      color="primary" 
                      size="sm"
                      @click="openForm(props.row)"
                      class="q-mr-sm"
                    >
                      <q-tooltip class="bg-primary text-body2">Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      round
                      unelevated
                      icon="delete"
                      color="negative"
                      size="sm"
                      :disable="props.row.has_pending_sale"
                      @click="confirmDelete(props.row.id)"
                    >
                      <q-tooltip v-if="props.row.has_pending_sale" class="bg-negative text-body2">
                        No se puede eliminar: hay una venta esperando respuesta del artista que usó esta oferta.
                      </q-tooltip>
                      <q-tooltip v-else class="bg-negative text-body2">Eliminar</q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label v-if="col.name !== 'is_active' && col.name !== 'discount_percentage' && col.name !== 'start_date' && col.name !== 'end_date' && col.name !== 'actions'">
                    {{ col.value }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="formDialog" persistent>
      <q-card style="width: 100%; max-width: 400px;">
        <q-card-section>
          <div class="text-h6">{{ editingOffer ? 'Editar Oferta' : 'Nueva Oferta' }}</div>
        </q-card-section>
        <q-form ref="offerForm">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="form.description"
              label="Descripción"
              outlined
              type="textarea"
              rows="2"
              :rules="[val => !!val || 'La descripción es requerida']"
            />
            <q-input
              v-model="form.discount_percentage"
              label="Descuento (%)"
              outlined
              type="number"
              min="1"
              max="90" :rules="[
                val => !!val || 'El descuento es requerido',
                val => val >= 1 || 'El descuento mínimo es 1%',
                val => val <= 90 || 'El descuento no puede ser mayor al 90%' ]"
            />
            <div class="row q-gutter-md">
              <div class="col">
                <div class="text-caption text-grey-7 q-mb-xs">Fecha inicio</div>
                <q-input
                  v-model="form.start_date_only"
                  outlined
                  readonly
                  :rules="[val => !!val || 'La fecha es requerida']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="form.start_date_only"
                          :options="optionsStartDate"
                          :locale="spanishLocale()"
                        >
                          <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <div class="text-caption text-grey-7 q-mb-xs">Hora inicio</div>
                <q-input
                  v-model="form.start_time_only"
                  outlined
                  readonly
                  :rules="[val => !!val || 'La hora es requerida']"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time
                          v-model="form.start_time_only"
                          :options="optionsStartTime"
                          format24h
                        >
                          <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-gutter-md">
              <div class="col">
                <div class="text-caption text-grey-7 q-mb-xs">Fecha fin</div>
                <q-input
                  v-model="form.end_date_only"
                  outlined
                  readonly
                  :rules="[val => !!val || 'La fecha es requerida']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="form.end_date_only"
                          :options="optionsEndDate"
                          :locale="spanishLocale()"
                        >
                          <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <div class="text-caption text-grey-7 q-mb-xs">Hora fin</div>
                <q-input
                  v-model="form.end_time_only"
                  outlined
                  readonly
                  :rules="[val => !!val || 'La hora es requerida']"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time
                          v-model="form.end_time_only"
                          :options="optionsEndTime"
                          format24h
                        >
                          <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" style="border-radius: 8px; font-weight: bold;" v-close-popup />
            <q-btn
              label="Guardar"
              color="primary"
              style="border-radius: 8px; font-weight: bold;"
              @click="$refs.offerForm.validate().then(valid => { if(valid) submitForm() })"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { notifySuccess, notifyError } from "src/utils/notify";
import { getOfferStatusColor } from "src/utils/badgeStyles";
import { formatCurrency } from "src/utils/currency";

export default {
  name: "ArtistOffers",
  data() {
    return {
      loading: false,
      filter: "",
      formDialog: false,
      editingOffer: null,
      form: {
        description: "",
        discount_percentage: "",
        start_date_only: "",
        start_time_only: "",
        end_date_only: "",
        end_time_only: ""
      },
      columns: [
        { name: "description", label: "Descripción", field: "description", align: "center" },
        { name: "discount_percentage", label: "Antes → Ahora", field: "discount_percentage", align: "center" },
        { name: "start_date", label: "Fecha inicio", field: "start_date", align: "center" },
        { name: "end_date", label: "Fecha fin", field: "end_date", align: "center" },
        { name: "is_active", label: "Estado", field: "is_active", align: "center" },
        { name: "actions", label: "Acciones", field: "actions", align: "center" },
      ],
    };
  },
  computed: {
    ...mapState({ offers: (state) => state.offers.offers }),
    mode() { return this.$q.dark.isActive; },
  },
  methods: {
    getOfferStatusColor,
    formatCurrency,
    ...mapActions("offers", ["getOffers", "createOffer", "updateOffer", "deleteOffer"]),

    isValidFutureDateTime(dateTimeStr) {
      if (!dateTimeStr) return true;

      const selectedDateTime = new Date(dateTimeStr);
      const now = new Date();

      now.setSeconds(0, 0);
      selectedDateTime.setSeconds(0, 0);

      return selectedDateTime > now;
    },

    spanishLocale() {
      return {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        firstDayOfWeek: 0,
        format24h: true
      };
    },

    optionsStartDate(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [year, month, day] = date.split('/');
      const selectedDate = new Date(year, month - 1, day);
      return selectedDate >= today;
    },

    optionsStartTime(hour, minute) {
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = this.form.start_date_only;
      if (!selectedDate) return true;

      const [year, month, day] = selectedDate.split('/');
      const selected = new Date(year, month - 1, day, hour, minute);

      return selected > now;
    },

    optionsEndDate(date) {
      const startDate = this.form.start_date_only;
      if (!startDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [year, month, day] = date.split('/');
        const selectedDate = new Date(year, month - 1, day);
        return selectedDate >= today;
      }

      const [sYear, sMonth, sDay] = startDate.split('/');
      const start = new Date(sYear, sMonth - 1, sDay);

      const [year, month, day] = date.split('/');
      const selectedDate = new Date(year, month - 1, day);

      return selectedDate >= start;
    },

    optionsEndTime(hour, minute) {
      const startDate = this.form.start_date_only;
      const startTime = this.form.start_time_only;
      const endDate = this.form.end_date_only;

      if (!startDate || !startTime || !endDate) return true;

      const [sYear, sMonth, sDay] = startDate.split('/');
      const [sHour, sMinute] = startTime.split(':');
      const startDateTime = new Date(sYear, sMonth - 1, sDay, sHour, sMinute);

      const [eYear, eMonth, eDay] = endDate.split('/');
      const endDateTime = new Date(eYear, eMonth - 1, eDay, hour, minute);

      return endDateTime > startDateTime;
    },

    openForm(offer = null) {
      this.editingOffer = offer;
      if (offer) {
        const pad = (n) => String(n).padStart(2, '0');
        const toDateOnly = (d) => `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
        const toTimeOnly = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

        const start = new Date(offer.start_date);
        const end = new Date(offer.end_date);

        this.form = {
          description: offer.description,
          discount_percentage: offer.discount_percentage,
          start_date_only: toDateOnly(start),
          start_time_only: toTimeOnly(start),
          end_date_only: toDateOnly(end),
          end_time_only: toTimeOnly(end)
        };
      } else {
        this.form = {description: "", discount_percentage: "", start_date_only: "", start_time_only: "", end_date_only: "", end_time_only: ""};
      }
      this.formDialog = true;
    },

    async submitForm() {
      const valid = await this.$refs.offerForm.validate();
      if (!valid) return;

      const convertDate = (dateStr) => dateStr.replace(/\//g, '-');

      const start_date = `${convertDate(this.form.start_date_only)} ${this.form.start_time_only}:00`;
      const end_date = `${convertDate(this.form.end_date_only)} ${this.form.end_time_only}:00`;

      const payload = {
        description: this.form.description,
        discount_percentage: this.form.discount_percentage,
        start_date: start_date,
        end_date: end_date
      };

      this.loading = true;
      try {
        await (this.editingOffer 
        ? this.updateOffer({ id: this.editingOffer.id, ...payload })
        : this.createOffer(payload));

      notifySuccess(this.editingOffer ? 'Oferta actualizada' : 'Oferta creada');
        this.formDialog = false;
        await this.getOffers();
      } catch (err) {
        notifyError(err.response?.data?.message || 'Error al guardar');
      } finally {
        this.loading = false;
      }
    },

    confirmDelete(id) {
      this.$q.dialog({
        title: "Confirmar",
        message: "¿Eliminar esta oferta?",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await this.deleteOffer(id);
          notifySuccess("Oferta eliminada");
        } catch (err) {
          notifyError(err?.response?.data?.message || "Error al eliminar la oferta");
        }
      });
    },

    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "2-digit" });
    },
  },
  mounted() {
    this.getOffers().catch((err) => {
      notifyError(err?.response?.data?.message || "No se pudieron cargar las ofertas");
    });
  },
};
</script>

<style scoped>
.tipogra { font-family: "Josefin Sans", sans-serif; font-size: 40px; font-weight: 400; color: #001d38; margin: 0; }
.tipogra-white { font-family: "Josefin Sans", sans-serif; font-size: 40px; font-weight: 400; color: #e2e2e2; margin: 0; }
</style>
