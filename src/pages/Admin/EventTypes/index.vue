<template>
  <div class="q-pa-md">
    <PageBreadcrumbs :items="[{ label: 'Tipos de Evento', icon: 'celebration' }]" />
    <q-table
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :filter="filter"
      no-data-label="Sin registros"
      no-results-label="No hay registros que coincidan"
      rows-per-page-label="Tipos por página"
      :rows-per-page-options="[10, 20, 30, 0]"
      :grid="$q.screen.lt.md"
      bordered
      flat
    >
      <template v-slot:top>
        <b class="text-h5">
          Tipos de Evento
          <q-btn
            color="primary"
            :disable="loading"
            style="border-radius: 8px; font-weight: bold;"
            label="Nuevo"
            icon="fas fa-plus"
            size="sm"
            @click="formCreate = true"
            v-if="auth.role[0] == 'administrador'"
          />
        </b>

        <q-space />

        <q-space />

        <q-input dense debounce="100" color="primary" v-model="filter" placeholder="Buscar en tipos de evento...">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="slug" :props="props">
            {{ props.row.slug }}
          </q-td>
          <q-td key="created_at" :props="props">
            {{ formatDate(props.row.created_at) }}
          </q-td>
          <q-td key="options" :props="props">
            <q-btn
              round
              unelevated
              color="primary"
              size="sm"
              @click="showEventType(props)"
              icon="edit"
              v-if="auth.role[0] == 'administrador'"
              class="q-mr-sm"
            >
              <q-tooltip class="bg-primary text-body2">Editar</q-tooltip>
            </q-btn>
            <q-btn
              round
              unelevated
              color="negative"
              size="sm"
              @click="removeEventType(props)"
              icon="delete"
              v-if="auth.role[0] == 'administrador'"
            >
              <q-tooltip class="bg-negative text-body2">Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="q-pa-sm">
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label caption>{{ col.label }}</q-item-label>
                  <q-item-label v-if="col.name === 'options'">
                    <q-btn
                      round
                      unelevated
                      color="primary"
                      size="sm"
                      @click="showEventType(props)"
                      icon="edit"
                      v-if="auth.role[0] == 'administrador'"
                      class="q-mr-sm"
                    >
                      <q-tooltip class="bg-primary text-body2">Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      round
                      unelevated
                      color="negative"
                      size="sm"
                      @click="removeEventType(props)"
                      icon="delete"
                      v-if="auth.role[0] == 'administrador'"
                    >
                      <q-tooltip class="bg-negative text-body2">Eliminar</q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label v-else-if="col.name === 'created_at'">
                    {{ formatDate(props.row.created_at) }}
                  </q-item-label>
                  <q-item-label v-else>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <section>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="formCreate" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Crear Nuevo Tipo de Evento</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form @submit="createNewEventType" @reset="onReset" class="q-gutter-md col-6">
                <q-input
                  v-model="form.name"
                  label="Nombre del tipo de evento *"
                  lazy-rules
                  autofocus
                  :rules="[
                    (val) => (val && val.trim().length > 0) || 'Ingresa el nombre',
                  ]"
                />

                <q-card-actions align="right" class="text-primary">
                  <q-btn label="Cancelar" type="reset" color="primary" flat v-close-popup class="q-ml-sm" />
                  <q-btn label="Crear" type="submit" color="primary" />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </section>

    <section>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="formEdit" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Editar Tipo de Evento</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form @submit="editEventType" @reset="onReset" class="q-gutter-md col-6">
                <q-input
                  v-model="form.name"
                  label="Nombre del tipo de evento *"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.trim().length > 0) || 'Ingresa el nombre',
                  ]"
                />

                <q-card-actions align="right" class="text-primary">
                  <q-btn label="Cancelar" type="reset" color="primary" flat v-close-popup class="q-ml-sm" />
                  <q-btn label="Guardar" type="submit" color="primary" />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </section>
  </div>
</template>

<script>
import PageBreadcrumbs from "src/components/PageBreadcrumbs.vue";
import { useQuasar } from "quasar";
import { mapState } from "vuex";
import { api } from "boot/axios";
import { notifySuccess, notifyError } from "src/utils/notify";
import { formatDate } from "src/utils/formatDate";

let $q;

const columns = [
  {
    name: "id",
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
  },
  {
    name: "name",
    label: "Nombre",
    align: "center",
    field: "name",
    sortable: true,
  },
  {
    name: "slug",
    label: "Slug",
    align: "center",
    field: "slug",
    sortable: true,
  },
  {
    name: "created_at",
    label: "Creado desde",
    align: "center",
    field: "created_at",
    sortable: true,
  },
  {
    name: "options",
    label: "Acciones",
    align: "center",
    field: "options",
    sortable: true,
  },
];

let rows = [];

export default {
  components: { PageBreadcrumbs },
  name: "EventTypesIndex",
  data() {
    return {
      loading: true,
      columns,
      rows,
      filter: "",
      formEdit: false,
      formCreate: false,
      pagination: {
        sortBy: "created_at",
        descending: true,
        rowsPerPage: 10,
      },
      form: {
        id: "",
        name: "",
      },
    };
  },
  methods: {
    async loadEventTypes() {
      try {
        const response = await api.get("/api/admin/event-types");
        this.rows = response.data?.eventTypes || [];
      } catch (err) {
        const message = err.response?.data?.message || "Error al cargar los tipos de evento.";
        notifyError(message);
      } finally {
        this.loading = false;
      }
    },
    async createNewEventType() {
      try {
        const payload = { name: this.form.name.trim() };
        await api.post("/api/admin/event-types", payload);
        this.formCreate = false;
        this.onReset();
        notifySuccess(`Tipo de evento creado correctamente`);
        await this.loadEventTypes();
      } catch (err) {
        const message = err.response?.data?.message || "Error al crear el tipo de evento.";
        notifyError(message);
      }
    },
    showEventType(props) {
      this.formEdit = true;
      this.form.id = props.row.id;
      this.form.name = props.row.name;
    },
    async editEventType() {
      try {
        const payload = { name: this.form.name.trim() };
        await api.put(`/api/admin/event-types/${this.form.id}`, payload);
        this.formEdit = false;
        this.onReset();
        notifySuccess(`Tipo de evento modificado correctamente`);
        await this.loadEventTypes();
      } catch (err) {
        const message = err.response?.data?.message || "Error al modificar el tipo de evento.";
        notifyError(message);
      }
    },
    removeEventType(props) {
      let id = props.row.id;
      let name = props.row.name;

      this.$q
        .dialog({
          title: "Mensaje de confirmación",
          message: `¿Estás seguro de eliminar el tipo de evento ${name}?`,
          cancel: "Cancelar",
          ok: "Confirmar",
          persistent: true,
        })
        .onOk(async () => {
          try {
            await api.delete(`/api/admin/event-types/${id}`);
            notifySuccess(`Tipo de evento ${name} eliminado correctamente`);
            await this.loadEventTypes();
          } catch (err) {
            const message = err.response?.data?.message || "Error al eliminar el tipo de evento.";
            notifyError(message);
          }
        });
    },
    onReset() {
      this.form.id = null;
      this.form.name = null;
    },
    formatDate(date) {
      return formatDate(date);
    },
  },
  created() {
    this.loadEventTypes();
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth.me,
    }),
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>
