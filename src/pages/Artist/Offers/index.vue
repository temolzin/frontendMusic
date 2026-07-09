<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-lg">
      <h3 :class="mode ? 'tipogra-white' : 'tipogra'" class="col">Mis Ofertas</h3>
      <q-btn color="primary" icon="add" label="Nueva Oferta" @click="openForm()" />
    </div>

    <q-table
      :rows="offers"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="No tienes ofertas registradas"
      rows-per-page-label="Registros por página"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
      :grid="$q.screen.lt.md"
    >
      <template v-slot:body-cell-is_active="props">
        <q-td :props="props">
          <q-badge :color="props.row.is_active ? 'positive' : 'grey'">
            {{ props.row.is_active ? 'Activa' : 'Inactiva' }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-discount_percentage="props">
        <q-td :props="props">
          {{ props.row.discount_percentage }}%
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
          <q-btn flat round icon="edit" color="primary" @click="openForm(props.row)" />
          <q-btn
            flat
            round
            icon="delete"
            color="negative"
            :disable="props.row.has_pending_sale"
            @click="confirmDelete(props.row.id)"
          >
            <q-tooltip v-if="props.row.has_pending_sale" class="bg-negative text-body2">
              No se puede eliminar: hay una venta esperando respuesta del artista que usó esta oferta.
            </q-tooltip>
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
                    <q-badge :color="props.row.is_active ? 'positive' : 'grey'">
                      {{ props.row.is_active ? 'Activa' : 'Inactiva' }}
                    </q-badge>
                  </q-item-label>
                  <q-item-label v-if="col.name === 'discount_percentage'">
                    {{ props.row.discount_percentage }}%
                  </q-item-label>
                  <q-item-label v-if="col.name === 'start_date'">
                    {{ formatDate(props.row.start_date) }}
                  </q-item-label>
                  <q-item-label v-if="col.name === 'end_date'">
                    {{ formatDate(props.row.end_date) }}
                  </q-item-label>
                  <q-item-label v-if="col.name === 'actions'">
                    <q-btn flat round icon="edit" color="primary" @click="openForm(props.row)" />
                    <q-btn
                      flat
                      round
                      icon="delete"
                      color="negative"
                      :disable="props.row.has_pending_sale"
                      @click="confirmDelete(props.row.id)"
                    >
                      <q-tooltip v-if="props.row.has_pending_sale" class="bg-negative text-body2">
                        No se puede eliminar: hay una venta esperando respuesta del artista que usó esta oferta.
                      </q-tooltip>
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
            <div>
              <div class="text-caption text-grey-7 q-mb-xs">Fecha inicio</div>
              <q-input
                v-model="form.start_date"
                outlined
                type="datetime-local"
                :rules="[val => !!val || 'La fecha de inicio es requerida']"
              />
            </div>
            <div>
              <div class="text-caption text-grey-7 q-mb-xs">Fecha fin</div>
              <q-input
                v-model="form.end_date"
                outlined
                type="datetime-local"
                :rules="[
                  val => !!val || 'La fecha de fin es requerida',
                  val => !form.start_date || val > form.start_date || 'La fecha de fin debe ser posterior a la fecha de inicio'
                ]"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn
              label="Guardar"
              color="primary"
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

export default {
  name: "ArtistOffers",
  data() {
    return {
      loading: false,
      formDialog: false,
      editingOffer: null,
      form: {
        description: "",
        discount_percentage: "",
        start_date: "",
        end_date: "",
      },
      columns: [
        { name: "description", label: "Descripción", field: "description", align: "left" },
        { name: "discount_percentage", label: "Descuento", field: "discount_percentage", align: "center" },
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
    ...mapActions("offers", ["getOffers", "createOffer", "updateOffer", "deleteOffer"]),

    openForm(offer = null) {
      this.editingOffer = offer;
      if (offer) {
        this.form = {
          description: offer.description,
          discount_percentage: offer.discount_percentage,
          start_date: offer.start_date?.slice(0, 16),
          end_date: offer.end_date?.slice(0, 16),
        };
      } else {
        this.form = { description: "", discount_percentage: "", start_date: "", end_date: "" };
      }
      this.formDialog = true;
    },

    async submitForm() {
      try {
        const action = this.editingOffer
            ? this.updateOffer({ id: this.editingOffer.id, data: this.form })
            : this.createOffer(this.form);
        await action;
        this.$q.notify({ type: "positive", message: "Oferta guardada correctamente" });
        this.formDialog = false;
      } catch (err) {
        this.$q.notify({ type: "negative", message: err?.response?.data?.message || "Error al guardar la oferta" });
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
          this.$q.notify({ type: "positive", message: "Oferta eliminada" });
        } catch (err) {
          this.$q.notify({ type: "negative", message: err?.response?.data?.message || "Error al eliminar la oferta" });
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
      this.$q.notify({
        type: "negative",
        message: err?.response?.data?.message || "No se pudieron cargar las ofertas",
      });
    });
  },
};
</script>

<style scoped>
.tipogra { font-family: "Josefin Sans", sans-serif; font-size: 40px; font-weight: 400; color: #001d38; margin: 0; }
.tipogra-white { font-family: "Josefin Sans", sans-serif; font-size: 40px; font-weight: 400; color: #e2e2e2; margin: 0; }
</style>
