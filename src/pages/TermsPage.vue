<template>
  <q-page padding class="q-pa-md q-pa-md-xl flex flex-center">
    <div style="max-width: 900px; width: 100%;">
      <div class="text-center q-mb-xl">
        <h1 class="text-h4 text-weight-bold q-ma-none text-primary q-mb-xs">TÉRMINOS Y CONDICIONES DE USO</h1>
        <div class="text-subtitle2 text-grey-7">Estatus: Versión Final de Cumplimiento Legal (México)</div>
        <div class="text-caption text-grey-6">Fecha de Publicación: 12 de junio de 2026</div>
      </div>
      <q-card flat bordered class="q-pa-md q-mb-lg bg-grey-1 text-grey-9">
        <p class="q-ma-none text-body1 line-height-relaxed">
          Bienvenido a nuestra plataforma digital de contratación musical. Al registrarse, acceder o utilizar nuestros servicios como Cliente o como Artista, usted acepta quedar vinculado por los presentes Términos y Condiciones. Si no está de acuerdo con ellos, deberá abstenerse de utilizar el sistema.
        </p>
      </q-card>
      <q-list class="q-gutter-y-md">
        <q-expansion-item
          group="terms"
          icon="gavel"
          label="PRIMERA: Naturaleza del Servicio (Intermediación Digital)"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden "
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>La Plataforma opera única y exclusivamente como un Marketplace de intermediación digital que conecta a usuarios que desean contratar servicios de entretenimiento con músicos, bandas o solistas independientes. La Plataforma no es una agencia de representación, no tiene relación laboral, de subordinación ni de sociedad con los Artistas. Cada Artista opera bajo su propio riesgo, cuenta y responsabilidad como contratista independiente.</p>
              <q-banner dense class="bg-warning text-black rounded-borders q-mt-md">
                <template v-slot:avatar>
                  <q-icon name="warning" color="dark" />
                </template>
                <strong>Exclusión de Responsabilidad por Contacto Externo:</strong> La plataforma cuenta con un sistema de chat interno seguro para la concertación de los servicios. Vibeer no se hace responsable de ningún acuerdo, pago, depósito o conflicto derivado de comunicaciones realizadas fuera de la plataforma (como WhatsApp, llamadas telefónicas o correos electrónicos externos). Cualquier contacto externo exime a la plataforma del periodo de resguardo y de la gestión de disputas.
              </q-banner>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="terms"
          icon="payment"
          label="SEGUNDA: Gestión de Pagos y Seguridad Bancaria (OpenPay)"
          header-class="text-weight-bold text-subtitle1 "
          outlined
          class="bg-card rounded-borders overflow-hidden"
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>Para garantizar la seguridad de las transacciones, todas las operaciones económicas se procesan a través de la pasarela de pagos certificada OpenPay (proveedor externo).</p>
              <p class="text-weight-bold q-mt-sm">CLÁUSULA DE SEGURIDAD CRÍTICA (PCI-DSS):</p>
              <p>La Plataforma NO almacena, NO recopila, NO procesa ni maneja en sus servidores locales ni bases de datos ningún dato financiero sensible, tales como números de tarjeta de crédito/débito, fechas de vencimiento o códigos de seguridad (CVV/CVC). Toda la captura de datos bancarios se realiza mediante un formulario encriptado directamente en los servidores seguros de OpenPay, cumpliendo con los estándares internacionales de seguridad de datos de la industria de tarjetas de pago.</p>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="terms"
          icon="account_balance_wallet"
          label="TERCERA: Flujo de Contratación, Resguardo y Dispersión de Fondos"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden "
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <ul class="q-pl-md q-ma-none">
                <li class="q-mb-md"><strong>Reserva y Pago:</strong> 
                    El Cliente deberá liquidar el 100% del valor del servicio o paquete seleccionado mediante la plataforma para congelar la fecha en la agenda del Artista.
                </li>
                <li class="q-mb-md"><strong>Retención de Comisión:</strong> 
                    El Artista acepta explícitamente que la plataforma retendrá una comisión fija del 10% sobre el valor total bruto de la contratación por concepto de uso, mantenimiento de la infraestructura digital y publicidad. 
                </li>
                <li class="q-mb-md"><strong>Periodo de Custodia de 24 horas:</strong> 
                    El dinero pagado por el Cliente permanecerá resguardado de forma segura por la plataforma durante el evento y hasta un máximo de 24 horas posteriores a la finalización del mismo.
                </li>
                <li><strong>Dispersión:</strong> 
                    Transcurrido el plazo de 24 horas posterior al evento, si el Cliente no levanta un reporte o disputa formal en el módulo de soporte, los fondos (menos la comisión de la plataforma) serán liberados y transferidos automáticamente a la cuenta interbancaria registrada por el Artista.
                </li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="terms"
          icon="event_busy"
          label="CUARTA: Cancelaciones, Inasistencias y Reembolsos"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden "
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
             <p><strong>Políticas de Cancelación:</strong> Se aplican los siguientes porcentajes según los días restantes antes del evento.</p>

              <p class="text-weight-bold q-mt-sm q-mb-xs">Si el artista cancela:</p>
              <div class="q-markup-table q-table__container q-table--horizontal-lines">
                <table class="q-table text-left">
                  <thead>
                    <tr class="text-weight-bold bg-grey-2">
                      <th class="text-left">Días antes del evento</th>
                      <th class="text-left">Penalización para el artista</th>
                      <th class="text-left">Reembolso al cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>30+ días</td>
                      <td>0%</td>
                      <td>100%</td>
                    </tr>
                    <tr>
                      <td>7 - 30 días</td>
                      <td>50%</td>
                      <td>100%</td>
                    </tr>
                    <tr>
                      <td>1 - 7 días</td>
                      <td>100%</td>
                      <td>100%</td>
                    </tr>
                    <tr>
                      <td>Mismo día</td>
                      <td colspan="2" class="text-weight-medium text-negative">No se puede cancelar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-body2 text-grey q-mt-sm">Nota: Si el artista aún no ha aceptado la solicitud, el cliente puede cancelar sin penalización (0%).</p>
              <p class="text-weight-bold q-mt-md q-mb-xs">Si el cliente cancela:</p>
              <div class="q-markup-table q-table__container q-table--horizontal-lines">
                <table class="q-table text-left">
                  <thead>
                    <tr class="text-weight-bold bg-grey-2">
                      <th class="text-left">Días antes del evento</th>
                      <th class="text-left">Penalización para el cliente</th>
                      <th class="text-left">Reembolso al cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>30+ días</td>
                      <td>0%</td>
                      <td>100%</td>
                    </tr>
                    <tr>
                      <td>7 - 30 días</td>
                      <td>50%</td>
                      <td>50%</td>
                    </tr>
                    <tr>
                      <td>1 - 7 días</td>
                      <td>100%</td>
                      <td>0%</td>
                    </tr>
                    <tr>
                      <td>Mismo día</td>
                      <td colspan="2" class="text-weight-medium text-negative">No se puede cancelar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="terms"
          icon="photo_camera"
          label="QUINTA: Propiedad Intelectual y Licencia de Uso de Contenido Multimedia"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden "
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>Los Artistas declaran y garantizan ser los autores legítimos o contar con las licencias y derechos de autor necesarios sobre todo el material audiovisual (incluyendo de forma enunciativa más no limitativa: fotografías de portafolio, videos promocionales, logotipos, música, audios y enlaces externos) que suban o almacenen en su perfil de Vibeer.</p>
              <p><strong>Retención de Derechos:</strong> El Artista conserva en todo momento los derechos de propiedad intelectual sobre su contenido original.</p>
              <p><strong>Licencia de Exhibición a Vibeer:</strong> Al publicar contenido en La Plataforma, el Artista otorga a Vibeer una licencia de uso mundial, no exclusiva, gratuita, sublicenciable y transferible únicamente para exhibir, reproducir, adaptar y distribuir dicho material audiovisual dentro de la aplicación web, aplicaciones móviles y canales de marketing digital oficiales de Vibeer, con el único fin de promocionar los servicios del Artista y operar el Marketplace.</p>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="terms"
          icon="thunderstorm"
          label="SEXTA: Caso Fortuito y Fuerza Mayor"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden "
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>Ninguna de las partes (Clientes, Artistas o Vibeer) será responsable por el incumplimiento o retraso en la ejecución de las obligaciones derivadas de una contratación si este es causado por eventos fuera de su control razonable, catalogados como Caso Fortuito o Fuerza Mayor bajo la legislación mexicana.</p>
              <p><strong>Causales Válidas:</strong> Se considerarán causales de fuerza mayor: fenómenos naturales de gravedad (huracanes, sismos, inundaciones), cierres de carreteras o contingencias sanitarias decretadas por el gobierno, así como accidentes graves, enfermedad súbita incapacitante o fallecimiento en primer grado del Artista o del Cliente.</p>
              <p><strong>Procedimiento de Notificación:</strong> La parte afectada deberá notificar el siniestro a través del módulo de soporte de Vibeer de forma inmediata y en un plazo máximo de 12 horas posteriores al evento. El dinero retenido en custodia en OpenPay será reembolsado al 100% al Cliente sin penalización, y la fecha del Artista será liberada en el calendario sin afectar su estatus de verificación.</p>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="terms"
          icon="no_accounts"
          label="SÉPTIMA: Terminación, Suspensión y Eliminación de Cuentas"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden "
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>Vibeer se reserva el derecho absoluto, unilateral y sin necesidad de previo aviso, de suspender temporalmente o eliminar definitivamente las cuentas de Clientes o Artistas, así como de remover cualquier contenido multimedia de los perfiles por las siguientes causas:</p>
              <ul>
                <li>Violación o sospecha de violación a los presentes Términos y Condiciones.</li>
                <li>Registro de actividades sospechosas, fraudulentas o intentos de manipulación de la pasarela de pagos OpenPay.</li>
                <li>Acumulación de reportes negativos en el sistema de quejas o conducta inapropiada/insegura en las salas de chat de la plataforma.</li>
                <li>Intentos de evadir la comisión de Vibeer invitando a los usuarios a realizar pagos fuera del software.</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          group="terms"
          icon="help_center"
          label="OCTAVA: Procedimiento de Resolución de Disputas"
          header-class="text-weight-bold text-subtitle1"
          outlined
          class="bg-card rounded-borders overflow-hidden "
        >
          <q-card>
            <q-card-section class="text-body1 text-grey-9">
              <p>Conectado con el periodo de retención de fondos de 24 horas posterior al evento:</p>
              <p><strong>Apertura del Ticket y Plazos:</strong> Si el Cliente activa el botón de queja o disputa en las primeras 24 horas post-evento, los fondos se congelarán inmediatamente en OpenPay. A partir de ese momento, el Cliente contará con un plazo de 48 horas naturales para aportar pruebas tangibles (ej. videos de no-asistencia, fotografías, capturas del chat o testimonios).</p>
              <p><strong>Réplica del Artista:</strong> Una vez subidas las pruebas del Cliente, el Artista tendrá una ventana de 48 horas para presentar sus contrapruebas y justificar su postura.</p>
              <p><strong>Dictamen Final:</strong> El equipo legal y administrative de Vibeer evaluará de forma neutral las evidencias aportadas por ambas partes y dictará una resolución definitiva en un plazo no mayor a 5 días hábiles. La decisión de Vibeer será inapelable y se ejecutará liberando los fondos al Artista o procesando el reembolso íntegro al Cliente.</p>
              <p><strong>Falta de Respuesta:</strong> Si una de las partes no responde ni aporta evidencias dentro de su plazo correspondiente, el sistema fallará automáticamente a favor de la contraparte que sí haya cumplido con el proceso.</p>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
  export default {
    name: 'TermsPage'
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
