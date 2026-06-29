<template>
  <q-page padding class="q-pa-md q-pa-md-xl flex flex-center">
    <div style="max-width: 900px; width: 100%;">
      <div class="text-center q-mb-xl">
        <h1 class="text-h4 text-weight-bold q-ma-none text-primary q-mb-xs">AVISO DE PRIVACIDAD</h1>
        <div class="text-subtitle2 text-grey-7">Estatus: Versión Final de Cumplimiento Legal (México)</div>
        <div class="text-caption text-grey-6">Fecha de Publicación: 12 de junio de 2026</div>
      </div>
      <q-card flat bordered class="q-pa-md q-mb-lg bg-grey-1 text-grey-9">
        <p class="q-ma-none text-body1 line-height-relaxed">
          En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> en México, se emite el presente Aviso de Privacidad para informar el uso y protección que se dará a sus datos personales.
        </p>
      </q-card>
      <q-list class="q-gutter-y-md">
        <q-expansion-item
          group="privacy"
          icon="assignment_ind"
          label="I. Datos Personales Recabados"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden"
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>Para las finalidades señaladas en este aviso, recabamos sus datos de forma directa cuando usted se registra en nuestra aplicación. Los datos almacenados en nuestras bases de datos son:</p>
              <p><strong>Para Clientes:</strong> Nombre completo, correo electrónico, número telefónico, dirección del evento y ubicación IP de conexión, entre otros datos básicos que se necesiten para el funcionamiento de la plataforma.</p>
              <p><strong>Para Artistas:</strong> Nombre artístico, nombre del representante, portafolio multimedia (fotos y videos), tarifas de paquetes y coordenadas de geolocalización (Latitud y Longitud) para el cálculo de rutas de cobertura.</p>
              <q-banner dense class="bg-blue-1 text-primary rounded-borders q-mt-md">
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>
                <strong>EXCLUSIÓN TOTAL:</strong> Se reitera que ningún dato de tarjeta bancaria es recabado ni almacenado por nuestro software, delegando dicha función enteramente a la infraestructura bancaria de OpenPay.
              </q-banner>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="privacy"
          icon="fact_check"
          label="II. Finalidades del Tratamiento de Datos"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden"
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>Sus datos personales serán utilizados para las siguientes finalidades necesarias para el servicio:</p>
              <ul>
                <li>Validar e identificar la identidad de los usuarios en el sistema.</li>
                <li>Permitir el uso del chat en tiempo real para acordar detalles del evento.</li>
                <li>Calcular distancias de traslado y viáticos mediante el sistema de geolocalización.</li>
                <li>Procesar las órdenes de compra, contratos digitales y dispersión de fondos.</li>
                <li>Gestionar el sistema de soporte técnico y resolución de disputas en el periodo de resguardo de 24 horas.</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="privacy"
          icon="hub"
          label="III. Transferencia de Datos a Terceros"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden"
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>Se informa que sus datos personales son compartidos de forma cifrada y segura exclusivamente con los siguientes proveedores de infraestructura tecnológica para el correcto funcionamiento de la aplicación:</p>
              <ul>
                <li><strong>OpenPay (Pasarela de Pagos):</strong> Para procesar los cargos y transferencias interbancarias.</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="terms"
          icon="gavel"
          label="IV. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)"
          header-class="text-weight-bold text-subtitle1 text-grey-10"
          outlined
          class="bg-card rounded-borders overflow-hidden"
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9 q-pa-md">
                <p class="q-mb-md">
                    Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal (Rectificación), que la eliminemos de nuestros registros o bases de datos (Cancelación) u oponerse al uso de sus datos para fines específicos (Oposición).
                </p>
                <p class="q-ma-none">
                    Para ejercer cualquiera de los Derechos ARCO, deberá enviar una solicitud formal detallando su nombre y correo de usuario al departamento de soporte a través de la dirección electrónica: 
                    <a href="mailto:info@rootheim.com" class="text-primary text-weight-medium" style="text-decoration: none;">info@rootheim.com</a>.
                </p>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PrivacyPage'
}
</script>

<style scoped>
.line-height-relaxed {
  line-height: 1.6;
}
.rounded-borders {
  border-radius: 8px;
}
</style>
