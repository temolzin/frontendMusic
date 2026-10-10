<template>
  <div class="q-pa-md">
    <PageBreadcrumbs :items="[{ label: 'Envío de Correos', icon: 'fas fa-newspaper' }]" />
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <b class="text-h5 q-mb-md d-block">Envío de Correos</b>
        <q-select
          v-model="selectedRoles"
          :options="rolesOptions"
          label="Enviar a roles"
          dense
          outlined
          multiple
          use-chips
          emit-value
          map-options
          option-label="name"
          option-value="id"
          clearable
          hint="Selecciona uno o varios roles que recibirán el correo"
          class="q-mb-md"
        ></q-select>

        <q-input
          style="margin-bottom: 15px;"
          label="Asunto"
          v-model="emailSubject"
          dense
          outlined
          required
        ></q-input>

        <q-editor
          v-model="emailContent"
          dense
          outlined
          toolbar-bg="primary"
          toolbar-toggle-color="pink-4"
          toolbar-text-color="white"
          required
          :definitions="{
            bold: {label: 'Negrita', icon: null, tip: 'Poner texto en negrita'}
          }"
        ></q-editor>

        <q-btn
          unelevated
          style="border-radius: 8px;"
          label="ENVIAR CORREO"
          color="primary"
          icon="send"
          class="q-mt-md"
          @click="sendEmails"
        ></q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import PageBreadcrumbs from "src/components/PageBreadcrumbs.vue";
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";
import { notifySuccess, notifyError } from "src/utils/notify";

let $q;
export default {
  components: { PageBreadcrumbs },
    data() {
        return {
            emailSubject: '',
            emailContent: '',
            selectedRoles: [],
        };
    },
    methods: {
        ...mapActions("roles", ["getRoles"]),
        ...mapActions("UsersSuscribe", ["sendEmail"]),
        async sendEmails() {
            try {
                if (!this.selectedRoles.length) {
                    notifyError("Selecciona al menos un rol antes de enviar el correo");
                    return;
                }

                if (!this.emailSubject.trim() || !this.emailContent.trim()) {
                    notifyError("El asunto y el contenido no pueden quedar vacíos");
                    return;
                }

                const jsonData = {
                    subject: this.emailSubject.trim(),
                    content: this.emailContent.trim(),
                    role_ids: this.selectedRoles,
                };
                await this.sendEmail(jsonData);
                this.emailSubject = '';
                this.emailContent = '';
                this.selectedRoles = [];
                notifySuccess(`Se envió el email de forma correcta`);
            } catch (err) {
                const backendMessage =
                    err?.response?.data?.message ||
                    err?.response?.data?.errors?.role_ids?.[0] ||
                    err?.response?.data?.errors?.subject?.[0] ||
                    err?.response?.data?.errors?.content?.[0] ||
                    err?.message ||
                    "Algo salió mal, vuelve a intentarlo más tarde";

                notifyError(backendMessage);
        }
    },
},
    computed: {
        ...mapGetters("roles", ["stateRoles"]),
        ...mapGetters("UsersSuscribe", ["stateEmails"]),
        rolesOptions() {
            let roles = Array.isArray(this.stateRoles) ? [...this.stateRoles] : [];
            
            roles.push({
                id: 0, 
                name: 'Correos de la Página Principal' 
            });

            return roles;
        },
        mode: function () {
        return this.$q.dark.isActive;
        },
    },
    created() {
        this.getRoles().catch((err) => {
            notifyError(err.response?.data?.message ?? "No se pudieron cargar los roles");
        });
    },
    mounted() {
        $q = useQuasar();
    },
};
</script>
