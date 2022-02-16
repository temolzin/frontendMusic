<template>
  <div class="q-pa-md">
    <!-- Inicio de Tabla -->
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
          Roles
          <q-btn
            color="primary"
            :disable="loading"
            label="Nuevo"
            icon-right="fas fa-plus"
            size="sm"
            @click="formCreate = true"
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
              @click="showRole(props)"
              icon="edit"
            ></q-btn>
            <q-btn
              dense
              round
              flat
              color="red"
              @click="removeRole(props)"
              icon="delete"
            ></q-btn>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
    <!-- Fin de Tabla -->
  </div>
  <p style="display: none">
    {{ roles.name }}
  </p>
  <!-- Inicio de Formulario nuevo rol -->
  <section>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="formCreate" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Crear rol "{{ form.name }}"</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form @submit="createNewRole" class="q-gutter-md col-6">
              <q-input
                v-model="form.name"
                label="Nombre del rol *"
                hint="Se recomiendo una sola palabra"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Ingresa el nombre',
                ]"
              />

              <q-input
                v-model="form.description"
                label="Breve descripcion del rol *"
                hint="Se recomiendo una sola palabra"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Ingresa una descripción',
                ]"
              />

              <div>
                <q-select
                  v-model="form.selection"
                  for="permission"
                  :option-value="
                    (opt) =>
                      Object(opt) === opt && 'permission_id' in opt
                        ? opt.permission_id
                        : null
                  "
                  :option-label="
                    (opt) =>
                      Object(opt) === opt && 'name' in opt
                        ? opt.name
                        : '- Null -'
                  "
                  emit-value
                  map-options
                  multiple
                  options-dense
                  use-chips
                  filled
                  hint="Selecciona los permisos que tendra el rol"
                  color="primary"
                  :loading="false"
                  clear-icon
                  counter
                  :rules="[
                    (val) =>
                      val.length > 1 ||
                      'Por favor selecciona al menos 2 opciones',
                  ]"
                  :options="permissions"
                />
              </div>

              <q-card-actions align="right" class="text-primary">
                <q-btn
                  label="Cancelar"
                  type="cancel"
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
            <div class="text-h6">Editar rol "{{ form.name }}"</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <form class="q-gutter-md">
              <q-input
                dense
                v-model="form.name"
                autofocus
                label="Nombre completo"
                :rules="[(val) => !!val || 'Field is required']"
              />
              <q-input
                dense
                v-model="form.description"
                label="Correo electrónico"
                :rules="[(val) => !!val || 'Field is required']"
              />
              <!-- Select -->
              <q-select
                v-model="form.selection"
                for="permission"
                :option-value="
                  (opt) =>
                    Object(opt) === opt && 'permission_id' in opt
                      ? opt.permission_id
                      : null
                "
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'name' in opt ? opt.name : '- Null -'
                "
                emit-value
                map-options
                multiple
                options-dense
                use-chips
                filled
                hint="Selecciona los permisos que tendra el rol"
                color="primary"
                :loading="false"
                clear-icon
                counter
                :rules="[
                  (val) =>
                    val.length > 1 ||
                    'Por favor selecciona al menos 2 opciones',
                ]"
                :options="permissions"
              />
              <!-- Fin Select -->
            </form>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup @click="onReset" />
            <q-btn
              flat
              label="Submit"
              type="submit"
              v-close-popup
              v-on:click="editRole"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </section>
  <!-- Fin de Formulario editar rol -->
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
        selection: [],
      },
    };
  },
  methods: {
    ...mapActions("roles", ["getRoles"]),
    ...mapActions("roles", ["deleteRole"]),
    ...mapActions("roles", ["getPermissions"]),
    ...mapActions("roles", ["updateRole"]),
    ...mapActions("roles", ["createRole"]),
    async gettRoles() {
      try {
        await this.getRoles();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    removeRole(props) {
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
              this.deleteRole(id);
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
    showRole(props) {
      let selected = [props.row];
      try {
        this.formEdit = true;
        for (let i = 0; i < selected.length; i++) {
          this.form.id = selected[i].id;
          this.form.name = selected[i].name;
          this.form.description = selected[i].description;
          //Permissions
          for (let j = 0; j < selected[i].permissions.length; j++) {
            this.form.selection.push(selected[i].permissions[j].id);
          }
        }
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async editRole() {
      try {
        await this.updateRole(this.form);
        this.onReset();
        this.$q.notify({
          type: "positive",
          message: `Rol modificado correctamente`,
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
    async gettPermissions() {
      try {
        await this.getPermissions();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },

    async createNewRole() {
      this.formCreate = false;
      try {
        await this.createRole(this.form);
        this.formCreate = false;
        this.onReset();
        this.$q.notify({
          type: "positive",
          message: `Rol creado correctamente`,
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

    onReset() {
      this.form.id = null;
      this.form.name = null;
      this.form.description = null;
      this.form.selection = [];
    },
  },

  created() {
    this.gettRoles();
    this.gettPermissions();
  },
  computed: {
    ...mapState({
      roles: (state) => state.roles.roles,
    }),
    ...mapState({
      permissions: (state) => state.roles.permissions,
    }),
  },
  mounted() {
    $q = useQuasar();
  },
  beforeUpdate() {
    this.rows = this.roles;
    this.loading = false;
  },
};
</script>
