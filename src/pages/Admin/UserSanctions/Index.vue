<template>
  <q-page class="q-pa-md">

    <q-table
      :rows="filteredUsers"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20]"
      flat
      bordered
      class="sales-table"
      no-data-label="Sin registros"
      no-results-label="No hay registros que coincidan."
      rows-per-page-label="Usuarios por página"
      :grid="$q.screen.lt.md"
    >
      <template v-slot:top-left>
        <p class="text-h5 q-mb-none q-mt-sm">Monitoreo de Sanciones</p>
      </template>

      <template v-slot:top-right>
        <div class="row q-gutter-sm items-center">
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            dense
            emit-value
            map-options
            label="Filtrar por estado"
            color="primary"
            style="min-width: 220px;"
          />
          <q-input 
            dense 
            debounce="300" 
            color="primary" 
            v-model="searchQuery"
            placeholder="Buscar..."
            clearable
            style="min-width: 220px;"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <template v-slot:body-cell-user="props">
        <q-td :props="props" class="text-center">
          <div class="text-weight-bold">{{ props.row.name }}</div>
          <div class="text-caption text-grey">{{ props.row.email }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-tickets_against="props">
        <q-td :props="props" class="text-center">
          <q-badge 
            v-if="props.row.tickets_against_count > 0" 
            color="negative" 
            class="q-pa-sm text-weight-bold"
          >
            {{ props.row.tickets_against_count }} {{ props.row.tickets_against_count === 1 ? 'Ticket' : 'Tickets' }}
          </q-badge>
          <span v-else class="text-body2 text-grey-6 text-weight-regular">Sin tickets</span>
        </q-td>
      </template>

      <template v-slot:body-cell-faults="props">
        <q-td :props="props" class="text-center">
          <q-badge 
            v-if="props.row.faults_count > 0" 
            :color="props.row.faults_count >= 2 ? 'negative' : 'warning'" 
            class="q-pa-sm text-weight-bold"
          >
            {{ props.row.faults_count }} {{ props.row.faults_count === 1 ? 'Cancelación' : 'Cancelaciones' }}
          </q-badge>
          <span v-else class="text-body2 text-grey-6 text-weight-regular">Sin cancelaciones</span>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props" class="text-center">
          <q-badge 
            :color="getStatusColor(props.row.account_status)" 
            class="q-pa-sm text-weight-bold"
          >
            {{ formatStatus(props.row.account_status) }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <q-btn
            round
            unelevated
            color="secondary"
            size="sm"
            icon="visibility"
            class="q-mr-sm"
            @click="openHistoryModal(props.row)"
          >
            <q-tooltip class="bg-secondary text-body2">Ver Historial</q-tooltip>
          </q-btn>
          <q-btn
            round
            unelevated
            :color="props.row.account_status === 'active' ? 'primary' : 'warning'"
            size="sm"
            :icon="props.row.account_status === 'active' ? 'gavel' : 'lock'"
            @click="openSanctionModal(props.row)"
          >
            <q-tooltip :class="props.row.account_status === 'active' ? 'bg-primary text-body2' : 'bg-warning text-body2 text-dark'">
              {{ props.row.account_status === 'active' ? 'Sancionar' : 'Administrar' }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card class="q-pa-sm">
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label caption>{{ col.label }}</q-item-label>
                  
                  <q-item-label v-if="col.name === 'user'">
                    <div class="text-weight-bold">{{ props.row.name }}</div>
                    <div class="text-caption text-grey">{{ props.row.email }}</div>
                  </q-item-label>
                  
                  <q-item-label v-else-if="col.name === 'tickets_against'">
                    <q-badge v-if="props.row.tickets_against_count > 0" color="negative" class="q-pa-xs text-weight-bold">
                      {{ props.row.tickets_against_count }} Tickets
                    </q-badge>
                    <span v-else class="text-body2 text-grey-6">Sin tickets</span>
                  </q-item-label>
                  
                  <q-item-label v-else-if="col.name === 'faults'">
                    <q-badge v-if="props.row.faults_count > 0" :color="props.row.faults_count >= 2 ? 'negative' : 'warning'" class="q-pa-xs text-weight-bold">
                      {{ props.row.faults_count }} Cancelaciones
                    </q-badge>
                    <span v-else class="text-body2 text-grey-6">Sin cancelaciones</span>
                  </q-item-label>
                  
                  <q-item-label v-else-if="col.name === 'status'">
                    <q-badge :color="getStatusColor(props.row.account_status)" class="q-pa-xs text-weight-bold">
                      {{ formatStatus(props.row.account_status) }}
                    </q-badge>
                  </q-item-label>
                  <q-item-label v-else-if="col.name === 'actions'" class="q-mt-xs">
                    <q-btn
                      round
                      unelevated
                      color="secondary"
                      size="sm"
                      icon="visibility"
                      class="q-mr-sm"
                      @click="openHistoryModal(props.row)"
                    >
                      <q-tooltip class="bg-secondary text-body2">Ver Historial</q-tooltip>
                    </q-btn>
                    <q-btn
                      round
                      unelevated
                      :color="props.row.account_status === 'active' ? 'primary' : 'warning'"
                      size="sm"
                      :icon="props.row.account_status === 'active' ? 'gavel' : 'lock'"
                      @click="openSanctionModal(props.row)"
                    >
                      <q-tooltip :class="props.row.account_status === 'active' ? 'bg-primary text-body2' : 'bg-warning text-body2 text-dark'">
                        {{ props.row.account_status === 'active' ? 'Sancionar' : 'Administrar' }}
                      </q-tooltip>
                    </q-btn>
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

    <q-dialog v-model="showModal" persistent>
      <q-card style="width: 650px; max-width: 90vw;" class="custom-dialog">
        <q-card-section class="row items-center bg-primary text-white q-pb-md">
          <div class="text-h6">Administrar a {{ selectedUser?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div v-if="selectedUser?.account_status !== 'active'" class="text-center q-pa-md">
            <q-icon name="warning" color="warning" size="4rem" />
            <p class="text-h6 q-mt-sm">Este usuario se encuentra <span class="text-weight-bold">{{ formatStatus(selectedUser?.account_status) }}</span>.</p>
            
            <p :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">
              ¿Deseas levantar <strong>la restricción</strong> y reactivar su cuenta anticipadamente?
            </p>
            
            <q-btn 
              color="positive" 
              icon="check_circle" 
              label="Levantar Restricción" 
              class="full-width q-mt-md text-weight-bold" 
              @click="submitRevokeSanction" 
              :loading="submitting"
            />
          </div>

          <q-form v-if="selectedUser?.account_status === 'active'" @submit="submitSanction" class="q-gutter-md mt-4">
            <q-select 
              v-model="form.ticket_id" :options="userTicketsOptions" label="Ticket Resuelto en su contra *" emit-value map-options :loading="loadingTickets" :disable="userTicketsOptions.length === 0" :hint="userTicketsOptions.length === 0 ? 'Este usuario no tiene tickets resueltos en su contra.' : 'Selecciona el ticket que justifica el castigo'" :rules="[val => !!val || 'Debes seleccionar un ticket obligatorio']"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="items-center">
                  <q-item-section>
                    <q-item-label class="text-weight-bold row items-center">
                      <span>Ticket #{{ scope.opt.value }}</span>
                      <q-badge :color="getCategoryColor(scope.opt.categoryRaw)" class="q-ml-sm q-px-sm py-1">{{ formatTicketCategory(scope.opt.categoryRaw) }}</q-badge>
                    </q-item-label>
                    <q-item-label caption lines="2" class="q-mt-xs">{{ scope.opt.description }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn flat rounded color="primary" icon="visibility" label="VER" size="sm" @click.stop="goToTicket(scope.opt.value)" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select v-model="form.type" :options="sanctionTypes" label="Tipo de Sanción *" emit-value map-options :rules="[val => !!val || 'Selecciona un nivel de severidad']" />
            
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input 
                  dense readonly clearable
                  v-model="form.starts_at" 
                  label="Inicio (Opcional)" 
                  hint="Si está vacío, la sanción inicia AHORA" 
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <div :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-dark'">
                          <q-tabs v-model="tabStartsAt" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
                            <q-tab name="date" icon="event" label="Fecha" />
                            <q-tab name="time" icon="schedule" label="Hora" />
                          </q-tabs>
                          <q-separator />
                          <q-tab-panels v-model="tabStartsAt" animated class="bg-transparent">
                            <q-tab-panel name="date" class="q-pa-none">
                              <q-date v-model="form.starts_at" mask="YYYY-MM-DD HH:mm" :locale="spanishLocale()" :options="startDateOption" flat :dark="$q.dark.isActive" />
                            </q-tab-panel>
                            <q-tab-panel name="time" class="q-pa-none">
                              <q-time v-model="form.starts_at" mask="YYYY-MM-DD HH:mm" :options="startTimeOption" flat format24h :dark="$q.dark.isActive" />
                            </q-tab-panel>
                          </q-tab-panels>
                          <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </div>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              
              <div class="col-12 col-sm-6">
                <q-input 
                  dense readonly clearable
                  v-model="form.ends_at" 
                  label="Término (Opcional)" 
                  :hint="!form.starts_at ? 'Primero define el inicio' : 'Si está vacío, es indefinido'"
                  :disable="!form.starts_at"
                >
                  <template v-slot:append>
                    <q-icon v-if="form.starts_at" name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <div :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-dark'">
                          <q-tabs v-model="tabEndsAt" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
                            <q-tab name="date" icon="event" label="Fecha" />
                            <q-tab name="time" icon="schedule" label="Hora" />
                          </q-tabs>
                          <q-separator />
                          <q-tab-panels v-model="tabEndsAt" animated class="bg-transparent">
                            <q-tab-panel name="date" class="q-pa-none">
                              <q-date v-model="form.ends_at" mask="YYYY-MM-DD HH:mm" :locale="spanishLocale()" :options="endDateOption" flat :dark="$q.dark.isActive" />
                            </q-tab-panel>
                            <q-tab-panel name="time" class="q-pa-none">
                              <q-time v-model="form.ends_at" mask="YYYY-MM-DD HH:mm" :options="endTimeOption" flat format24h :dark="$q.dark.isActive" />
                            </q-tab-panel>
                          </q-tab-panels>
                          <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </div>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <q-input v-model="form.reason" type="textarea" label="Motivo / Razón de la sanción *" lazy-rules :rules="[val => val && val.length > 3 || 'El motivo es obligatorio']" />

            <div class="row justify-end q-mt-lg">
              <q-btn label="Cancelar" flat color="grey" v-close-popup />
              <q-btn label="Aplicar Sanción" type="submit" color="negative" :loading="submitting" :disable="userTicketsOptions.length === 0" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showHistoryModal">
      <q-card style="width: 800px; max-width: 90vw;" class="custom-dialog">
        <q-card-section class="row items-center text-white q-pb-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <div class="text-h6">
            Historial de <span class="text-weight-bold">{{ selectedHistoryUser?.name }}</span>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="loadingHistory" class="flex flex-center q-pa-xl">
          <q-spinner-dots color="primary" size="3em" />
        </q-card-section>

        <q-card-section v-if="!loadingHistory" class="q-pa-none">
          <q-tabs
            v-model="historyTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="sanctions" icon="gavel" label="Sanciones" />
            <q-tab name="tickets" icon="feedback" label="Tickets (Historial)" />
            <q-tab name="faults" icon="event_busy" label="Cancelaciones (Historial)" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="historyTab" animated :class="$q.dark.isActive ? 'bg-transparent' : 'bg-grey-1'">
            
            <q-tab-panel name="sanctions">
              <div v-if="historyData.sanctions.length === 0" class="text-center text-grey q-pa-lg">
                <q-icon name="thumb_up" size="3em" color="grey-4" class="q-mb-sm" />
                <div>Excelente historial. No hay sanciones registradas.</div>
              </div>
              <q-list v-if="historyData.sanctions.length > 0" separator class="rounded-borders" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
                <q-item v-for="sanction in historyData.sanctions" :key="sanction.id" class="q-py-md">
                  <q-item-section avatar top>
                    <q-avatar 
                      color="warning" 
                      text-color="white" 
                      icon="warning" 
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-subtitle1 q-mb-sm text-warning">
                      {{ formatStatus(sanction.type) }}
                    </q-item-label>

                    <div class="detail-row">
                      <q-icon name="gavel" size="20px" color="grey-6" />
                      <div>
                        <div class="detail-label">Motivo de la Sanción</div>
                        <div class="detail-value">{{ sanction.reason }}</div>
                      </div>
                    </div>

                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <div class="detail-row">
                          <q-icon name="event" size="20px" color="grey-6" />
                          <div>
                            <div class="detail-label">Inició</div>
                            <div class="detail-value">{{ formatDate(sanction.starts_at || sanction.created_at) }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-sm-6">
                        <div class="detail-row">
                          <q-icon name="event_busy" size="20px" color="grey-6" />
                          <div>
                            <div class="detail-label">Termina / Terminó</div>
                            <div class="detail-value">
                              {{ sanction.ends_at ? formatDate(sanction.ends_at) : 'Indefinido' }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="tickets">
              <div v-if="historyData.tickets.length === 0" class="text-center text-grey q-pa-lg">
                <q-icon name="sentiment_very_satisfied" size="3em" color="grey-4" class="q-mb-sm" />
                <div>Nadie ha levantado tickets en contra de este usuario.</div>
              </div>
              <q-list v-if="historyData.tickets.length > 0" separator class="rounded-borders" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
                <q-item v-for="ticket in historyData.tickets" :key="ticket.id" class="q-py-md">
                  <q-item-section avatar top>
                    <q-avatar color="orange-2" text-color="orange-9" icon="receipt_long" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-subtitle1 text-orange-9 q-mb-sm">
                      Ticket #{{ ticket.id }} - {{ formatTicketCategory(ticket.category) }}
                    </q-item-label>

                    <div class="detail-row">
                      <q-icon name="description" size="20px" color="grey-6" />
                      <div>
                        <div class="detail-label">Detalle del Reporte</div>
                        <div class="detail-value">{{ ticket.description }}</div>
                      </div>
                    </div>

                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <div class="detail-row">
                          <q-icon name="event" size="20px" color="grey-6" />
                          <div>
                            <div class="detail-label">Fecha del reporte</div>
                            <div class="detail-value">{{ formatDate(ticket.created_at) }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-sm-6">
                        <div class="detail-row">
                          <q-icon name="person" size="20px" color="grey-6" />
                          <div>
                            <div class="detail-label">Reportado por</div>
                            <div class="detail-value">{{ ticket.reporter?.name || 'Desconocido' }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item-section>
                  <q-item-section side top>
                    <q-btn flat dense color="primary" class="text-weight-bold" label="VER" size="sm" @click="goToTicket(ticket.id)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="faults">
              <div v-if="combinedFaults.length === 0" class="text-center text-grey q-pa-lg">
                <q-icon name="event_available" size="3em" color="grey-4" class="q-mb-sm" />
                <div>Este usuario no tiene cancelaciones registradas.</div>
              </div>
              <q-list v-if="combinedFaults.length > 0" separator class="rounded-borders" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
                <q-item v-for="fault in combinedFaults" :key="fault.id" class="q-py-md">
                  <q-item-section avatar top>
                    <q-avatar color="red-2" text-color="negative" icon="event_busy" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-subtitle1 text-negative q-mb-sm">
                      {{ fault.title }}
                    </q-item-label>
                    
                    <div class="detail-row">
                      <q-icon name="gavel" size="20px" color="grey-6" />
                      <div>
                        <div class="detail-label">Motivo</div>
                        <div class="detail-value">{{ fault.reason }}</div>
                      </div>
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <div class="detail-row">
                          <q-icon name="event" size="20px" color="grey-6" />
                          <div>
                            <div class="detail-label">Fecha de la Falta</div>
                            <div class="detail-value">{{ formatDate(fault.created_at) }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-sm-6">
                        <div class="detail-row">
                          <q-icon name="schedule" size="20px" color="grey-6" />
                          <div>
                            <div class="detail-label">Evento Afectado</div>
                            <div class="detail-value">{{ fault.event_date }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { api } from 'boot/axios';

let $q;

const columns = [
  { name: "user", required: true, label: "Usuario", align: "center", field: "name", sortable: true },
  { name: "tickets_against", label: "Tickets (Historial)", align: "center", field: "tickets_against_count", sortable: true },
  { name: "faults", label: "Cancelaciones (Historial)", align: "center", field: "faults_count", sortable: true },
  { 
    name: "status", 
    label: "Estado de Cuenta", 
    align: "center", 
    field: "account_status", 
    sortable: true,
    sort: (a, b, rowA, rowB) => (rowA.status_weight || 0) - (rowB.status_weight || 0)
  },
  { name: "actions", label: "Acciones", align: "center" },
];

const statusOptions = [
  { label: "Todos los usuarios", value: "all" },
  { label: "Usuarios Activos", value: "active" },
  { label: "Restringidos", value: "restricted" },
  { label: "Con historial de sanciones", value: "has_sanctions" },
];

const sanctionTypes = [
  { label: "Restringido", value: "restricted" },
];

const TICKET_CATEGORIES = {
  no_show: "No se presentó",
  delay: "Retraso / Cancelación",
  bad_service: "Mal servicio",
  cancellation: "Cancelación",
  other: "Otro",
};

const TICKET_COLORS = {
  no_show: "negative",
  delay: "orange",
  bad_service: "deep-orange",
  cancellation: "red",
  other: "grey",
};

const ACCOUNT_STATUS_MAP = {
  active: "ACTIVO",
  restricted: "RESTRINGIDO",
};

const ACCOUNT_STATUS_COLORS = {
  active: "positive",
  restricted: "warning",
};

export default {
  data() {
    return {
      columns,
      statusOptions,
      sanctionTypes,
      loading: false,
      submitting: false,
      loadingTickets: false,
      showModal: false,
      selectedUser: null,
      pollingTimeout: null,
      searchQuery: "",
      statusFilter: "all",
      
      tabStartsAt: 'date',
      tabEndsAt: 'date',
      
      pagination: {
        sortBy: "status",
        descending: true,
        rowsPerPage: 10, 
      },
      form: {
        ticket_id: null,
        type: null,
        starts_at: null,
        ends_at: null,
        reason: "",
      },
      showHistoryModal: false,
      loadingHistory: false,
      historyTab: 'sanctions',
      selectedHistoryUser: null,
      historyData: {
        sanctions: [],
        tickets: [],
        cancellations: []
      }
    };
  },
  computed: {
    ...mapGetters("userSanctions", ["stateUserSanctions", "stateUserTickets"]),
    ...mapGetters("auth", ["getMe"]),
    
    users() {
      const data = this.stateUserSanctions;
      const currentAdminId = this.getMe?.id;
      if (Array.isArray(data)) return data.filter(u => u.id !== currentAdminId);
      if (data?.data) return data.data.filter(u => u.id !== currentAdminId);
      return [];
    },
    
    filteredUsers() {
      let result = this.users;

      if (this.statusFilter !== "all") {
        if (this.statusFilter === "has_sanctions") {
          result = result.filter((u) => u.sanctions_count > 0);
        }
        if (this.statusFilter !== "has_sanctions") {
          result = result.filter((u) => u.account_status === this.statusFilter);
        }
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(
          (u) =>
            (u.name && u.name.toLowerCase().includes(query)) ||
            (u.email && u.email.toLowerCase().includes(query)) ||
            (u.account_status && u.account_status.toLowerCase().includes(query)) ||
            (u.role_name && u.role_name.toLowerCase().includes(query))
        );
      }

      return result;
    },
    
    userTicketsOptions() {
      const tickets = this.stateUserTickets || [];
      return tickets.map((t) => ({
        label: `Ticket #${t.id} - ${this.formatTicketCategory(t.category)}`,
        value: t.id,
        categoryRaw: t.category,
        description: t.description,
      }));
    },

    combinedFaults() {
      if (!this.historyData) return [];

      let cancels = (this.historyData.cancellations || []).map(c => {
        let eventString = 'Fecha desconocida';
        if (c.artist_sale) eventString = `${c.artist_sale.event_date} a las ${c.artist_sale.event_hour}`;
        
        return {
          id: 'c_' + c.id,
          title: 'Cancelación Tardía',
          reason: c.cancellation_reason || 'Cancelación de evento',
          event_date: eventString,
          created_at: c.created_at
        };
      });

      return cancels.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },
  watch: {
    'form.starts_at': {
      handler(val) {
        if (!val) {
          this.form.ends_at = null;
        }
      }
    }
  },
  methods: {
    ...mapActions("userSanctions", [
      "getUserSanctions",
      "getUserTickets",
      "applySanction",
      "revokeSanction",
      "getUserHistoryAction", 
    ]),
    
    spanishLocale() {
      return {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        firstDayOfWeek: 1
      };
    },

    startDateOption(date) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}/${month}/${day}`;

      if (date < todayStr) return false;
      return true;
    },

    startTimeOption(hr, min, sec) {
      const today = new Date();
      let isToday = true;

      if (this.form.starts_at) {
        const selectedDatePart = this.form.starts_at.split(' ')[0];
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        if (selectedDatePart !== todayStr) {
          isToday = false;
        }
      }

      if (isToday) {
        if (hr < today.getHours()) return false;
        if (hr === today.getHours()) {
          if (min !== null) {
            if (min < today.getMinutes()) return false;
          }
        }
      }

      return true;
    },

    endDateOption(date) {
      if (!this.form.starts_at) return false;

      const minDateStr = this.form.starts_at.split(' ')[0].replace(/-/g, '/');
      return date >= minDateStr;
    },

    endTimeOption(hr, min, sec) {
      if (!this.form.ends_at) return true;
      if (!this.form.starts_at) return false;

      const selectedEndDatePart = this.form.ends_at.split(' ')[0];
      const minDateStr = this.form.starts_at.split(' ')[0];

      if (selectedEndDatePart === minDateStr) {
        const timePart = this.form.starts_at.split(' ')[1];
        if (timePart) {
          const minHr = parseInt(timePart.split(':')[0], 10);
          const minMin = parseInt(timePart.split(':')[1], 10);

          if (hr < minHr) return false;
            if (hr === minHr) {
              if (min !== null) {
                if (min <= minMin) return false;
            }
          }
        }
      }
      
      return true;
    },

    async fetchUsers(showSpinner = true) {
      if (showSpinner) this.loading = true;
      try {
        await this.getUserSanctions();
      } catch (err) {
        if (showSpinner) {
          $q.notify({
            type: "negative",
            message: err.response?.data?.message || "Error al cargar los usuarios",
          });
        }
      } finally {
        if (showSpinner) this.loading = false;
      }
    },
    
    async startPolling() {
      this.pollingTimeout = setTimeout(async () => {
        await this.fetchUsers(false);
        this.startPolling(); 
      }, 30000);
    },
    
    async openSanctionModal(user) {
      this.selectedUser = user;
      this.form = { ticket_id: null, type: null, starts_at: null, ends_at: null, reason: "" };
      this.tabStartsAt = 'date';
      this.tabEndsAt = 'date';
      this.showModal = true;
      
      if (user.account_status === "active") {
        this.loadingTickets = true;
        try {
          await this.getUserTickets(user.id);
        } catch (err) {
          $q.notify({
            type: "warning",
            message: "No se pudieron cargar los tickets del usuario",
          });
        } finally {
          this.loadingTickets = false;
        }
      }
    },

    async openHistoryModal(user) {
      this.selectedHistoryUser = user;
      this.historyTab = 'sanctions';
      this.showHistoryModal = true;
      this.loadingHistory = true;

      try {
        let data;
        if (typeof this.getUserHistoryAction === 'function') {
          data = await this.getUserHistoryAction(user.id);
        }
        if (typeof this.getUserHistoryAction !== 'function') {
          const response = await api.get(`/api/admin/user-sanctions/${user.id}`);
          data = response.data;
        }

        this.historyData = {
          sanctions: data.sanctions || [],
          tickets: data.tickets || [],
          cancellations: data.cancellations || []
        };
      } catch (err) {
        $q.notify({
          type: "negative",
          message: "No se pudo cargar el historial del usuario.",
        });
        this.showHistoryModal = false;
      } finally {
        this.loadingHistory = false;
      }
    },
    
    async submitSanction() {
      this.submitting = true;
      try {
        const payload = {
          user_id: this.selectedUser.id,
          ticket_id: this.form.ticket_id,
          type: this.form.type,
          starts_at: this.form.starts_at || null, 
          ends_at: this.form.ends_at || null,     
          reason: this.form.reason,
        };
        
        await this.applySanction(payload);
        
        $q.notify({
          type: "positive",
          message: "Sanción aplicada correctamente.",
        });
        
        this.showModal = false;
        this.fetchUsers(true);
      } catch (err) {
        $q.notify({
          type: "negative",
          message: err.response?.data?.message || "Ocurrió un error al aplicar la sanción.",
        });
      } finally {
        this.submitting = false;
      }
    },
    
    async submitRevokeSanction() {
      this.submitting = true;
      try {
        await this.revokeSanction(this.selectedUser.id);
        
        $q.notify({
          type: "positive",
          message: "Restricción levantada correctamente.",
        });
        
        this.showModal = false;
        this.fetchUsers(true);
      } catch (err) {
        $q.notify({
          type: "negative",
          message: err.response?.data?.message || "Error al restaurar la cuenta.",
        });
      } finally {
        this.submitting = false;
      }
    },
    
    formatTicketCategory(cat) {
      return TICKET_CATEGORIES[cat] || cat;
    },
    
    getCategoryColor(cat) {
      return TICKET_COLORS[cat] || "primary";
    },

    formatDate(dateStr) {
      if (!dateStr) return "N/A";
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    },
    
    goToTicket(ticketId) {
      this.$router.push({
        name: "admin.support-tickets-show",
        params: { id: ticketId },
        query: { from: 'sanctions' }
      });
    },
    
    getStatusColor(status) {
      return ACCOUNT_STATUS_COLORS[status] || "grey";
    },
    
    formatStatus(status) {
      return ACCOUNT_STATUS_MAP[status] || "DESCONOCIDO";
    },
  },
  created() {
    $q = this.$q;
    this.fetchUsers(true);
    this.startPolling();
  },
  beforeUnmount() {
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
    }
  },
};
</script>

<style scoped>
.sales-table {
  border-radius: 12px;
}

:deep(.q-message-avatar) {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
}

.custom-dialog .detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 12px 0;
}

.custom-dialog .detail-label {
  font-size: 12px;
  color: var(--q-color-grey-6, #8a8a8a);
  margin-bottom: 2px;
}

.custom-dialog .detail-value {
  font-size: 14px;
  font-weight: 600;
}

.body--dark .custom-dialog .detail-label {
  color: #94a3b8;
}

.chat-overlay {
  backdrop-filter: blur(4px);
  z-index: 10;
}
</style>
