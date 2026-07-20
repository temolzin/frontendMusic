<template>
  <div class="q-pa-md">
    <!-- Inicio de tabla -->
    <q-table
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :filter="filter"
      no-data-label="Sin registros"
      no-results-label="No hay registros que coincidan"
      rows-per-page-label="Géneros por página"
      :grid="$q.screen.lt.md"
      bordered
      flat
    >
      <template v-slot:top>
        <b class="text-h5">
          Géneros Musicales
          <q-btn
            color="primary"
            :disable="loading"
            label="Nuevo"
            icon-right="fas fa-plus"
            size="sm"
            @click="formCreate = true"
            v-if="auth.role[0] == 'administrador'"
          />
        </b>

        <q-space />

        <q-space />

        <q-input dense debounce="100" color="primary" v-model="filter">
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
          <q-td key="description" :props="props" class="ellipsis" style="max-width: 300px;">
            {{ props.row.description }}
            <q-tooltip class="bg-dark text-body2" max-width="300px">
              {{ props.row.description }}
            </q-tooltip>
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
              @click="showMusicalGender(props)"
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
              @click="removeMusicalGender(props)"
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
                      @click="showMusicalGender(props)"
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
                      @click="removeMusicalGender(props)"
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
    <!-- Fin de tabla -->
    <p style="display: none">
      {{ musicalGenders.name }}
    </p>
    <!-- Inicio de Formulario nuevo rol -->
    <section>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="formCreate" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Crear Nuevo Género Musical</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form
                @submit="createNewMusicalGender"
                @reset="onReset"
                class="q-gutter-md col-6"
              >
                <q-input
                  v-model="form.name"
                  label="Nombre del género musical *"
                  hint="Se recomiendo una sola palabra"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Ingresa el nombre',
                  ]"
                />

                <q-input
                  v-model="form.description"
                  label="Breve descripcion del género *"
                  hint="Se recomienda explicarlo de manera simple"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length >= 10) || 'Ingresa una descripción (mín. 10 caracteres)',
                  ]"
                />

                <q-select
                  v-model="form.color"
                  :options="options"
                  emit-value
                  map-options
                  style="max-width: 300px"
                  label="Selecciona el color del género de música"
                  :rules="[
                    (val) =>
                      (val && val.length != 0) ||
                      'Por favor selecciona al menos 1 opción',
                  ]"
                  lazy-rules
                >
                  <template v-slot:selected-item="scope">
                    <q-avatar
                      :color="scope.opt.value"
                      :icon="scope.opt.icon"
                      size="25px"
                      class="q-mr-sm"
                    />
                    {{ scope.opt.label }}
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon
                          :name="scope.opt.icon"
                          :color="scope.opt.value"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <q-file
                  v-model="form.image"
                  label="Imagen del género"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.bmp"
                  max-file-size="20971520"
                  filled
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="image" />
                  </template>
                  <template v-slot:hint>Máximo 20 MB</template>
                </q-file>

                <q-card-actions align="right" class="text-primary">
                  <q-btn
                    label="Cancelar"
                    type="reset"
                    color="primary"
                    flat
                    v-close-popup
                    class="q-ml-sm"
                  />
                  <q-btn label="Crear" type="submit" color="primary" />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </section>
    <!-- Fin de Formulario nuevo rol -->
    <!-- Inicio de Formulario editar rol -->
    <section>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="formEdit" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Editar Género Musical</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form
                @submit="editMusicalGender"
                @reset="onReset"
                class="q-gutter-md col-6"
              >
                <q-input
                  v-model="form.name"
                  label="Nombre del género musical *"
                  hint="Se recomiendo una sola palabra"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Ingresa el nombre',
                  ]"
                />

                <q-input
                  v-model="form.description"
                  label="Breve descripcion del género *"
                  hint="Se recomienda explicarlo de manera simple"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length >= 10) || 'Ingresa una descripción (mín. 10 caracteres)',
                  ]"
                />
                <q-select
                  v-model="form.color"
                  :options="options"
                  emit-value
                  map-options
                  style="max-width: 300px"
                  label="Selecciona el color del género de música"
                  :rules="[
                    (val) =>
                      (val && val.length != 0) ||
                      'Por favor selecciona al menos 1 opción',
                  ]"
                  lazy-rules
                >
                  <template v-slot:selected-item="scope">
                    <q-avatar
                      :color="scope.opt.value"
                      :icon="scope.opt.icon"
                      size="25px"
                      class="q-mr-sm"
                    />
                    {{ scope.opt.label }}
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon
                          :name="scope.opt.icon"
                          :color="scope.opt.value"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <q-img
                  v-if="form.image_url"
                  :src="form.image_url"
                  style="max-width: 200px; max-height: 120px"
                  class="q-mb-sm"
                />

                <q-file
                  v-model="form.image"
                  label="Cambiar imagen"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.bmp"
                  max-file-size="20971520"
                  filled
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="image" />
                  </template>
                  <template v-slot:hint>Máximo 20 MB</template>
                </q-file>

                <q-card-actions align="right" class="text-primary">
                  <q-btn
                    label="Cancelar"
                    type="reset"
                    color="primary"
                    flat
                    v-close-popup
                    class="q-ml-sm"
                  />
                  <q-btn label="Guardar" type="submit" color="primary" />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </section>
    <!-- Fin de Formulario editar rol -->
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
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
    name: "description",
    label: "Descripción",
    align: "left",
    field: "description",
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
  name: "Index",
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
        description: "",
        color: "",
        image: null,
      },
      options: [
        {
          label: "Anaranjado",
          value: "orange",
          icon: "circle",
        },
        {
          label: "Amarillo",
          value: "yellow",
          icon: "circle",
        },
        {
          label: "Aqua",
          value: "secondary",
          icon: "circle",
        },
        {
          label: "Azul",
          value: "primary",
          icon: "circle",
        },
        {
          label: "Gris",
          value: "blue-grey",
          icon: "circle",
        },
        {
          label: "Morado",
          value: "accent",
          icon: "circle",
        },
        {
          label: "Negro",
          value: "dark",
          icon: "circle",
        },
        {
          label: "Rojo",
          value: "red",
          icon: "circle",
        },
        {
          label: "Verde",
          value: "green",
          icon: "circle",
        },
      ],
    };
  },
  methods: {
    ...mapActions("musicalGenders", ["getMusicalGenders"]),
    ...mapActions("musicalGenders", ["createMusicalGender"]),
    ...mapActions("musicalGenders", ["deleteMusicalGender"]),
    ...mapActions("musicalGenders", ["updateMusicalGender"]),

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    },
    async gettMusicalGenders() {
      try {
        await this.getMusicalGenders();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async createNewMusicalGender() {
      const newName = this.form.name ? this.form.name.trim().toLowerCase() : "";

      const duplicateExists = this.rows.some(
        (row) => row.name.trim().toLowerCase() === newName
      );

      if (duplicateExists) {
        this.$q.notify({
          type: "negative",
          message: `El género musical "${this.form.name}" ya existe en el sistema.`,
          position: "bottom"
        });
        return;
      }
      try {
          const fd = new FormData();
          fd.append('name', this.form.name);
          fd.append('description', this.form.description);
          fd.append('color', this.form.color);
          if (this.form.image) fd.append('image', this.form.image);
          await this.createMusicalGender(fd);
          this.formCreate = false;
          this.onReset();
          this.$q.notify({
            type: "positive",
            message: `Género musical creado correctamente`,
          });
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    showMusicalGender(props) {
      try {
        this.formEdit = true;
        this.form.id = props.row.id;
        this.form.name = props.row.name;
        this.form.color = props.row.color;
        this.form.description = props.row.description;
        this.form.image = null;
        this.form.image_url = props.row.image;
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async editMusicalGender() {
      try {
        const fd = new FormData();
        fd.append('_method', 'PUT');
        fd.append('name', this.form.name);
        fd.append('description', this.form.description);
        fd.append('color', this.form.color);
        if (this.form.image) fd.append('image', this.form.image);
        await this.updateMusicalGender({ id: this.form.id, form: fd });
        this.formEdit = false;
        this.onReset();
        this.$q.notify({
          type: "positive",
          message: `Género musical modificado correctamente`,
        });
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    removeMusicalGender(props) {
      try {
        let id = props.row.id;
        let name = props.row.name;

        this.$q
          .dialog({
            title: "Mensaje de confirmación",
            message: `¿Estás seguro de eliminar el género musical ${name}?`,
            cancel: "Cancelar",
            ok: "Confirmar",
            persistent: true,
          })
          .onOk(() => {
            try {
              this.deleteMusicalGender(id);
              this.$q.notify({
                type: "positive",
                message: `Rol ${name} eliminado correctamente`,
              });
            } catch (err) {
              if (err.response.data.message) {
                $q.notify({
                  type: "negative",
                  message: err.response.data.message,
                });
              }
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    onReset() {
      this.form.id = null;
      this.form.name = null;
      this.form.description = null;
      this.form.color = null;
      this.form.image = null;
      this.form.image_url = null;
    },
  },
  created() {
    this.gettMusicalGenders();
  },
  computed: {
    ...mapState({
      musicalGenders: (state) => state.musicalGenders.musicalGenders,
    }),
    ...mapState({
      auth: (state) => state.auth.me,
    }),
  },
  mounted() {
    $q = useQuasar();
  },
  beforeUpdate() {
    this.rows = [...this.musicalGenders].sort((a, b) => b.id - a.id);
    this.loading = false;
  },
};
</script>
