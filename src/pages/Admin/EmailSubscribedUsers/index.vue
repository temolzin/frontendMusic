<template>
    <q-card style="margin-top:-50px; width: 100%; padding: 10px;">
        <q-card-section>
        <h3 class="q-mb-md" style="margin-bottom: 35px;">Newsletter</h3>
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
                bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'}
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
import { ref } from 'vue'
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";

let $q;
export default {
    data() {
        return {
            emailSubject: ref('Ingresa el Asunto del Correo'),
            emailContent: ref('Ingresa el Contenido del Correo'),
        };
    },
    methods: {
        ...mapActions("UsersSuscribe", ["sendEmail"]),
        async sendEmails() {
            try {
                const jsonData = {
                    subject: this.emailSubject,
                    content: this.emailContent,
                };
                await this.sendEmail(jsonData);
                this.emailSubject = '';
                this.emailContent = '';
                $q.notify({
                    type: "positive",
                    message: `Se envió el email de forma correcta`,
                });
            } catch (err) {
                $q.notify({
                type: "negative",
                message: `Algo salió mal, vuelve a intentarlo más tarde ${err}`
                });
            }
        },
    },
    computed: {
        ...mapGetters("UsersSuscribe", ["stateEmails"]),
        mode: function () {
        return this.$q.dark.isActive;
        },
    },
    mounted() {
        $q = useQuasar();
    },
};
</script>
