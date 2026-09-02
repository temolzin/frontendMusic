<template>
  <q-page padding>
    <PageBreadcrumbs :items="[{ label: 'Reportar Incidente', icon: 'report_problem' }]" />
    <div class="q-pa-md" style="max-width: 600px; margin: 0 auto">
      <div class="text-h5 text-primary text-weight-bold q-mb-sm">Reportar Incidente</div>
      <div class="text-caption text-grey q-mb-lg">
        Orden #{{ $route.params.saleId }} — Por favor completa el siguiente formulario para reportar el incidente relacionado con esta orden. Nuestro equipo de soporte revisará tu reporte y se pondrá en contacto contigo lo antes posible.
      </div>
      <q-card flat bordered class="q-pa-md">
        <div class="text-subtitle2 q-mb-xs">Tipo de problema</div>
        <q-select
          v-model="form.category"
          :options="categoryOptions"
          emit-value
          map-options
          outlined
          dense
          label="Selecciona una categoría"
          class="q-mb-md"
        />
        <div class="text-subtitle2 q-mb-xs">Descripción</div>
        <q-input
          v-model="form.description"
          type="textarea"
          outlined
          dense
          rows="4"
          placeholder="Explica con detalle qué ocurrió (mínimo 10 caracteres)..."
          :rules="[
            val => !!val || 'La descripción es requerida.',
            val => val.length >= 10 || 'Mínimo 10 caracteres.',
          ]"
          class="q-mb-md"
        />
        <div class="text-subtitle2 q-mb-xs">Evidencias (fotos o videos, opcional)</div>
        <q-file
          v-model="selectedFiles"
          multiple
          outlined
          dense
          accept=".jpg,.jpeg,.png,.mp4,.mov"
          :max-file-size="20971520"
          label="Adjuntar archivos (máx. 20 MB c/u, JPG/PNG/MP4/MOV)"
          class="q-mb-xs"
          @rejected="onFileRejected"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <div class="text-caption text-grey q-mb-lg">Formatos permitidos: JPG, JPEG, PNG, MP4, MOV. Máximo 20 MB por archivo.</div>
        <q-btn
          unelevated
          rounded
          color="negative"
          style="border-radius: 8px; font-weight: bold;"
          icon="report_problem"
          label="Enviar Reporte"
          class="full-width"
          :loading="loading"
          :disable="!form.category || form.description.length < 10"
          @click="submitReport"
        />
      </q-card>
    </div>
  </q-page>
</template>

<script>
import PageBreadcrumbs from "src/components/PageBreadcrumbs.vue";
import { mapActions } from 'vuex';
import { notifyError, platformEvents } from 'src/utils/notify';

export default {
  components: { PageBreadcrumbs },
  name: 'ReportIncident',

  props: {
    saleId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      selectedFiles: null,
      form: {
        category: null,
        description: '',
      },
    };
  },

  computed: {
    userRole() {
      return this.$store.getters['auth/getMe']?.role?.[0] || '';
    },
    categoryOptions() {
      if (this.userRole === 'artista') {
        return [
          { label: 'Mal comportamiento del cliente', value: 'bad_service' },
          { label: 'Cancelación de último minuto por el cliente', value: 'cancellation' },
          { label: 'Cliente no se presentó', value: 'no_show' },
          { label: 'Otro', value: 'other' },
        ];
      }
      return [
        { label: 'El artista no se presentó', value: 'no_show' },
        { label: 'Retraso o cancelación de último minuto', value: 'delay' },
        { label: 'Mal servicio o comportamiento inadecuado', value: 'bad_service' },
        { label: 'Cancelación', value: 'cancellation' },
        { label: 'Otro', value: 'other' },
      ];
    },
  },

  methods: {
    ...mapActions('supportTickets', ['createTicket', 'uploadTicketEvidence']),

    async submitReport() {
      this.loading = true;
      try {
        const ticket = await this.createTicket({
          artist_sale_id: this.$route.params.saleId,
          category: this.form.category,
          description: this.form.description,
        });

        if (this.selectedFiles && this.selectedFiles.length > 0) {
          await this.uploadTicketEvidence({
            ticketId: ticket.id,
            files: this.selectedFiles,
          });
        }

        platformEvents.incidentReceived();

        this.$router.push({ name: 'client.my-tickets' });

      } catch (err) {
        const data = err.response?.data;
        let message = data?.message || 'Ocurrió un error al enviar el reporte. Intenta de nuevo.';
        if (data?.errors) {
          const details = Object.values(data.errors).flat().join('<br>');
          message += `<br><br>${details}`;
        }
        notifyError(message, { html: true, timeout: 5000 });
      } finally {
        this.loading = false;
      }
    },

    onFileRejected(rejectedEntries) {
      const messages = {
        'max-file-size': 'Un archivo supera el límite de 20 MB.',
        'accept': 'Tipo de archivo no permitido. Usa JPG, PNG, MP4 o MOV.',
      };
      rejectedEntries.forEach(({ failedPropValidation }) => {
        notifyError(messages[failedPropValidation] ?? 'Archivo rechazado.');
      });
    },
  },
};
</script>
