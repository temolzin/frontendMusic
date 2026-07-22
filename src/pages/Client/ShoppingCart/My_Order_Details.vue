<template>
  <q-page padding>
    <q-container>
      <div class="q-pa-md">
        <q-card-group>
          <div class="bg-primary text-white q-px-md q-py-md q-mb-md" style="border-radius: 8px;">
            <div class="artist-name-2 text-weight-bold" style="font-size: 24px; letter-spacing: 0.5px;">
              Mis Compras
            </div>
          </div>
          
          <div class="q-py-md">
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm-6">
                <q-input rounded outlined v-model="filterName" placeholder="Buscar por nombre...">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-select class="text-left" v-model="filterDate" :options="dateOptions" label="Todas">
                  <img class="bf-ui-icon bf-ui-icon--filter"
                    src="https://http2.mlstatic.com/frontend-assets/bf-ui-library/3.5.0/assets/icons/filter.svg" style="
                      width: 30px;
                      height: 24px;
                      position: absolute;
                      top: 55%;
                      left: 90%;
                      transform: translate(80%, -50%);
                    " />
                </q-select>
              </div>
            </div>
          </div>

          <q-col :span-xs="12" :span-md="8" class="q-mx-auto">
            <div v-if="filteredPurchases.length === 0" class="text-center q-pa-lg">
              <p class="text-h6 text-grey-7">No tienes compras registradas</p>
            </div>
            <div v-if="filteredPurchases.length > 0">
              <q-markup-table dense flat bordered class="table-responsive">
                <tbody v-for="(purchase, index) in filteredPurchases" :key="index">
                  <tr v-if="index === 0 || formatDate(purchase.created_at) !== formatDate(filteredPurchases[index - 1].created_at)" class="bg-primary text-white text-center">
                    <th :colspan="$q.screen.lt.sm ? 5 : 1" style="font-size: 15px" class="text-center">
                      {{ formatDate(purchase.created_at) }}
                    </th>
                    <th class="text-center text-weight-bold gt-xs" style="font-size: 14px">Detalles</th>
                    <th class="text-center text-weight-bold gt-xs" style="font-size: 14px">Contacto</th>
                    <th class="text-center text-weight-bold gt-xs" style="font-size: 14px">Estado</th>
                    <th class="text-center text-weight-bold gt-xs" style="font-size: 14px">Acciones</th>
                  </tr>
               <tr class="gt-xs">
                    <td>
                      <div class="text-center">
                        <q-img :src="purchase.artist?.image" loading="lazy" width="100px" height="100px"
                          style="object-fit: cover" class="rounded-circle q-responsive" />
                      </div>
                    </td>
                    <td class="text-left q-py-md">
                      <div class="text-subtitle1 text-weight-bold text-primary">
                        {{ purchase.artist?.name || 'N/A' }}
                      </div>
                      <div class="text-caption text-grey-8 q-mb-xs">
                        {{ purchase.artist?.zone || 'N/A' }}
                      </div>
                      <div class="text-subtitle2 text-weight-medium">
                        Monto: ${{ (parseFloat(purchase.amount) || 0).toFixed(2) }} MXN
                      </div>
                    </td>
                    <td class="text-center">
                      <p class="artist-zone text-weight-medium q-mb-sm">{{ purchase.artist?.manager?.name || 'N/A' }}</p>
                      <p class="q-mb-none">
                        <q-btn flat rounded color="primary" label="Enviar Mensaje" @click="openChat(purchase)" />
                      </p>
                    </td>
                    <td class="text-center">
                      <div class="column items-center q-gutter-y-sm">
                        <q-badge outline :color="eventStatusColor(purchase.event_status)" class="q-px-sm q-py-xs text-weight-bold" style="font-size: 13px">
                          {{ eventStatusLabel(purchase.event_status) }}
                        </q-badge>
                        <div v-if="isEventCompleted(purchase)">
                          <q-btn
                            size="sm"
                            outline
                            rounded
                            color="amber"
                            icon="star"
                            label="CALIFICAR"
                            @click="openRatingModal(purchase)"
                          />
                        </div>
                      </div>
                    </td>
                    <td class="text-center">
                      <q-btn unelevated rounded color="primary" label="ver compra" @click="openOrderModal(purchase)" />
                    </td>
                  </tr>
                  <tr class="lt-sm">
                    <td colspan="5" class="q-pa-xs" style="white-space: normal; border-bottom: none;">
                      <q-card class="q-pa-md shadow-1" bordered>
                        <div class="row q-col-gutter-sm items-center q-mb-md">
                          <div class="col-auto">
                            <q-img :src="purchase.artist?.image" loading="lazy" width="60px" height="60px" style="object-fit: cover" class="rounded-circle" />
                          </div>
                          <div class="col">
                            <div class="text-caption text-grey">Artista</div>
                            <div class="text-body2 text-weight-bold">{{ purchase.artist?.name || 'N/A' }}</div>
                            <div class="text-caption">{{ purchase.artist?.zone || 'N/A' }}</div>
                          </div>
                        </div>
                        <div class="q-mb-sm">
                          <div class="text-caption text-grey">Monto</div>
                          <div class="text-body2 text-primary text-weight-bold">${{ (parseFloat(purchase.amount) || 0).toFixed(2) }} MXN</div>
                        </div>
                        <div class="q-mb-sm">
                          <div class="text-caption text-grey">Contacto ({{ purchase.artist?.manager?.name || 'N/A' }})</div>
                          <div>
                            <q-btn flat rounded size="sm" color="primary" label="Enviar Mensaje" class="q-px-none" @click="openChat(purchase)" />
                          </div>
                        </div>
                        <div class="q-mb-sm">
                          <div class="text-caption text-grey">Estado</div>
                          <div class="row items-center">
                            <q-badge outline :color="eventStatusColor(purchase.event_status)" class="q-px-sm q-py-xs text-weight-bold">
                              {{ eventStatusLabel(purchase.event_status) }}
                            </q-badge>
                            <q-btn v-if="isEventCompleted(purchase)" size="sm" outline rounded color="amber" icon="star" label="CALIFICAR" class="q-ml-sm" @click="openRatingModal(purchase)" />
                          </div>
                        </div>
                        <div class="q-mt-md" style="border-top: 1px solid #eee; padding-top: 12px;">
                          <div class="text-caption text-grey q-mb-xs">Acciones</div>
                          <q-btn unelevated rounded size="sm" color="primary" label="Ver compra" class="full-width" @click="openOrderModal(purchase)" />
                        </div>
                      </q-card>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </q-col>
        </q-card-group>
      </div>
      <q-dialog v-model="showModal" transition-show="rotate" transition-hide="rotate">
        <q-card style="width: 480px; border-radius: 16px" class="q-pa-md">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-primary text-weight-bold">Detalles de la compra</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup color="grey" />
          </q-card-section>
          <q-separator class="q-my-md" />
          <q-card-section v-if="selectedPurchase" class="q-pt-none">
            <div class="row items-center q-mb-md">
              <q-img 
                :src="selectedPurchase.artist?.image" 
                width="60px" 
                height="60px" 
                style="border-radius: 50%; object-fit: cover"
                class="q-mr-md shadow-1"
              />
              <div>
                <div class="text-subtitle1 text-weight-bold">{{ selectedPurchase.artist?.name || 'N/A' }}</div>
                <div class="text-caption text-grey">{{ selectedPurchase.artist?.zone || '' }}</div>
              </div>
            </div>
            <q-list bordered separator class="rounded-borders">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Fecha de compra</q-item-label>
                  <q-item-label>{{ formatDate(selectedPurchase.created_at) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Fecha del evento</q-item-label>
                  <q-item-label>{{ formatDate(selectedPurchase.event_date) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Monto</q-item-label>
                  <q-item-label class="text-weight-bold text-primary">${{ (parseFloat(selectedPurchase.amount) || 0).toFixed(2) }} MXN</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>ID Transacción</q-item-label>
                  <q-item-label class="text-caption text-primary" style="word-break: break-all">{{ selectedPurchase.openpay_transaction_id }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Estado del evento</q-item-label>
                  <q-item-label>
                    <q-badge outline :color="eventStatusColor(selectedPurchase.event_status)" class="q-px-sm q-py-xs text-weight-bold">
                      {{ eventStatusLabel(selectedPurchase.event_status) }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Estado del pago</q-item-label>
                  <q-item-label>
                    <q-badge outline :color="paymentStatusColor(selectedPurchase)" class="q-px-sm q-py-xs text-weight-bold">
                      {{ paymentStatusLabel(selectedPurchase) }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn
              v-if="selectedPurchase.payment_method === 'cash' && selectedPurchase.approval_status === 'accepted' && selectedPurchase.cash_reference"
              unelevated rounded color="primary" icon="visibility"
              label="Referencia de Pago"
              class="full-width q-mt-md"
              :disable="selectedPurchase.status === 'completed'"
              @click="viewReference(selectedPurchase)"
            />
            <div v-else-if="selectedPurchase.payment_method === 'cash' && selectedPurchase.approval_status === 'pending_approval'" class="text-caption text-grey q-mt-md text-center">
              La referencia de pago estará disponible cuando el artista acepte tu solicitud.
            </div>
            <q-btn
              v-if="selectedPurchase.approval_status === 'accepted' && !(selectedPurchase.payment_method === 'cash' && selectedPurchase.status !== 'completed')"
              unelevated rounded color="positive" icon="file_download"
              label="Descargar Recibo"
              class="full-width q-mt-md"
              @click="downloadReceipt(selectedPurchase)"
            />
            <q-btn
              unelevated
              rounded
              color="negative"
              icon="cancel"
              label="Cancelar evento"
              class="full-width q-mt-sm"
              v-if="canCancel(selectedPurchase)"
              @click="detailCancelEvent(selectedPurchase)"
            />
            <q-btn
              unelevated
              rounded
              color="negative"
              icon="report_problem"
              label="Reportar Incidente"
              class="full-width q-mt-sm"
              :disable="!isEventPast(selectedPurchase)"
              @click="goToReport(selectedPurchase)"
            >
              <q-tooltip v-if="!isEventPast(selectedPurchase)">
                Solo puedes reportar después de la fecha del evento.
              </q-tooltip>
            </q-btn>
          </q-card-section>
          <q-card-actions align="right" class="q-pt-md">
            <q-btn flat label="Cerrar" color="primary" v-close-popup size="md" class="q-px-xl" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showRegeneratedRefDialog" persistent>
        <q-card style="width: 420px; border-radius: 20px" class="q-pa-md">
          <div ref="regeneratedReceipt" class="receipt-card">
            <q-card-section class="text-center q-pb-none q-pt-md">
              <img src="/logovibeer-black.png" style="height: 80px" class="q-mb-sm" />
              <div class="text-h6 text-primary text-weight-bold">Referencia de pago</div>
            </q-card-section>
            <q-card-section class="text-center q-pt-md">
              <div class="row items-center justify-center q-mb-sm">
                <q-icon name="store" color="primary" size="sm" class="q-mr-xs" />
                <span class="text-subtitle1" :class="{ 'text-black': isExporting }">Pagar en <strong>{{ regeneratedRef?.store }}</strong></span>
              </div>
              <q-card flat bordered class="q-pa-md q-my-md bg-grey-1" style="border-radius: 12px">
                <div class="text-caption text-grey q-mb-xs">Referencia</div>
                <div class="text-h5 text-primary text-weight-bold" style="letter-spacing: 3px">{{ regeneratedRef?.reference }}</div>
              </q-card>
              <img v-if="regeneratedRef?.barcode" :src="regeneratedRef.barcode" style="max-width: 260px; height: 80px; object-fit: contain" class="q-mx-auto q-my-md" />
              <div class="row q-col-gutter-md q-mt-sm">
                <div class="col-6">
                  <div class="text-caption text-grey">Monto</div>
                  <div class="text-subtitle1 text-weight-bold" :class="{ 'text-black': isExporting }">
                    ${{ (parseFloat(regeneratedRef?.amount) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} MXN
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey">Vence</div>
                  <div class="text-subtitle1 text-weight-bold" :class="{ 'text-black': isExporting }">{{ formatDueDate(regeneratedRef?.due_date) }}</div>
                </div>
              </div>
              <div class="col-12 q-mt-md q-pa-md" style="background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ff9800;">
                <div class="row items-center">
                  <q-icon name="warning" color="negative" size="sm" class="q-mr-md" />
                  <div>
                    <div class="text-caption text-weight-bold text-negative">Recordatorio importante</div>
                    <div class="text-body2 text-negative q-mt-xs">Debes completar el pago antes del evento ({{ formatDate(selectedPurchase?.event_date) }})</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </div>
          <q-card-actions align="between" class="q-pt-md">
            <q-btn-dropdown rounded color="primary" label="Descargar" icon="download">
              <q-list>
                <q-item clickable v-close-popup @click="downloadRefPDF">
                  <q-item-section avatar>
                    <q-icon name="picture_as_pdf" color="red" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>PDF</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="downloadRefImage">
                  <q-item-section avatar>
                    <q-icon name="image" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Imagen</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn rounded flat color="primary" label="Cerrar" @click="showRegeneratedRefDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="isRatingModalOpen" persistent>
        <q-card style="min-width: 350px; border-radius: 12px;">
          <q-card-section class="bg-primary text-white row items-center">
            <div class="text-h6">Calificar Servicio</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="column items-center q-pt-xl q-pb-xl">
            <template v-if="isLoadingRating">
              <q-spinner color="primary" size="3em" />
              <div class="text-subtitle2 q-mt-md text-grey">Cargando calificación...</div>
            </template>
            <template v-if="!isLoadingRating">
              <div class="text-subtitle1 q-mb-md text-center">
                ¿Qué te pareció el servicio de <strong>{{ transactionToRate?.artist?.name || 'este artista' }}</strong>?
              </div>
              <q-rating
                v-model="ratingValue"
                size="3em"
                color="yellow"
                icon="star_border"
                icon-selected="star"
                no-reset
                @update:model-value="submitTransactionRating"
              />
            </template>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="isChatDialogOpen" persistent>
        <q-card style="width: 90vw; max-width: 600px; display: flex; flex-direction: column;">
          <q-card-section class="row items-center bg-primary text-white q-pb-sm">
            <div class="text-h6">Chat con {{ activeChatPurchase?.artist?.name || 'el artista' }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section
            class="scroll"
            style="height: 50vh;"
            :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'"
            ref="chatScrollArea"
          >
            <div class="q-pa-md row justify-center">
              <div style="width: 100%; max-width: 500px">
                <div v-if="(getChatMessages || []).length === 0" class="text-center text-grey q-py-md">
                  No hay mensajes aún. ¡Escribe el primero!
                </div>
                <q-chat-message
                  v-for="msg in (getChatMessages || [])"
                  :key="msg.id"
                  :name="msg.created_by === getMe?.id ? 'Yo' : activeChatPurchase?.artist?.name"
                  :avatar="msg.created_by === getMe?.id ? (getMe?.image_profile || getMe?.image || 'https://cdn.quasar.dev/img/avatar4.jpg') : activeChatPurchase?.artist?.image"
                  :text="[msg.message]"
                  :sent="msg.created_by === getMe?.id"
                  :bg-color="msg.created_by === getMe?.id ? 'primary' : ($q.dark.isActive ? 'grey-8' : 'positive')"
                  :text-color="msg.created_by === getMe?.id ? 'white' : ($q.dark.isActive ? 'white' : 'black')"
                  :stamp="getStamp(msg)"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions
            v-if="getIsChatActive && !chatBackendErrorMessage"
            class="q-pa-md"
            :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'"
            :style="$q.dark.isActive ? 'border-top: 1px solid #424242;' : 'border-top: 1px solid #e0e0e0;'"
          >
            <q-input
              v-model="newMessage"
              outlined
              dense
              class="full-width"
              placeholder="Escribe un mensaje..."
              @keyup.enter="sendMessage"
              :bg-color="$q.dark.isActive ? 'grey-9' : 'white'"
              :label-color="$q.dark.isActive ? 'grey-4' : 'grey-8'"
            >
              <template v-slot:after>
                <q-btn round dense flat icon="send" color="primary" @click="sendMessage" />
              </template>
            </q-input>
          </q-card-actions>
          <q-card-actions
            v-else
            class="q-pa-md justify-center items-center text-center animate__animated animate__fadeIn"
            :class="$q.dark.isActive ? 'bg-grey-9 text-grey-4' : 'bg-grey-5 text-grey-1'"
            style="border-top: 1px solid rgba(0, 0, 0, 0.1); min-height: 90px; flex-direction: column;"
          >
            <div class="row items-center justify-center q-gutter-xs q-mb-xs">
              <span class="text-weight-bold text-subtitle1">Chat Deshabilitado</span>
            </div>
            <div class="text-body2 text-weight-medium">
              {{ chatBackendErrorMessage || 'El chat ha sido deshabilitado debido a que el evento ha concluido. Gracias por usar nuestra plataforma, esperamos verte pronto en un nuevo evento.' }}
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="cancelDialog" persistent>
        <q-card style="width: 480px; border-radius: 16px" class="q-pa-md">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-negative text-weight-bold">Cancelar evento</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup color="grey" />
          </q-card-section>
          <q-separator class="q-my-md" />
          <q-card-section v-if="cancelSale" class="q-pt-none">
            <div class="text-weight-bold q-mb-sm">¿Estás seguro de cancelar este evento?</div>
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Artista</q-item-label>
                  <q-item-label class="text-weight-medium">{{ cancelSale.artist?.name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Fecha del evento</q-item-label>
                  <q-item-label class="text-weight-medium">{{ formatDate(cancelSale.event_date) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Días restantes</q-item-label>
                  <q-item-label class="text-weight-medium">{{ cancelDaysUntil }} días</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Monto del evento</q-item-label>
                  <q-item-label class="text-weight-medium text-positive">
                    ${{ Number(cancelSale.amount || 0).toLocaleString('es-MX') }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="cancelPenaltyPercentage > 0">
                <q-item-section>
                  <q-item-label caption>Penalización</q-item-label>
                  <q-item-label class="text-weight-medium text-negative">
                    {{ cancelPenaltyPercentage }}% (${{ Number(cancelPenaltyAmount).toLocaleString('es-MX') }})
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-else>
                <q-item-section>
                  <q-item-label caption>Penalización</q-item-label>
                  <q-item-label class="text-weight-medium text-positive">0% (Sin penalización)</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Reembolso</q-item-label>
                  <q-item-label class="text-weight-medium text-primary">
                    ${{ Number(cancelRefundAmount).toLocaleString('es-MX') }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-input
              v-model="cancelReason"
              type="textarea"
              outlined
              dense
              rows="3"
              label="Motivo de la cancelación *"
              placeholder="Explica por qué cancelas el evento..."
              :rules="[val => !!val || 'El motivo es requerido']"
              class="q-mt-md"
            />
          </q-card-section>
          <q-card-actions align="right" class="q-pt-md">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
            <q-btn unelevated rounded color="negative" label="Sí, cancelar evento" :loading="cancelLoading" @click="confirmCancel" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-container>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";
import { api } from "boot/axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

let $q;
export default {
  data() {
    return {
      filterName: "",
      filterDate: "",
      showModal: false,
      selectedPurchase: null,
      isChatDialogOpen: false,
      newMessage: "",
      activeChatPurchase: null,
      chatPolling: null,
      isRatingModalOpen: false,
      transactionToRate: null,
      ratingValue: 0,
      isLoadingRating: false,
      showRegeneratedRefDialog: false,
      regeneratedRef: null,
      isExporting: false,
      cancelDialog: false,
      cancelSale: null,
      cancelReason: '',
      cancelPenaltyPercentage: 0,
      cancelPenaltyAmount: 0,
      cancelRefundAmount: 0,
      cancelLoading: false,
      chatBackendErrorMessage: "",
    };
  },
  methods: {
    ...mapActions("orderDetails", [
      "viewPurchaseHistory",
      "fetchChatMessages",
      "sendChatMessage",
      "fetchArtistRating",
      "submitArtistRating"
    ]),
    ...mapActions("userSanctions", [
      "evaluateCancellationSanction"
    ]),

    formatDueDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const time = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      return `${day}/${month}/${year} ${time}`;
    },
    formatDate(rawDate) {
      if (!rawDate) return 'N/A';
      
      const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      const datePart = rawDate.split('T')[0];
      const parts = datePart.split('-');
      
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1; 
        const day = parseInt(parts[2], 10);
        
        return `${day} de ${months[monthIndex]} del ${year}`;
      }
      const parsedDate = new Date(rawDate);
      const day = parsedDate.getDate();
      const monthIndex = parsedDate.getMonth();
      const year = parsedDate.getFullYear();

      return `${day} de ${months[monthIndex]} del ${year}`;
    },
    formatChatDate(rawDate) {
      if (!rawDate) return '';
      const date = new Date(rawDate);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    getStamp(msg) {
      const time = this.formatChatDate(msg.created_at);
      if (msg.created_by === this.getMe?.id) {
        return msg.is_read ? `${time}  ✓✓` : `${time}  ✓`;
      }
      return time;
    },
    openOrderModal(purchase) {
      this.selectedPurchase = purchase;
      this.showModal = true;
    },
    eventStatusColor(status) {
      if (status === 'completed') return 'positive';
      if (status === 'expired' || status === 'rejected') return 'negative';
      if (status === 'cancelled') return 'grey';
      return 'orange'; 
    },
    eventStatusLabel(status) {
      if (status === 'completed') return 'Completado';
      if (status === 'rejected') return 'Rechazado';
      if (status === 'expired') return 'Expirado';
      if (status === 'cancelled') return 'Cancelado';
      return 'Pendiente';
    },
    paymentStatusLabel(purchase) {
      if (purchase.approval_status === 'pending_approval') return 'Esperando confirmación del artista';
      if (purchase.approval_status === 'rejected') return 'Rechazada por el artista';
      if (purchase.approval_status === 'expired') return 'Solicitud expirada';
      return purchase.status === 'completed' ? 'Completado' : 'Pendiente';
    },
    paymentStatusColor(purchase) {
      if (purchase.approval_status === 'pending_approval') return 'orange';
      if (purchase.approval_status === 'rejected' || purchase.approval_status === 'expired') return 'negative';
      return purchase.status === 'completed' ? 'green' : 'orange';
    },
    isEventCompleted(purchase) {
      return purchase && purchase.event_status === 'completed';
    },
    isEventPast(purchase) {
      if (!purchase?.event_date) return false;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const datePart = purchase.event_date.split('T')[0];
      const parts = datePart.split('-');
      if (parts.length === 3) {
        const eventDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return today > eventDate;
      }
      return new Date() > new Date(purchase.event_date);
    },
    async openRatingModal(purchase) {
      this.transactionToRate = purchase;
      this.ratingValue = this.getArtistRatings[purchase.id] || 0;
      this.isRatingModalOpen = true;
      this.isLoadingRating = true;

      try {
        await this.fetchArtistRating({
          artistId: purchase.artist.id,
          purchaseId: purchase.id
        });
        this.ratingValue = this.getArtistRatings[purchase.id] || 0;
      } catch (e) {
        console.error("No se pudo cargar la calificación previa", e);
      } finally {
        this.isLoadingRating = false;
      }
    },
    async submitTransactionRating(val) {
      if (!val || val === 0) return;

      try {
        await this.submitArtistRating({
          artistId: this.transactionToRate.artist.id,
          purchaseId: this.transactionToRate.id,
          rating: val
        });

        this.$q.notify({
          type: "positive",
          message: "¡Calificación guardada con éxito!",
          position: "top"
        });
        
        setTimeout(() => {
          this.isRatingModalOpen = false;
        }, 600);

      } catch (err) {
        console.error("Error al calificar:", err);
        this.$q.notify({
          type: "negative",
          message: "Error al guardar la calificación",
          position: "top"
        });
      }
    },
    async openChat(purchase) {
      this.$store.commit("orderDetails/setChatMessages", []);
      this.$store.commit("orderDetails/setChatActive", true);
      
      this.activeChatPurchase = purchase;
      this.newMessage = "";
      this.chatBackendErrorMessage = ""; 
      
      try {
        await this.fetchChatMessages(purchase.id);
      } catch (error) {
        console.error("Error al cargar mensajes iniciales:", error);
        this.chatBackendErrorMessage = error.response?.data?.message || "Error al conectar con el chat";
      }
      this.isChatDialogOpen = true;
      this.scrollToBottom();
    },
    async sendMessage() {
      const messageText = this.newMessage.trim();
      if (messageText !== "") {
        const payload = {
          artist_sale_id: this.activeChatPurchase.id,
          message: messageText,
        };

        try {
          const sentMessage = await this.sendChatMessage(payload);
          if (sentMessage) {
            this.newMessage = "";
            await this.fetchChatMessages(this.activeChatPurchase.id);
            this.scrollToBottom();
          }
        } catch (error) {
          console.error("Error al enviar mensaje:", error);
          this.chatBackendErrorMessage = error.response?.data?.message || "El chat ha sido deshabilitado.";
          if (this.chatPolling) {
            clearInterval(this.chatPolling);
            this.chatPolling = null;
          }
        }
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatScrollArea) {
          const scrollTarget = this.$refs.chatScrollArea.$el || this.$refs.chatScrollArea;
          scrollTarget.scrollTop = scrollTarget.scrollHeight;
        }
      });
    },

    async downloadReceipt(purchase) {
      const token = localStorage.getItem('token');
      let accessToken = '';
      try { accessToken = JSON.parse(token).access_token; } catch(e) {}
      try {
        const response = await fetch(`${api.defaults.baseURL}api/client/sales/${purchase.id}/receipt`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          this.$q.notify({ type: 'negative', message: err.message || 'Error al descargar', position: 'top' });
          return;
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-vibeer-${String(purchase.id).padStart(8, '0')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        this.$q.notify({ type: 'negative', message: 'Error al descargar el recibo', position: 'top' });
      }
    },
    
    viewReference(purchase) {
      this.regeneratedRef = {
        store: purchase.store,
        reference: purchase.cash_reference,
        barcode: purchase.cash_barcode_url,
        amount: purchase.amount,
        due_date: purchase.cash_due_date,
      };
      this.showRegeneratedRefDialog = true;
    },

    async captureRegeneratedReceipt() {
      this.isExporting = true;
      await this.$nextTick();

      const canvas = await html2canvas(this.$refs.regeneratedReceipt, {
        scale: 1,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowHeight: this.$refs.regeneratedReceipt.scrollHeight,
      });

      this.isExporting = false;
      return canvas;
    },

    async downloadRefImage() {
      this.$q.loading.show({ message: 'Generando imagen...', spinnerColor: 'primary' });
      try {
        const canvas = await this.captureRegeneratedReceipt();
        const ref = this.regeneratedRef?.reference || 'referencia';
        const link = document.createElement('a');
        link.download = `${ref}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        this.$q.notify({ type: 'positive', message: 'Imagen descargada', position: 'top' });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: 'negative', message: 'Error al descargar la imagen', position: 'top' });
      } finally {
        this.$q.loading.hide();
      }
    },

    async downloadRefPDF() {
      this.$q.loading.show({ message: 'Generando PDF...', spinnerColor: 'primary' });
      try {
        const canvas = await this.captureRegeneratedReceipt();
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
        const finalRatio = ratio * 0.85;
        const imgWidth = canvas.width * finalRatio;
        const imgHeight = canvas.height * finalRatio;
        const marginX = (pdfWidth - imgWidth) / 2;
        const marginY = 15;

        pdf.addImage(imgData, 'PNG', marginX, marginY, imgWidth, imgHeight);

        const ref = this.regeneratedRef?.reference || 'referencia';
        pdf.save(`${ref}.pdf`);
        
        this.$q.notify({ type: 'positive', message: 'PDF descargado', position: 'top' });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: 'negative', message: 'Error al descargar el PDF', position: 'top' });
      } finally {
        this.$q.loading.hide();
      }
    },
    
    goToReport(purchase) {
      this.showModal = false;
      this.$router.push({ name: 'client.report-incident', params: { saleId: purchase.id } });
    },
    canCancel(purchase) {
      if (!purchase) return false;
      if (purchase.event_status === 'completed' || purchase.event_status === 'cancelled') return false;
      if (!purchase.event_date) return false;
      const now = new Date();
      const eventDate = new Date(purchase.event_date);
      const diffTime = eventDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0;
    },
    detailCancelEvent(purchase) {
      this.showModal = false;
      this.$nextTick(() => this.openCancelDialog(purchase));
    },
    openCancelDialog(purchase) {
      this.cancelSale = purchase;
      this.cancelReason = '';
      this.cancelPenaltyPercentage = 0;
      this.cancelPenaltyAmount = 0;
      this.cancelRefundAmount = 0;
      if (purchase.event_date) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventDate = new Date(purchase.event_date);
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const amount = parseFloat(purchase.amount) || 0;
        let penalty = 0;
        if (purchase.approval_status === 'accepted') {
          if (diffDays >= 3 && diffDays < 7) penalty = 25;
          if (diffDays >= 1 && diffDays < 3) penalty = 50;
        }
        this.cancelPenaltyPercentage = penalty;
        this.cancelPenaltyAmount = Math.round(amount * (penalty / 100) * 100) / 100;
        this.cancelRefundAmount = amount - this.cancelPenaltyAmount;
      }
      this.cancelDialog = true;
    },
    async confirmCancel() {
      if (!this.cancelReason.trim()) {
        this.$q.notify({ type: 'negative', message: 'Debes ingresar un motivo de cancelación' });
        return;
      }
      this.cancelLoading = true;
      try {
        const response = await api.post(`/api/client/sales/${this.cancelSale.id}/cancel`, { reason: this.cancelReason });
        const saleId = this.cancelSale.id;

        if (saleId) {
          await this.evaluateCancellationSanction(saleId);
        }
        if (!saleId) {
          console.warn("No se pudo obtener el ID de la venta para evaluar la sanción.");
        }

        this.$q.notify({ type: 'positive', message: response.data.message });
        this.cancelDialog = false;
        this.cancelSale = null;
        this.cancelReason = '';
        await this.viewPurchaseHistory();
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.response?.data?.message || 'Error al cancelar el evento' });
      } finally {
        this.cancelLoading = false;
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("orderDetails", ["stateListShopingCard", "getChatMessages", "getArtistRatings", "getIsChatActive"]),
    dateOptions() {
      const currentYear = new Date().getFullYear();
      return [
        "Todas",
        "Este mes",
        "Mes pasado",
        "Este año",
        ...Array(currentYear - 2019)
          .fill()
          .map((_, i) => `${currentYear - i - 1}`),
      ];
    },
    filteredPurchases() {
      return this.stateListShopingCard.filter((purchase) => {
        const artistMatch = purchase.artist?.name ? purchase.artist.name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().includes((this.filterName || '').normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()) : false;
        let dateMatch = true;

        if (this.filterDate && this.filterDate !== "Todas") {
          const purchaseDate = new Date(purchase.created_at);
          const now = new Date();
          switch (this.filterDate) {
            case "Este mes":
              dateMatch =
                now.getMonth() === purchaseDate.getMonth() &&
                now.getFullYear() === purchaseDate.getFullYear();
              break;
            case "Mes pasado":
              dateMatch =
                now.getMonth() - 1 === purchaseDate.getMonth() &&
                now.getFullYear() === purchaseDate.getFullYear();
              break;
            case "Este año":
              dateMatch = now.getFullYear() === purchaseDate.getFullYear();
              break;
            default:
              dateMatch = parseInt(this.filterDate) === purchaseDate.getFullYear();
          }
        }

        return artistMatch && dateMatch;
      });
    },
    cancelDaysUntil() {
      if (!this.cancelSale?.event_date) return 0;
      const now = new Date();
      const eventDate = new Date(this.cancelSale.event_date);
      const diffTime = eventDate.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
  },
  created() {
    this.viewPurchaseHistory();
    console.log("My_Order_Details component created, calling viewPurchaseHistory");
  },
  watch: {
    stateListShopingCard(newVal) {
      console.log("stateListShopingCard updated:", newVal);
    },
    isChatDialogOpen(newVal) {
      if (!newVal) {
        if (this.chatPolling) {
          clearInterval(this.chatPolling);
          this.chatPolling = null;
        }
        return;
      }

      if (!this.getIsChatActive || this.chatBackendErrorMessage) {
        return;
      }

      this.chatPolling = setInterval(() => {
        if (this.activeChatPurchase) {
          this.fetchChatMessages(this.activeChatPurchase.id);
        }
      }, 3000);
    },
    getChatMessages(newVal, oldVal) {
      if (newVal && oldVal && newVal.length > oldVal.length) {
        this.scrollToBottom();
      }
    }
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>

<style scoped>
.table-responsive {
  width: 100%;
}

:deep(.q-message-avatar) {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
}
</style>
