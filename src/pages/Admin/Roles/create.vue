<template>
  <div class="q-pa-md row">
    <div class="col-12">
      <p class="text-h4 text-center">Crear nuevo rol</p>
    </div>
    <div class="col-3"></div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md col-6">
      <q-input
        v-model="form.name"
        label="Nombre del rol *"
        hint="Se recomiendo una sola palabra"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Ingresa el nombre']"
      />

      <q-input
        v-model="form.description"
        label="Breve descripcion del rol *"
        hint="Se recomiendo una sola palabra"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Ingresa una descripción']"
      />

      <div>
        <q-select
          v-model="form.selection"
          for="permission"
          :option-value="
            (opt) => (Object(opt) === opt && 'permission_id' in opt ? opt.permission_id : null)
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
              val.length > 1 || 'Por favor selecciona al menos 2 opciones',
          ]"
          :options="permissions"
        />
      </div>

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>

  <div hidden class="col-3">
    {{ permissions.slug }}
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { mapActions, mapState } from "vuex";
let $q;
export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        selection: [],
      },
    };
  },
  methods: {
    ...mapActions("roles", ["getPermissions"]),
    ...mapActions("roles", ["createRole"]),
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
    async onSubmit() {
      try {
        await this.createRole(this.form);
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
      this.form.name = "";
      this.form.description = "";
      this.form.selection = [];
    },
  },
  created() {
    this.gettPermissions();
  },
  computed: {
    ...mapState({
      permissions: (state) => state.roles.permissions,
    }),
  },

  mounted() {
    $q = useQuasar();
  },
};
</script>
