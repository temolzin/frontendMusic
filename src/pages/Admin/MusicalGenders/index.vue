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
      no-results-label="Ningún registro coincidente"
    >
      <template v-slot:top>
        <b class="text-h5">
          Generos Musicales
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
          <q-td key="description" :props="props">
            {{ props.row.description }}
          </q-td>
          <q-td key="created_at" :props="props">
            {{ props.row.created_at }}
          </q-td>
          <q-td key="options" :props="props">
            <q-btn
              dense
              round
              flat
              color="primary"
              @click="showMusicalGender(props)"
              icon="edit"
              v-if="auth.role[0] == 'administrador'"
            ></q-btn>
            <q-btn
              dense
              round
              flat
              color="red"
              @click="removeMusicalGender(props)"
              icon="delete"
              v-if="auth.role[0] == 'administrador'"
            ></q-btn>
          </q-td>
        </q-tr>
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
              <div class="text-h6">Crear Nuevo Genero Musical</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form
                @submit="createNewMusicalGender"
                @reset="onReset"
                class="q-gutter-md col-6"
              >
                <q-input
                  v-model="form.name"
                  label="Nombre del genero musical *"
                  hint="Se recomiendo una sola palabra"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Ingresa el nombre',
                  ]"
                />

                <q-input
                  v-model="form.description"
                  label="Breve descripcion del rol *"
                  hint="Se recomienda explicarlo de manera simple"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Ingresa una descripción',
                  ]"
                />

                <q-select
                  v-model="form.color"
                  :options="options"
                  emit-value
                  map-options
                  style="max-width: 300px"
                  label="Selecciona el color de genero de música"
                  :rules="[
                    (val) =>
                      (val && val.length != 0) ||
                      'Por favor selecciona al menos 1 opcion',
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
              <div class="text-h6">Editar Genero Musical</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form
                @submit="editMusicalGender"
                @reset="onReset"
                class="q-gutter-md col-6"
              >
                <q-input
                  v-model="form.name"
                  label="Nombre del genero musical *"
                  hint="Se recomiendo una sola palabra"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Ingresa el nombre',
                  ]"
                />

                <q-input
                  v-model="form.description"
                  label="Breve descripcion del rol *"
                  hint="Se recomienda explicarlo de manera simple"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Ingresa una descripción',
                  ]"
                />
                <q-select
                  v-model="form.color"
                  :options="options"
                  emit-value
                  map-options
                  style="max-width: 300px"
                  label="Selecciona el color de genero de música"
                  :rules="[
                    (val) =>
                      (val && val.length != 0) ||
                      'Por favor selecciona al menos 1 opcion',
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
    align: "left",
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
    align: "left",
    field: "created_at",
    sortable: true,
  },
  {
    name: "options",
    label: "Acciones",
    align: "left",
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
      form: {
        id: "",
        name: "",
        description: "",
        color: "",
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
      try {
        await this.createMusicalGender(this.form);
        this.formCreate = false;
        this.onReset();
        this.$q.notify({
          type: "positive",
          message: `Genero musical creado correctamente`,
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
    showMusicalGender(props) {
      try {
        this.formEdit = true;
        this.form.id = props.row.id;
        this.form.name = props.row.name;
        this.form.color = props.row.color;
        this.form.description = props.row.description;
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
        await this.updateMusicalGender(this.form);
        this.formEdit = false;
        this.onReset();
        this.$q.notify({
          type: "positive",
          message: `Genero musical modificado correctamente`,
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
            message: `¿Estas seguro de eliminar el registro de ${name}`,
            cancel: true,
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
    this.rows = this.musicalGenders;
    this.loading = false;
  },
};
</script>
