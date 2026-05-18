<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
        <q-stepper v-model="step" header-nav ref="stepper" class="no-shadow" bordered animated>
          <q-step :name="1" title="Informacion del Pedido" icon="shopping_cart" :done="step > 1" :header-nav="step > 1">
            <img class="openpay" src="https://assets.stickpng.com/images/62e3c66bd889babae63d750e.png" />
            <q-form @submit="nextStep" ref="formClient1">
              <div class="row">
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined class="full-width" type="text" v-model="formClient.first_name"
                      label="Nombre *" :rules="[
                        (val) => !!val || 'El nombre es requerido',
                        (val) => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'El nombre solo puede contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined class="full-width" type="text" v-model="formClient.first_last"
                      label="Apellidos *" :rules="[
                        (val) => !!val || 'Los apellidos son requeridos',
                        (val) => val.trim().length >= 3 || 'Los apellidos deben tener al menos 3 caracteres',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'Los apellidos solo pueden contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12">
                  <q-item>
                    <q-input dense outlined type="email" v-model="formClient.email" class="full-width" label="Email*"
                      :rules="[
                        (val) => !!val || 'El email es requerido',
                        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12">
                  <q-item>
                    <q-input dense outlined type="text" v-model="formClient.adress_line2" class="full-width"
                      label="Domicilio *" :rules="[
                        (val) => !!val || 'El domicilio es requerido',
                        (val) => val.trim().length >= 5 || 'El domicilio debe tener al menos 5 caracteres'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="text" class="full-width" v-model="formClient.city" label="Cuidad *"
                      :rules="[
                        (val) => !!val || 'La ciudad es requerida',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'La ciudad solo puede contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="text" class="full-width" v-model="formClient.state_city"
                      label="Municipio" :rules="[
                        (val) => !!val || 'El estado es requerido',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'El estado solo puede contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="text" class="full-width" v-model="formClient.zip_code"
                      label="Codigo Postal" maxlength="4" @keypress="(e) => !/[0-9]/.test(e.key) && e.preventDefault()"
                      :rules="[
                        (val) => /^[0-9]+$/.test(val) || 'Solo se permiten números',
                        (val) => val.toString().length === 4 || 'El código postal debe tener exactamente 4 dígitos'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="text" v-model="formClient.country" label="Pais *" class="full-width"
                      :rules="[
                        (val) => !!val || 'El país es requerido',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'El país solo puede contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-checkbox dense outlined class="full-width"
                      label="Desea utlizar esta dirección para obtener los detalles de pago"
                      v-model="address_detail.checkbox" />
                  </q-item>
                </div>
              </div>

              <q-stepper-navigation>
                <q-btn rounded type="submit" class="float-right q-mr-md q-mb-md" color="blue"
                  label="Siguiente" />
              </q-stepper-navigation>
            </q-form>
          </q-step>

          <q-step :name="2" title="Opciones de Pago" icon="shopping_cart" :done="step > 2" :header-nav="step > 2">
            <div class="q-mb-lg">
              <div class="text-h6 q-mb-md">Selecciona tu método de pago:</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-btn 
                    :unelevated="!paymentMethod || paymentMethod !== 'card'"
                    :flat="paymentMethod === 'card'" 
                    rounded 
                    color="primary" 
                    class="full-width"
                    style="padding: 16px; font-weight: bold; border: 2px solid;"
                    :style="paymentMethod === 'card' ? 'border-color: #1976d2; background-color: #e3f2fd;' : 'border-color: #ccc; background-color: transparent;'"
                    label="💳 Pagar con Tarjeta" 
                    @click="paymentMethod = 'card'; model = null" 
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-btn 
                    :unelevated="!paymentMethod || paymentMethod !== 'cash'"
                    :flat="paymentMethod === 'cash'" 
                    rounded 
                    color="primary" 
                    class="full-width"
                    style="padding: 16px; font-weight: bold; border: 2px solid;"
                    :style="paymentMethod === 'cash' ? 'border-color: #1976d2; background-color: #e3f2fd;' : 'border-color: #ccc; background-color: transparent;'"
                    label="💰 Pagar en Efectivo" 
                    @click="paymentMethod = 'cash'; selectedCard = {id: '', name: '', number_card: '', expiration_date: ''}; cvv = ''" 
                  />
                </div>
              </div>
            </div>
            <q-separator></q-separator>
            <div class="q-gutter-md q-flex q-mt-lg" v-if="paymentMethod === 'card'">
            <q-btn unelevated rounded color="primary" class="select-card" :label="selectedCard.id ? 'Cambiar Tarjeta' : 'Seleccionar Tarjeta'" @click="basic = true" />
            <q-dialog v-model="basic" transition-show="rotate" transition-hide="rotate">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Tarjetas</div>
                </q-card-section>
                <q-card-section>
                  <div v-for="(cards, index) in stateUserCards" :key="index">
                    <q-radio v-model="selectedCardIndex" :val="index" color="primary"
                      @input="selectCard(cards)"></q-radio>
                    <div class="card-2 col-12 col-sm-3 col-md-4 q-ma-sm">
                      <div class="card__front card__part_modal">
                        <img class="card__square" src="https://conta.nubank.com.br/images/nu-white.png" />
                        <p class="card_numer">{{ castCard(cards).number_card }}</p>
                        <div class="card__space-75">
                          <span class="card__label">Nombre de la Tarjeta</span>
                          <p class="card__info">{{ castCard(cards).name }}</p>
                        </div>
                        <div class="card__space-25">
                          <span class="card__label">Expires</span>
                          <p class="card__info">{{ castCard(cards).expiration_date }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Aceptar" color="primary" @click="selectCard(stateUserCards[selectedCardIndex])"
                    v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <q-btn outline class="add-card" style="color: goldenrod" label="Agregar nueva tarjeta" icon-right="fas fa-plus"
              @click="formCreate = true" />

            <div v-if="paymentMethod === 'card'" class="q-pa-md q-gutter-sm">
              <q-dialog v-model="formCreate" persistent>
                <q-card style="min-width: 350px">
                  <q-card-section>
                    <div class="text-h6">
                      Registar Nueva tarjeta
                      <q-icon name="fas fa-solid fa-credit-card"></q-icon>
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-form @submit="createCardNew" class="q-gutter-md col-6" ref="formCreateCard">
                      <q-input dense v-model="form.name" autofocus label="Nombre completo del propietario"
                        :rules="[
                          (val) => !!val || 'El campo nombre es requerido',
                          (val) => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                          (val) => /^[a-zaeiounAZEIOUN\s]+$/.test(val) || 'El nombre solo puede contener letras y espacios'
                        ]" />

                      <q-input 
                        dense 
                        v-model="form.number_card" 
                        label="Número de tarjeta" 
                        fill-mask
                        mask="#### #### #### ####"
                        :rules="[
                          (val) => !!val || 'El campo número de tarjeta es requerido',
                          (val) => {
                            if (!val) return true;
                            const digits = (val.match(/\d/g) || []).length;
                            if (digits !== 16) return `Debe tener 16 dígitos. Actualmente tiene ${digits}`;
                            const clean = val.replace(/[\s-]/g, '');
                            if (!/^\d+$/.test(clean)) return false;
                            let sum = 0;
                            let shouldDouble = false;
                            for (let i = clean.length - 1; i >= 0; i--) {
                              let digit = parseInt(clean[i]);
                              if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
                              sum += digit;
                              shouldDouble = !shouldDouble;
                            }
                            return sum % 10 === 0 || 'Número de tarjeta inválido';
                          }
                        ]"
                      />
                      <div v-if="form.number_card" class="q-mt-xs text-caption text-grey-7">
                        Tipo: <strong>{{ detectCardType(form.number_card) }}</strong>
                      </div>

                      <q-input 
                        dense 
                        v-model="form.expiration_date" 
                        label="Fecha de expiración" 
                        mask="##/##" 
                        fill-mask 
                          :rules="[
                            (val) => !!val || 'La fecha de expiración es requerida',
                            (val) => {
                              if (!val || val.length !== 5) return 'Formato: mm/YY';
                              const [month, year] = val.split('/');
                              const monthNum = parseInt(month, 10);
                              const yearNum = parseInt(year, 10);
                              const currentYear = new Date().getFullYear() % 100;
                              const currentMonth = new Date().getMonth() + 1;
  
                              if (monthNum < 1 || monthNum > 12) return 'Mes debe ser 01-12';
                              if (yearNum < currentYear) return `El año debe ser mayor o igual a ${currentYear}`;
                              if (yearNum === currentYear && monthNum < currentMonth) return 'La tarjeta ya expiró';
                              
                              return true;
                            }
                          ]"
                      />
                      <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancelar" v-close-popup color="red" />
                        <q-btn flat label="Crear" type="submit" color="primary" />
                      </q-card-actions>
                    </q-form>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
          </div>
            <div class="row" v-if="paymentMethod === 'card'">

              <div class="card col-12 col-sm-3 col-md-4 q-ma-sm" @click="selectedCard.id ? basic = true : null" :style="selectedCard.id ? 'cursor: pointer;' : ''">
                <div class="card__front card__part">
                  <img class="card__square" src="https://conta.nubank.com.br/images/nu-white.png" />
                  <p class="card_numer">{{ selectedCard.number_card || 'Selecciona una tarjeta' }}</p>
                  <div class="card__space-75">
                    <span class="card__label">Nombre de la Tarjeta</span>
                    <p class="card__info">{{ selectedCard.name || '--' }}</p>
                  </div>
                  <div class="card__space-25">
                    <span class="card__label">Expires</span>
                    <p class="card__info">{{ selectedCard.expiration_date || '--' }}</p>
                  </div>
                </div>
              </div>

              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="selectedCard.name" label="Nombre de la Tarjeta*" 
                    :rules="[
                      (val) => !!val || 'El nombre es requerido'
                    ]" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" label="Número de la Tarjeta"
                    v-model="selectedCard.number_card" mask="#### #### #### ####" fill-mask :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) => {
                        if (!val) return true;
                        const digits = (val.match(/\d/g) || []).length;
                        return digits === 16 || 'Debe tener 16 digitos';
                      }
                    ]"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="selectedCard.expiration_date"
                    label="Fecha de Expiración" mask="##/##" fill-mask :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) => {
                        if (!val || val.length !== 5) return 'Formato: mm/YY';
                        const [month, year] = val.split('/');
                        const monthNum = parseInt(month, 10);
                        const yearNum = parseInt(year, 10);
                        const currentYear = new Date().getFullYear() % 100;
                        const currentMonth = new Date().getMonth() + 1;

                        if (monthNum < 1 || monthNum > 12) return 'Mes debe ser 01-12';
                        if (yearNum < currentYear) return `El año debe ser mayor o igual a ${currentYear}`;
                        if (yearNum === currentYear && monthNum < currentMonth) return 'La tarjeta ya expiró';

                        return true;
                      }
                    ]" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="cvv" type="text" maxlength="4"
                    label="CVV *" :rules="[
                      (val) => !!val || 'El CVV es requerido',
                      (val) => (val.toString().length >= 3 && val.toString().length <= 4) || 'El CVV debe tener 3 o 4 dígitos'
                    ]" />
                </q-item>
              </div>
            </div>
            <div class="row" v-if="paymentMethod === 'cash'">
              <div class="col-6 full-width">
                <q-item>
                  <q-select class="full-width" color="purple-12" v-model="model" :options="options"
                    label="Efectivo en puntos de pago" emit-value map-options>
                    <template v-slot:prepend>
                      <q-icon name="account_balance" />
                    </template>
                  </q-select>
                </q-item>
              </div>
            </div>
            <div class="row" v-if="paymentMethod === 'card'">
              <div class="col-6 full-width">
                <q-item>
                  <q-checkbox dense outlined class="full-width"
                    label="Desea recordar los datos de la tarjeta de crédito para la próxima Compra"
                    v-model="card_detail.checkbox" />
                </q-item>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn rounded @click="validateStep2" class="float-right q-mr-md q-mb-md" color="blue"
                label="Siguiente" />
              <q-btn flat @click="step = 1" color="primary" rounded label="Anterior" class="q-mr-sm float-right" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Revise su orden" icon="shopping_cart" :header-nav="step > 3">
            <div class="row">
              <div class="col-12">
                <q-item-label header class="text-h6">Detalles de la Orden</q-item-label>
                <q-item class="full-width" v-for="(product, index) in stateListShopingCard[0].shopping_card_detail"
                  :key="index">
                  <q-item-section class="r">
                    <q-item-label>{{ castProduct(product).artist.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section class="" middle>
                    <q-item-label>Total de {{ castProduct(product).hours }} hora(s)</q-item-label>
                  </q-item-section>
                  <q-item-section class="text-right" side>
                    {{ "$ " + castProduct(product).price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                  </q-item-section>
                </q-item>
                <q-separator></q-separator>

                <q-item class="full-width">
                  <q-item-section>
                    <q-item-label lines="1">Envio</q-item-label>
                  </q-item-section>
                  <q-item-section side> --Gratis-- </q-item-section>
                </q-item>
                <q-separator></q-separator>
                <q-item class="full-width" style="border-top: 3px dotted blue">
                  <q-item-section>
                    <q-item-label lines="1">
                      <h5>Total</h5>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    {{ "MXN " + stateListShopingCard[0].total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }}
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <q-card class="rounded-borders">
              <q-card-section horizontal>
                <q-card-section class="col-5 q-pt-xs">
                  <div class="text-h6 text-center">Datos del Envio</div>
                  <div class="text-subtitle1">{{ formClient.first_name }} {{ formClient.first_last }}</div>
                  <div class="text-subtitle2">{{ formClient.email }}</div>
                  <div class="text-subtitle3">{{ formClient.adress_line2 }}</div>
                  <div class="text-subtitle4">{{ formClient.city }}</div>
                  <div class="text-subtitle5">{{ formClient.state_city }}</div>
                  <div class="text-subtitle6">{{ formClient.zip_code }}</div>
                  <div class="text-subtitle7">{{ formClient.country }}</div>
                </q-card-section>
                <q-card-section class="col-7 q-pt-xs ">
                  <div class="text-h6 text-center">Detalles del Pago</div>
                  <div v-if="paymentMethod === 'card'">
                    <div class="text-subtitle1 q-mb-xs">Tipo de Tarjeta - {{ detectCardType(selectedCard.number_card) }}</div>
                    <div class="text-subtitle1 q-mb-xs">
                      Titular de la tarjeta - {{ selectedCard.name }}
                    </div>
                    <div class="text-subtitle1 q-mb-xs">
                      Número de la Tarjeta - {{ maskCardNumber(selectedCard.number_card) }}
                    </div>
                    <div class="text-subtitle1 q-mb-xs">
                      Fecha de Expiración - {{ selectedCard.expiration_date }}
                    </div>
                  </div>
                  <div v-if="paymentMethod === 'cash'">
                    <div class="text-subtitle1 q-mb-xs">Método de Pago - Efectivo</div>
                    <div class="text-subtitle1 q-mb-xs">
                      Punto de Pago - {{ model }}
                    </div>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>

            <q-stepper-navigation>
              <q-btn rounded @click="pay()" class="float-right q-mr-md q-mb-md" color="blue"
                label="Realizar Compra" />
              <q-btn flat @click="step = 2" color="primary" rounded label="Anterior" class="q-mr-sm float-right" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
      <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12">
        <q-card class=" no-shadow" bordered>
          <q-card-section class="text-center text-h6 text-white bg-primary">
            <q-icon name="shopping_cart" class="q-mr-sm" />
            Resumen del pedido
          </q-card-section>
          <q-card-section horizontal v-for="(product, index) in stateListShopingCard[0].shopping_card_detail"
            :key="index">
            <q-card-section class="col-6 flex flex-center">
              <q-img :src="castProduct(product).artist.image" loading="lazy" style="object-fit: cover" height="100px"
                class="rounded-circle q-responsive" width="110px" />
            </q-card-section>

            <q-card-section>
              <div class="text-subtitle2 q-mt-sm text-center">
                {{ castProduct(product).artist.name }}
              </div>
              <div class="text-subtitle2 q-mb-xs text-center">
                {{ "$ " + castProduct(product).price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </div>
              <div class="text-subtitle2 text-center">
                <q-rating v-model="starts" :max="5" size="32px" no-dimming readonly />
              </div>
            </q-card-section>
            <q-separator></q-separator>
          </q-card-section>

          <q-separator></q-separator>
          <q-card-section class="col-3 q-pt-xs  text-white bg-primary">
            <div class=" full-width ">
              <div class="col-12 col-sm-3 col-md-4 text-center text-h6">
                TOTAL:
                <span class="text-right">{{ "$ " +
                  stateListShopingCard[0].total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { mapActions, mapState, mapGetters } from "vuex";
import { ref } from "vue";

let $q;

export default defineComponent({
  setup() {
    const formClient = ref({
      first_name: "",
      first_last: "",
      email: "",
      adress_line2: "",
      city: "",
      state_city: "",
      zip_code: "",
      country: "",
    });

    const form = ref({
      id: "",
      name: "",
      number_card: "",
      expiration_date: "",
    });

    const step = ref(1);
    const formCreate = ref(false);
    const starts = ref(3);
    const selectedCardIndex = ref(null);
    const address_detail = ref({ checkbox: false });
    const card_detail = ref({ checkbox: false });
    const selectedCard = ref({
      id: "",
      name: "",
      number_card: "",
      expiration_date: ""
    });

    return {
      formCreate,
      selectedCard,
      paymentMethod: ref(null),
      basic: ref(false),
      model: ref(null),
      options: [
        { label: 'BBVA', value: 'BBVA' },
        { label: 'Santander', value: 'Santander' },
        { label: 'Hsbc', value: 'Hsbc' },
        { label: 'CityBanamex', value: 'CityBanamex' },
        { label: 'Oxxo', value: 'Oxxo' },
      ],
      address_detail,
      card_detail,
      listShopingCard: {},
      cards: {},
      formClient,
      form,
      step,
      cvv: ref(''),
      selectedCardIndex,
      starts
    };
  },
  methods: {
    castCard(card) {
      return card;
    },

    detectCardType(number) {
      const clean = number.replace(/[\s-]/g, '');
      if (/^4/.test(clean)) return 'Visa';
      if (/^5[1-5]/.test(clean) || /^2(2[2-9]|[3-6]\d|7[01])/.test(clean)) return 'Mastercard';
      if (/^3[47]/.test(clean)) return 'American Express';
      if (/^6(011|5)/.test(clean)) return 'Discover';
      if (/^3(0[0-5]|[68])/.test(clean)) return 'Diners Club';
      if (/^35(2[89]|[3-8])/.test(clean)) return 'JCB';
      if (/^(5018|5020|5038|6304|6759|676[1-3])/.test(clean)) return 'Maestro';
      if (/^62/.test(clean)) return 'UnionPay';
      return 'Desconocida';
    },

    luhnCheck(number) {
      const clean = number.replace(/[\s-]/g, '');
      if (!/^\d+$/.test(clean)) return false;
      let sum = 0;
      let shouldDouble = false;
      for (let i = clean.length - 1; i >= 0; i--) {
        let digit = parseInt(clean[i]);
        if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    },
    
    castProduct(product) {
      return product;
    },
    validateStep2() {
      if (!this.paymentMethod) {
        this.$q.notify({
          type: "negative",
          message: "Debes seleccionar un método de pago",
        });
        return;
      }

      if (this.paymentMethod === 'card') {
        if (!this.selectedCard || !this.selectedCard.number_card) {
          this.$q.notify({
            type: "negative",
            message: "Debes seleccionar una tarjeta",
          });
          return;
        }

        if (!this.cvv || this.cvv.toString().length < 3 || this.cvv.toString().length > 4) {
          this.$q.notify({
            type: "negative",
            message: "El CVV debe tener 3 o 4 dígitos",
          });
          return;
        }
      } else if (this.paymentMethod === 'cash') {
        if (!this.model) {
          this.$q.notify({
            type: "negative",
            message: "Debes seleccionar un punto de pago en efectivo",
          });
          return;
        }
      }

      this.step = 3;
    },
    validateCardNumber() {
      const val = this.form.number_card;
      if (!val) {
        this.$q.notify({ type: 'negative', message: 'Campo requerido' });
        return false;
      }
      const digits = (val.match(/\d/g) || []).length;
      if (digits !== 16) {
        this.$q.notify({ type: 'negative', message: `Debe tener 16 digitos, tiene ${digits}` });
        return false;
      }
      return true;
    },
    nextStep() {
      this.step = 2;
    },
    ...mapActions("card", ["showCards"]),
    ...mapActions("card", ["createCard"]),
    ...mapActions("shoppingCard", ["getListShoppingCard"]),
    ...mapActions("shoppingCard", ["deleteItembyId"]),
    ...mapActions("shoppingCard", ["updateItemShoppingCart"]),
    ...mapActions("card", ["getCards"]),
    ...mapActions("shoppingCard", ["createPayment"]),
    async gettCards() {
      try {
        await this.getCards();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async createNewOrders() {
      try {
        await this.createNewOrder(this.formClient.value);
        this.onReset();
        this.$q.notify({
          type: "positive",
          message: "Orden creada exitosamente",
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
    async createCardNew() {
      let cardData = this.form;
      if (this.form && this.form.value) {
        cardData = this.form.value;
      }

      if (!cardData.name || cardData.name.trim().length < 3) {
        this.$q.notify({
          type: "negative",
          message: "El nombre debe tener al menos 3 caracteres",
        });
        return;
      }

      if (!cardData.number_card) {
        this.$q.notify({
          type: "negative",
          message: "El número de tarjeta es requerido",
        });
        return;
      }

      const digits = (cardData.number_card.match(/\d/g) || []).length;
      if (digits !== 16) {
        this.$q.notify({
          type: "negative",
          message: `El número de tarjeta debe tener 16 dígitos. Actualmente tiene ${digits}`,
        });
        return;
      }

      const cardClean = cardData.number_card.replace(/[\s-]/g, '');
      if (!this.luhnCheck(cardClean)) {
        this.$q.notify({
          type: "negative",
          message: "El número de tarjeta no es válido (validación Luhn)",
        });
        return;
      }

      if (!cardData.expiration_date) {
        this.$q.notify({
          type: "negative",
          message: "La fecha de expiración es requerida",
        });
        return;
      }

      try {
        await this.createCard(cardData);
        this.formCreate = false;
        this.onReset();
        this.$q.notify({
          type: "positive",
          message: `Tarjeta creada correctamente`,
        });
        await this.gettCards();
      } catch (err) {
        if (err.response?.data?.message) {
          this.$q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        } else {
          this.$q.notify({
            type: "negative",
            message: "Error al crear la tarjeta",
          });
        }
      }
    },
    maskCardNumber(cardNumber) {
      let maskedNumber = cardNumber.slice(-4);
      let hiddenNumber = cardNumber.slice(0, -4).replace(/\d/g, 'x');
      return hiddenNumber + maskedNumber;
    },
    selectCard(cards) {
      this.selectedCardIndex = this.stateUserCards.indexOf(cards);
      console.log("Selected Card Index:", this.selectedCardIndex);
      this.selectedCard = { ...this.stateUserCards[this.selectedCardIndex] };
      console.log("Selected Card:", this.selectedCard);
      this.basic = false;
    },
    async pay () {
      if (!this.selectedCard || !this.selectedCard.number_card) {
        this.$q.notify({
          type: "negative",
          message: "Debes seleccionar una tarjeta",
        });
        return;
      }

      const digits = (this.selectedCard.number_card.match(/\d/g) || []).length;
      if (digits !== 16) {
        this.$q.notify({
          type: "negative",
          message: `El número de tarjeta debe tener 16 dígitos. Actualmente tiene ${digits}`,
        });
        return;
      }

      if (!this.selectedCard.expiration_date || this.selectedCard.expiration_date.length !== 5) {
        this.$q.notify({
          type: "negative",
          message: "La fecha de expiración debe estar en formato mm/YY",
        });
        return;
      }

      const [month, year] = this.selectedCard.expiration_date.split("/");
      const monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) {
        this.$q.notify({
          type: "negative",
          message: "El mes debe estar entre 01 y 12",
        });
        return;
      }

      if (!this.cvv || this.cvv.toString().length < 3 || this.cvv.toString().length > 4) {
        this.$q.notify({
          type: "negative",
          message: "El CVV debe tener 3 o 4 dígitos",
        });
        return;
      }

      OpenPay.setId(this.$q.config.OpenPayID);
      OpenPay.setApiKey(this.$q.config.OpenPayKey);
      OpenPay.setSandboxMode(this.$q.config.OpenPaySanboxMode);

      var deviceDataId = OpenPay.deviceData.setup("formId");
      const cardData = this.stateCards.find(item => item.id === this.selectedCard);
      const dateCard = this.selectedCard.expiration_date.split("/");
      const card_numberArr = this.selectedCard.number_card.split(" ");
      const card_number = card_numberArr.join("");

      OpenPay.token.create({
        "card_number": card_number,
        "holder_name": this.formClient.first_name + " " + this.formClient.first_last,
        "expiration_year": dateCard[1],
        "expiration_month": dateCard[0],
        "cvv2": this.cvv,
        "address":{
          "city": this.formClient.city,
          "postal_code": this.formClient.zip_code,
          "line1": this.formClient.adress_line2,
          "state": this.formClient.state_city,
          "country_code": "MX"
        }
      }, async (response) => {
        let artistList = []
        this.stateListShopingCard[0].shopping_card_detail.map((element) => {
          let obj = [element.artist_id, element.price]
          artistList.push(obj)
        });
        const data = {
          card_holder_name: this.formClient.first_name + " " + this.formClient.first_last,
          card_number: card_number,
          expiration_month: dateCard[0],
          expiration_year: dateCard[1],
          cvv2: this.cvv,
          amount: this.stateListShopingCard[0].total,
          name: this.formClient.first_name,
          last_name: this.formClient.first_last,
          email: this.formClient.email,
          address: this.formClient.adress_line2,
          city: this.formClient.state_city,
          state: this.formClient.city,
          zip_code: this.formClient.zip_code,
          deviceSessionId: deviceDataId,
          token : response.data.id,
          artistList: artistList
        }

        try {
          const response = await this.createPayment(data);
          console.log(response.data)
          $q.notify({
            type: "positive",
            message: "Tu transacción se realizó con exito",
          });
        } catch (err) {
          $q.notify({
            type: "negative",
            message: err,
          });
        }

      });
      
    },
    onReset() {
      if (this.form && this.form.value) {
        this.form.value.id = "";
        this.form.value.name = "";
        this.form.value.number_card = "";
        this.form.value.expiration_date = "";
      } else {
        this.form = {
          id: "",
          name: "",
          number_card: "",
          expiration_date: "",
        };
      }
    }
  },
  computed: {
    ...mapGetters("card", ["stateUserCards"]),
    ...mapGetters("shoppingCard", ["stateListShopingCard"]),
    ...mapGetters("card", ["stateCards"]),
    ...mapState({
      cards: (state) => state.card.cards,
    }),
  },
  created() {
    this.gettCards();
    this.showCards();
    this.getListShoppingCard();
  },
  mounted() {
    $q = useQuasar();

  },
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
<style scoped>
.title {
  margin-bottom: 30px;
  color: #162969;
}
.card {
  width: 320px;
  height: 190px;
  -webkit-perspective: 800px;
  -moz-perspective: 600px;
  perspective: 600px;
}
.card-2 {
  width: 320px;
  height: 190px;
  -webkit-perspective: 800px;
  -moz-perspective: 600px;
  perspective: 600px;
}
.card__part {
  box-shadow: 1px 1px #aaa3a3;
  top: 0;
  position: absolute;
  z-index: 1000;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  width: 320px;
  height: 190px;
  background-image: url("https://cdn.pixabay.com/photo/2017/11/15/09/28/music-player-2951399_960_720.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 8px;
  -webkit-transition: all 0.5s cubic-bezier(0.2, 0.885, 0.32, 1.275);
  -moz-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -ms-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -o-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
}
.card__part_modal {
  box-shadow: 1px 1px #aaa3a3;
  top: 0;
  position: absolute;
  z-index: 1000;
  display: inline-block;
  width: 320px;
  height: 190px;
  background-image: url("https://cdn.pixabay.com/photo/2017/11/15/09/28/music-player-2951399_960_720.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 8px;
  -webkit-transition: all 0.5s cubic-bezier(0.2, 0.885, 0.32, 1.275);
  -moz-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -ms-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -o-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
}
.openpay {
  top: 0;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 190px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 1px;
}
.card__front {
  padding: 18px;
  -webkit-transform: rotateY(0);
  -moz-transform: rotateY(0);
}
.card__back {
  padding: 18px 0;
  -webkit-transform: rotateY(-180deg);
  -moz-transform: rotateY(-180deg);
}
.card__logo {
  height: 16px;
}
.card__front-logo {
  position: absolute;
  top: 18px;
  font-size: 20px;
  right: 50px;
}
.card__front-logo2 {
  position: absolute;
  top: 18px;
  font-size: 20px;
  right: 18px;
  justify-content: center;
}
.card__square {
  image-rendering: crisp-edges;
  height: 30px;
}
.card_numer {
  display: block;
  width: 100%;
  word-spacing: 0px;
  font-size: 20px;
  letter-spacing: 2px;
  color: #fff;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 25px;
}
.card__space-75 {
  width: 85%;
  float: left;
}
.card__space-25 {
  width: 15%;
  float: left;
}
.card__label {
  font-size: 10px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
}
.card__info {
  margin-bottom: 0;
  margin-top: 5px;
  font-size: 16px;
  line-height: 18px;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.card__back-content {
  padding: 15px 15px 0;
}
.card__secret--last {
  color: #303030;
  text-align: right;
  margin: 0;
  font-size: 14px;
}
.card__secret {
  padding: 5px 12px;
  background-color: #fff;
  position: relative;
}
.icon-size {
  width: 30px;
  height: 30px;
}
.q-btn.select-card {
  display: inline-block;
}
.q-btn.add-card {
  float: right;
}
</style>
