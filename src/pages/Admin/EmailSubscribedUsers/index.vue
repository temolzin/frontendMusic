<template>
    <q-card style="margin-top:-50px; width: 100%; padding: 10px;">
        <q-card-section>
        <div class="text-h5 q-mb-md q-mt-md">Envío de Correos</div>
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
            label="Enviar Correo"
            color="primary"
            class="q-mt-md"
            rounded
            @click="sendEmails"
            ></q-btn>
        </q-card-section>
    </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";

let $q;
export default {
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
                    $q.notify({
                        type: "negative",
                        message: "Selecciona al menos un rol antes de enviar el correo",
                    });
                    return;
                }

                if (!this.emailSubject.trim() || !this.emailContent.trim()) {
                    $q.notify({
                        type: "negative",
                        message: "El asunto y el contenido no pueden quedar vacíos",
                    });
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
                $q.notify({
                    type: "positive",
                    message: `Se envió el email de forma correcta`,
                });
            } catch (err) {
                const backendMessage =
                    err?.response?.data?.message ||
                    err?.response?.data?.errors?.role_ids?.[0] ||
                    err?.response?.data?.errors?.subject?.[0] ||
                    err?.response?.data?.errors?.content?.[0] ||
                    err?.message ||
                    "Algo salió mal, vuelve a intentarlo más tarde";

                $q.notify({
                type: "negative",
                message: backendMessage
            });
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
            this.$q.notify({
                type: "negative",
                message: err.response?.data?.message ?? "No se pudieron cargar los roles",
            });
        });
    },
    mounted() {
        $q = useQuasar();
    },
};
</script>
