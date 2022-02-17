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
          Usuarios
          <q-btn
            color="primary"
            :disable="loading"
            label="Nuevo"
            icon-right="fas fa-plus"
            size="sm"
            @click="formCreate = true"
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
            {{ props.row.created_at }}
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
      <q-dialog v-model="formCreate" persistent>
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
                ]"
              />
              <q-input
                dense
                lazy-rules
                v-model="form.password"
                label="Contraseña"
                :rules="[(val) => !!val || 'El campo contraseña es requerido']"
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
                    Object(opt) === opt && 'name' in opt ? opt.name : '- Null -'
                "
                emit-value
                map-options
                options-dense
                filled
                hint="Selecciona los permisos que tendra el rol"
                color="green"
                :loading="false"
                :options="roles"
                :rules="[(val) => !!val || 'Field is required']"
              />
              <!-- Fin Select -->
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup color="red" />
                <q-btn flat label="Submit" type="submit" color="primary" />
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
            <div class="text-h6">Editar usuario {{ form.name }}</div>
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
                :rules="[(val) => !!val || 'Field is required']"
              />
              <q-input dense v-model="form.password" label="Contraseña" />
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
                hint="Selecciona los permisos que tendra el rol"
                color="green"
                :loading="false"
                :options="roles"
                :rules="[(val) => !!val || 'Field is required']"
              />
              <!-- Fin Select -->
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup color="red" />
                <q-btn flat label="Submit" type="submit" color="primary" />
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
          message: `¿Estas seguro de eliminar el registro de ${props.row.name}`,
          cancel: true,
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
    this.rows = this.users;
    this.loading = false;
  },
};
</script>
