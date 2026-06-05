<template>
  <q-page class="q-pa-sm">
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
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="email" v-model="formClient.email" class="full-width" label="Email*"
                      :rules="[
                        (val) => !!val || 'El email es requerido',
                        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="tel" v-model="formClient.phone" class="full-width"
                      label="Teléfono *" maxlength="10"
                      @keypress="(e) => !/[0-9]/.test(e.key) && e.preventDefault()"
                      :rules="[
                        (val) => !!val || 'El teléfono es requerido',
                        (val) => val.toString().length === 10 || 'El teléfono debe tener exactamente 10 dígitos',
                        (val) => /^[0-9]+$/.test(val) || 'Solo se permiten números'
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
                      label="Codigo Postal" maxlength="5" @keypress="(e) => !/[0-9]/.test(e.key) && e.preventDefault()"
                      :rules="[
                        (val) => /^[0-9]+$/.test(val) || 'Solo se permiten números',
                        (val) => val.toString().length === 5 || 'El código postal debe tener exactamente 5 dígitos'
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
                    <q-input
                      dense
                      filled
                      v-model="formClient.event_date"
                      class="full-width"
                      label="Fecha del evento *"
                      :rules="[
                        (val) => !!val || 'La fecha del evento es requerida'
                      ]"
                      required
                    >
                      <template v-slot:append>
                        <q-icon
                          name="event"
                          class="cursor-pointer"
                        >
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date
                              v-model="formClient.event_date"
                              :options="dateOption"
                              :locale="spanishLocale()"
                            >
                              <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input
                      dense
                      outlined
                      v-model="formClient.event_hour"
                      class="full-width"
                      label="Hora del evento *"
                      :rules="[
                        (val) => !!val || 'La hora del evento es requerida'
                      ]"
                      readonly
                      required
                    >
                      <template v-slot:append>
                        <q-icon name="schedule" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="formClient.event_hour" mask="HH:mm" format24h>
                              <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-checkbox dense outlined class="full-width"
                      label="Deseas guardar los datos para la siguiente compra"
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
                          (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'El nombre solo puede contener letras y espacios'
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
                <q-item class="full-width" v-for="(product, index) in shoppingCardDetail"
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
                    {{ "MXN " + shoppingCartTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }}
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
                    <div class="text-subtitle2">{{ formClient.phone }}</div>
                  <div class="text-subtitle3">{{ formClient.adress_line2 }}</div>
                  <div class="text-subtitle4">{{ formClient.city }}</div>
                  <div class="text-subtitle5">{{ formClient.state_city }}</div>
                  <div class="text-subtitle6">{{ formClient.zip_code }}</div>
                  <div class="text-subtitle7">{{ formClient.country }}</div>
                    <div class="text-subtitle8">{{ formClient.event_date }}</div>
                    <div class="text-subtitle9">{{ formClient.event_hour }}</div>
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
          <q-card-section horizontal v-for="(product, index) in shoppingCardDetail"
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
                <q-rating 
                  :model-value="parseFloat(castProduct(product).artist?.rating || castProduct(product).artist?.ratings_avg_rating || 0)"
                  :max="5" 
                  size="32px" 
                  color="yellow"
                  icon="star_border"
                  icon-selected="star"
                  icon-half="star_half"
                  no-dimming 
                  readonly 
                />
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
                  shoppingCartTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }}</span>
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
import { api } from "boot/axios";

let $q;

export default defineComponent({
  setup() {
    const formClient = ref({
      first_name: "",
      first_last: "",
      email: "",
      phone: "",
      adress_line2: "",
      city: "",
      state_city: "",
      zip_code: "",
      country: "",
      event_date: "",
      event_hour: "",
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
      starts,
      isQuickBuy: ref(false),
      quickBuyData: ref(null),
    };
  },
  methods: {
    castCard(card) {
      return card;
    },

    dateOption(date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = today.getMonth() + 1;
      const dd = today.getDate();

      const [year, month, day] = date.split("/");
      return new Date(year, month - 1, day) >= new Date(yyyy, mm - 1, dd);
    },

    spanishLocale() {
      return {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        firstDayOfWeek: 1
      };
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

    getExpectedCvvLength(number) {
      const cardType = this.detectCardType(number);
      if (cardType === 'American Express') return 4;
      return 3;
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
    ...mapActions("shoppingCard", ["clearCart"]),
    ...mapActions("card", ["getCards"]),
    ...mapActions("shoppingCard", ["createPayment"]),
    async gettCards() {
      try {
        await this.showCards();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    async loadQuickBuyArtist(artistDataEncoded, hours) {
      try {
        let decodedArtistJson = '';
        try {
          decodedArtistJson = decodeURIComponent(escape(atob(artistDataEncoded)));
        } catch (e) {
          try {
            decodedArtistJson = atob(artistDataEncoded);
          } catch (e2) {
            throw new Error('Error decoding artist data');
          }
        }

        const artistData = JSON.parse(decodedArtistJson);
        const artistId = artistData.id;
        const hoursCount = parseInt(hours || 1);
        const clientPrice = parseFloat(artistData.price_hour || 0) * hoursCount;

        this.quickBuyData = {
          artist_id: artistId,
          artist: artistData,
          hours: hoursCount,
          price: clientPrice
        };
        
        this.isQuickBuy = true;
      } catch (err) {
        this.$q.notify({
          type: "negative",
          message: "Error al cargar el artista. Por favor, intenta de nuevo.",
        });
        this.$router.push("/client/musical-genders");
      }
    },
    async initializeCheckout() {
      const isQuickBuy = this.$route.query.quickBuy === 'true';
      const artistDataEncoded = this.$route.query.artistData;
      const hoursParam = this.$route.query.hours;
      
      await this.gettCards();
      
      (isQuickBuy && artistDataEncoded) 
        ? await 
        this.loadQuickBuyArtist(artistDataEncoded, hoursParam)
        : await this.getListShoppingCard().then(() => {
            if (!this.shoppingCardDetail.length) {
              this.$q.notify({
                type: "warning",
                message: "Tu carrito está vacío. Agrega artistas antes de continuar.",
              });
              this.$router.push("/client/shopping-cart");
            }
          });

      try {
        await this.fetchProfile();
      } catch (err) {

      }

      if ((!this.selectedCard || !this.selectedCard.id) && this.stateUserCards?.length) {
        this.selectedCardIndex = 0;
        this.selectedCard = { ...this.stateUserCards[0] };
      }
    },
    async fetchProfile() {
      try {
        const resp = await api.get('/api/client/profile');
        if (resp.data && resp.data.success && resp.data.user) {
          const u = resp.data.user;
          const fullName = (u.name || '').trim().replace(/\s+/g, ' ');
          const nameParts = fullName ? fullName.split(' ') : [];
          this.formClient.first_name = nameParts.length ? nameParts.shift() : '';
          this.formClient.first_last = nameParts.join(' ');
          this.formClient.email = u.email || '';
          this.formClient.phone = u.phone || '';
          this.formClient.adress_line2 = u.address || '';
          this.formClient.city = u.city || '';
          this.formClient.state_city = u.state || '';
          this.formClient.zip_code = u.zip_code || '';
          this.formClient.country = u.country || '';
        }
      } catch (err) {

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
        await this.showCards();

        if (this.stateUserCards?.length) {
          const lastIndex = this.stateUserCards.length - 1;
          this.selectedCardIndex = lastIndex;
          this.selectedCard = { ...this.stateUserCards[lastIndex] };
        }
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
      this.selectedCard = { ...this.stateUserCards[this.selectedCardIndex] };
    },
    async saveAddress() {
      try {
        const addressData = {
          first_name: this.formClient.first_name,
          last_name: this.formClient.first_last,
          email: this.formClient.email,
          phone: this.formClient.phone,
          address: this.formClient.adress_line2,
          city: this.formClient.city,
          state: this.formClient.state_city,
          zip_code: this.formClient.zip_code,
          country: this.formClient.country,
        };

        const response = await api.post("/api/client/save-address", addressData);
        
        if (response.data.success) {
          console.log("Dirección guardada correctamente");
        }
      } catch (error) {
        console.error("Error guardando dirección:", error);
        throw error;
      }
    },
    async pay() {
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

      const expectedCvvLength = this.getExpectedCvvLength(this.selectedCard.number_card);
      if (this.cvv.toString().length !== expectedCvvLength) {
        this.$q.notify({
          type: "negative",
          message: expectedCvvLength === 4
            ? "Esta tarjeta requiere un CVV de 4 dígitos"
            : "Esta tarjeta requiere un CVV de 3 dígitos",
          position: "top",
        });
        return;
      }

      if (typeof OpenPay === "undefined") {
        this.$q.notify({
          type: "negative",
          message: "Error: OpenPay no está cargado. Recarga la página.",
        });
        return;
      }

      this.$q.loading.show({
        message: "Procesando tu pago...",
        spinnerColor: "primary",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        messageColor: "white",
      });

      try {
        const keysRes = await this.$api.get('/api/openpay-keys/public');
        const openpayKeys = keysRes.data.data;
        OpenPay.setId(openpayKeys.openpay_id);
        OpenPay.setApiKey(openpayKeys.openpay_public_key);
        OpenPay.setSandboxMode(true);

        let deviceDataId = null;
        try {
          deviceDataId = OpenPay.deviceData?.generateSessionId?.() ?? OpenPay.deviceData?.setup?.("formId") ?? null;
        } catch (e) {
          console.warn('Device data setup fallido, continuando sin él:', e);
        }

        const card_number = this.selectedCard.number_card.replace(/\s/g, "");

        OpenPay.token.create(
          {
            "card_number": card_number,
            "holder_name": this.formClient.first_name + " " + this.formClient.first_last,
            "expiration_year": parseInt(year),
            "expiration_month": parseInt(month),
            "cvv2": this.cvv.toString(),
            "address": {
              "city": this.formClient.city,
              "postal_code": this.formClient.zip_code.toString(),
              "line1": this.formClient.adress_line2,
              "state": this.formClient.state_city,
              "country_code": "MX"
            }
          },
          async (response) => {
            try {
              if (!response || !response.data || !response.data.id) {
                throw new Error("No se recibió token válido de OpenPay");
              }

              const token = response.data.id;
              const artistList = this.isQuickBuy 
                ? [{ artist_id: this.quickBuyData.artist_id, hours: this.quickBuyData.hours }]
                : this.shoppingCardDetail.map((element) => ({ 
                    artist_id: element.artist_id, 
                    hours: element.hours 
                  }));

              const paymentData = {
                token: token,
                amount: this.shoppingCartTotal * 100,
                customer_name: this.formClient.first_name + " " + this.formClient.first_last,
                customer_email: this.formClient.email,
                customer_phone: this.formClient.phone,
                phone: this.formClient.phone,
                order_details: {
                  first_name: this.formClient.first_name,
                  last_name: this.formClient.first_last,
                  email: this.formClient.email,
                  phone: this.formClient.phone,
                  address: this.formClient.adress_line2,
                  city: this.formClient.city,
                  state: this.formClient.state_city,
                  zip_code: this.formClient.zip_code,
                  country: "MX",
                  event_date: this.formClient.event_date,
                  event_hour: this.formClient.event_hour,
                },
                event_date: this.formClient.event_date,
                event_hour: this.formClient.event_hour,
                artistList: artistList,
                description: `Compra de servicios musicales - Total: ${this.shoppingCartTotal} MXN`,
                deviceSessionId: deviceDataId
              };

              const paymentResponse = await this.createPayment(paymentData);

              if (this.address_detail.checkbox) {
                try {
                  await this.saveAddress();
                } catch (err) {
                  console.error("Error saving address:", err);
                }
              }

              if (this.card_detail.checkbox && this.selectedCard && !this.selectedCard.id) {
                try {
                  const cardToSave = {
                    name: this.selectedCard.name,
                    number_card: (this.selectedCard.number_card || '').replace(/\s/g, ''),
                    expiration_date: this.selectedCard.expiration_date,
                  };
                  await this.createCard(cardToSave);
                } catch (err) {
                  console.error("Error saving card:", err);
                }
              }

              this.$q.loading.hide();
              this.$q.notify({
                type: "positive",
                message: "¡Tu transacción se realizó con éxito!",
                position: "top",
              });

              this.onReset();
              setTimeout(() => {
                this.$router.push("/client/shopping-cart/view-my-order-details");
              }, 1500);
            } catch (err) {
              this.$q.loading.hide();
              
              let errorMessage =
                err.response?.data?.error?.description ??
                err.response?.data?.message ??
                err.message ??
                "Error al procesar el pago";
              
              this.$q.notify({
                type: "negative",
                message: errorMessage,
                position: "top",
                timeout: 5000
              });
            }
          },
          (error) => {
            this.$q.loading.hide();
            
            let errorMessage = error?.description || error?.message || "Error desconocido en OpenPay";
            errorMessage = errorMessage
              .replace(/cvv2/gi, "CVV")
              .replace(/card number/gi, "número de tarjeta")
              .replace(/verification digit/gi, "dígito de verificación")
              .replace(/expiration year/gi, "año de expiración")
              .replace(/expiration month/gi, "mes de expiración")
              .replace(/holder name/gi, "nombre del titular")
              .replace(/invalid/gi, "inválido")
              .replace(/must be/gi, "debe ser")
              .replace(/length/gi, "longitud")
              .replace(/wrong/gi, "incorrecto")
              .replace(/\bthe\b/gi, "el");
            if (error?.data?.description) {
              errorMessage = error.data.description
                .replace(/cvv2/gi, "CVV")
                .replace(/card number/gi, "número de tarjeta")
                .replace(/verification digit/gi, "dígito de verificación")
                .replace(/expiration year/gi, "año de expiración")
                .replace(/expiration month/gi, "mes de expiración")
                .replace(/holder name/gi, "nombre del titular")
                .replace(/invalid/gi, "inválido")
                .replace(/must be/gi, "debe ser")
                .replace(/length/gi, "longitud")
                .replace(/wrong/gi, "incorrecto")
                .replace(/\bthe\b/gi, "el");
            }
            
            this.$q.notify({
              type: "negative",
              message: "Error al crear el token: " + errorMessage,
              position: "top",
              timeout: 5000
            });
          }
        );
      } catch (err) {
        this.$q.loading.hide();
        this.$q.notify({
          type: "negative",
          message: err.message || "Error inesperado en el pago",
          position: "top",
        });
      }
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
    shoppingCardDetail() {
      if (this.isQuickBuy && this.quickBuyData) {
        return [{
          artist_id: this.quickBuyData.artist_id,
          artist: this.quickBuyData.artist,
          hours: this.quickBuyData.hours,
          price: this.quickBuyData.price
        }];
      }
      return this.stateListShopingCard?.[0]?.shopping_card_detail || [];
    },
    shoppingCartTotal() {
      if (this.isQuickBuy && this.quickBuyData) {
        return this.quickBuyData.price;
      }
      return this.stateListShopingCard?.[0]?.total || 0;
    },
  },
  async created() {
    await this.initializeCheckout();
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
