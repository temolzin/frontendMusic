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
      no-results-label="No hay registros que coincidan."
      rows-per-page-label="Usuarios por página"
      :grid="$q.screen.lt.md"
    >
      <template v-slot:top>
        <b class="text-h5">
          Usuarios
          <q-btn
            color="primary"
            :disable="loading"
            label="Nuevo"
            icon-right="fas fa-plus"
            size="sm"
            @click="clearForm(); formCreate = true"
            v-if="$can('create-users')"
          />
        </b>
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
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="role_name" :props="props">
            {{ props.row.role_name }}
          </q-td>
          <q-td key="created_at" :props="props">
            {{ formatDate(props.row.created_at) }}
          </q-td>
          <q-td key="options" :props="props">
            <q-btn
              dense
              round
              flat
              color="primary"
              @click="showUser(props)"
              icon="edit"
            ></q-btn>
            <q-btn
              dense
              round
              flat
              color="red"
              @click="removeUser(props)"
              icon="delete"
            ></q-btn>
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
                    <q-btn dense round flat color="primary" @click="showUser(props)" icon="edit"></q-btn>
                    <q-btn dense round flat color="red" @click="removeUser(props)" icon="delete"></q-btn>
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
    <!-- Fin de Tabla -->
  </div>
  <p style="display: none">
    {{ users.name }}
  </p>
  <!-- Inicio de Formulario nuevo usuario -->
  <section>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="formCreate" persistent @hide="clearForm">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">
              Crear nuevo usuario <q-icon name="fas fa-user-plus"></q-icon>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form @submit="createUserNew" class="q-gutter-md col-6">
              <q-input
                dense
                lazy-rules
                v-model="form.name"
                autofocus
                label="Nombre completo"
                :rules="[(val) => !!val || 'El campo nombre es requerido']"
              />
              <q-input
                dense
                lazy-rules
                v-model="form.email"
                label="Correo electrónico"
                :rules="[
                  (val) => !!val || 'El campo correo electrónico es requerido',
                  (val) => /.+@.+\..+/.test(val) || 'Ingresa un correo válido',
                ]"
              />
              <q-input
                dense
                lazy-rules
                v-model="form.password"
                label="Contraseña"
                type="password"
                :rules="[
                  (val) => !!val || 'El campo contraseña es requerido',
                  (val) => val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
                ]"
              />

              <!-- Select -->
              <q-select
                dense
                lazy-rules
                v-model="form.role_id"
                for="permission"
                :option-value="
                  (opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)
                "
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'name' in opt ? opt.name : 'Seleccionar'
                "
                emit-value
                map-options
                options-dense
                filled
                hint="Selecciona los permisos que tendrá el rol"
                color="green"
                :loading="false"
                :options="roles"
                :rules="[(val) => !!val || 'Campo obligatorio']"
              />
              <!-- Fin Select -->
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancelar" v-close-popup color="red" />
                <q-btn flat label="Enviar" type="submit" color="primary" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </section>
  <!-- Fin de Formulario nuevo usuario -->

  <!-- Inicio de Formulario para editar usuario -->
  <section>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="formEdit" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Editar usuario</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form @submit="editUser" class="q-gutter-md">
              <q-input
                dense
                v-model="form.name"
                autofocus
                label="Nombre completo"
                :rules="[(val) => !!val || 'Field is required']"
              />
              <q-input
                dense
                v-model="form.email"
                label="Correo electrónico"
                :rules="[
                  (val) => !!val || 'El campo correo electrónico es requerido',
                  (val) => /.+@.+\..+/.test(val) || 'Ingresa un correo válido',
                ]"
              />
              <q-input dense 
              v-model="form.password" 
              label="Contraseña"
              type="password"
              hint="Déjalo vacío si no deseas cambiarla"
                :rules="[
                  (val) => !val || val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
                ]" />
              <!-- Select -->
              <q-select
                v-model="form.role_id"
                for="permission"
                :option-value="
                  (opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)
                "
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'name' in opt ? opt.name : '- Null -'
                "
                emit-value
                map-options
                options-dense
                filled
                hint="Selecciona los permisos que tendrá el rol"
                color="green"
                :loading="false"
                :options="roles"
                :rules="[(val) => !!val || 'Por favor, selecciona un rol']"
              />
              <!-- Fin Select -->
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancelar" v-close-popup color="red" />
                <q-btn flat label="Enviar" type="submit" color="primary" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </section>
  <!-- Fin de Formulario para editar usuario -->
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
    name: "email",
    label: "Correo electrónico",
    align: "left",
    field: "email",
    sortable: true,
  },
  {
    name: "role_name",
    label: "Rol",
    align: "left",
    field: "role_name",
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
    align: "center",
    label: "Acciones",
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
      formCreate: false,
      pagination: {
        sortBy: "created_at",
        descending: true,
        rowsPerPage: 10,
      },
      formEdit: false,
      form: {
        id: "",
        name: "",
        email: "",
        password: "",
        role_id: [],
      },
    };
  },
  methods: {
    ...mapActions("users", ["getUsers"]),
    ...mapActions("users", ["createUser"]),
    ...mapActions("users", ["deleteUser"]),
    ...mapActions("users", ["updateUser"]),
    ...mapActions("roles", ["getRoles"]),
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    },
    async gettUsers() {
      try {
        await this.getUsers();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async createUserNew() {
      try {
        await this.createUser(this.form);
        this.formCreate = false;
        this.clearForm();
        this.$q.notify({
          type: "positive",
          message: `Usuario creado correctamente`,
        });
      } catch (err) {
        if (err.response.data.message) {
          if (err.response.data.errors.name) {
            $q.notify({
              type: "negative",
              message: err.response.data.errors.name,
            });
          } else if (err.response.data.errors.email) {
            $q.notify({
              type: "negative",
              message: err.response.data.errors.email,
            });
          } else if (err.response.data.errors.password) {
            $q.notify({
              type: "negative",
              message: err.response.data.errors.password,
            });
          } else if (err.response.data.errors.role_id) {
            $q.notify({
              type: "negative",
              message: err.response.data.errors.role_id,
            });
          }
        }
      }
    },

    removeUser(props) {
      this.$q
        .dialog({
          title: "Mensaje de confirmación",
          message: `¿Estás seguro de eliminar al usuario ${props.row.name}?`,
          cancel: "Cancelar",
          ok: "Confirmar",
          persistent: true,
        })
        .onOk(() => {
          try {
            this.deleteUser(props.row.id);
            this.$q.notify({
              type: "positive",
              message: `Usuario ${props.row.name} eliminado correctamente`,
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
      },

    showUser(props) {
      try {
        this.formEdit = true;
        this.form.id = props.row.id;
        this.form.name = props.row.name;
        this.form.email = props.row.email;
        this.form.password = props.row.password;
        this.form.role_id = props.row.role_id;
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },

    async editUser() {
      try {
        await this.updateUser(this.form);
        this.formEdit = false;
        this.clearForm();
        this.$q.notify({
          type: "positive",
          message: `Usuario modificado correctamente`,
        });
      } catch (err) {
        if (err.response.data.message) {
          if (err.response.data.errors.name) {
            $q.notify({
              type: "negative",
              message: err.response.data.errors.name,
            });
          } else if (err.response.data.errors.email) {
            $q.notify({
              type: "negative",
              message: err.response.data.errors.email,
            });
          } else if (err.response.data.errors.password) {
            $q.notify({
              type: "negative",
              message: err.response.data.errors.password,
            });
          } else if (err.response.data.errors.role_id) {
            $q.notify({
              type: "negative",
              message: err.response.data.errors.role_id,
            });
          }
        }
      }
    },

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

    clearForm() {
      this.form.id = "";
      this.form.name = "";
      this.form.email = "";
      this.form.password = "";
      this.form.role_id = "";
    },
  },

  created() {
    this.gettUsers();
    this.gettRoles();
  },
  computed: {
    ...mapState({
      users: (state) => state.users.users,
    }),
    ...mapState({
      roles: (state) => state.roles.roles,
    }),
  },
  mounted() {
    $q = useQuasar();
  },
  beforeUpdate() {
    this.rows = [...this.users].sort((a, b) => b.id - a.id);
    this.loading = false;
  },
};
</script>
