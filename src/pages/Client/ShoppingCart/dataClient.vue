<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
        <q-stepper v-model="step" header-nav ref="stepper" class="no-shadow" bordered animated>
          <q-step :name="1" title="Informacion del Pedido" icon="shopping_cart" :done="step > 1" :header-nav="step > 1">
            <img class="openpay" src="https://assets.stickpng.com/images/62e3c66bd889babae63d750e.png" />
            <q-form @submit="nextStep" ref="formClient1">
              <div class="row">
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input dense outlined class="full-width" type="text" v-model="formClient.first_name"
                      label="Nombre *" :rules="[
                        (val) => !!val || 'El nombre es requerido',
                        (val) => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'El nombre solo puede contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input dense outlined class="full-width" type="text" v-model="formClient.first_last"
                      label="Apellidos *" :rules="[
                        (val) => !!val || 'Los apellidos son requeridos',
                        (val) => val.trim().length >= 3 || 'Los apellidos deben tener al menos 3 caracteres',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'Los apellidos solo pueden contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input dense outlined type="email" v-model="formClient.email" class="full-width" label="Email*"
                      :rules="[
                        (val) => !!val || 'El email es requerido',
                        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12 col-sm-6">
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
                    <q-toggle
                      v-model="googleMapsEnabled"
                      label="¿Deseas ubicar tu evento en el mapa?"
                      color="primary"
                      @update:model-value="onToggleMap"
                    />
                  </q-item>
                </div>
                <div class="col-12">
                  <q-item>
                    <q-input dense outlined type="text" v-model="formClient.adress_line2" class="full-width"
                      label="Domicilio *"
                      :disable="googleMapsEnabled && formClient.adress_line2"
                      :rules="googleMapsEnabled && formClient.adress_line2 ? [] : [
                        (val) => !!val || 'El domicilio es requerido',
                        (val) => val.trim().length >= 5 || 'El domicilio debe tener al menos 5 caracteres'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input dense outlined type="text" class="full-width" v-model="formClient.city" label="Cuidad *"
                      :disable="googleMapsEnabled && formClient.city"
                      :rules="googleMapsEnabled && formClient.city ? [] : [
                        (val) => !!val || 'La ciudad es requerida',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'La ciudad solo puede contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input dense outlined type="text" class="full-width" v-model="formClient.state_city"
                      label="Municipio"
                      :disable="googleMapsEnabled && formClient.state_city"
                      :rules="googleMapsEnabled && formClient.state_city ? [] : [
                        (val) => !!val || 'El estado es requerido',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'El estado solo puede contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input dense outlined type="text" class="full-width" v-model="formClient.zip_code"
                      label="Codigo Postal" maxlength="5" @keypress="(e) => !/[0-9]/.test(e.key) && e.preventDefault()"
                      :disable="false"
                      :rules="[
                        (val) => /^[0-9]+$/.test(val) || 'Solo se permiten números',
                        (val) => val.toString().length === 5 || 'El código postal debe tener exactamente 5 dígitos'
                      ]" required />
                  </q-item>
                </div>
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input dense outlined type="text" v-model="formClient.country" label="Pais *" class="full-width"
                      :disable="googleMapsEnabled && formClient.country"
                      :rules="googleMapsEnabled && formClient.country ? [] : [
                        (val) => !!val || 'El país es requerido',
                        (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'El país solo puede contener letras'
                      ]" required />
                  </q-item>
                </div>
                <div v-if="googleMapsEnabled" class="col-12">
                  <q-item>
                    <q-card flat bordered class="full-width">
                      <q-card-section class="q-pa-sm text-center text-grey-7">
                        <small>Arrastra el marcador para ajustar la ubicación</small>
                      </q-card-section>
                      <q-card-section class="q-pa-sm">
                        <div ref="mapContainer" style="width: 100%; height: 320px; border-radius: 4px;"></div>
                      </q-card-section>
                    </q-card>
                  </q-item>
                </div>
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input
                      dense
                      filled
                      v-model="formClient.event_date"
                      class="full-width"
                      label="Fecha del evento *"
                      readonly
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
                <div class="col-12 col-sm-6">
                  <q-item>
                    <q-input
                      dense
                      outlined
                      v-model="formClient.event_hour"
                      class="full-width"
                      label="Hora del evento *"
                      readonly
                      :rules="[
                        (val) => !!val || 'La hora del evento es requerida'
                      ]"
                      required
                    >
                      <template v-slot:append>
                        <q-icon name="schedule" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="formClient.event_hour" mask="HH:mm" format24h :options="timeOption">
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
                <div class="col-12 col-sm-6">
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
                    :disable="shoppingCartTotal + totalExtraKmCost > 29999"
                    :unelevated="!paymentMethod || paymentMethod !== 'cash'"
                    :flat="paymentMethod === 'cash'" 
                    rounded 
                    color="primary" 
                    class="full-width"
                    style="padding: 16px; font-weight: bold; border: 2px solid;"
                    :style="paymentMethod === 'cash' ? 'border-color: #1976d2; background-color: #e3f2fd;' : 'border-color: #ccc; background-color: transparent;'"
                    :label="shoppingCartTotal + totalExtraKmCost > 29999 ? '💰 Excede límite de efectivo ($29,999)' : '💰 Pagar en Efectivo'" 
                    @click="paymentMethod = 'cash'; selectedCard = {id: '', name: '', number_card: '', expiration_date: ''}; cvv = ''" 
                  />
                </div>
              </div>
            </div>
            <q-separator></q-separator>
            <div class="q-mt-lg" v-if="paymentMethod === 'card'">
              <div class="row justify-center q-gutter-lg q-mb-md">
                <q-btn unelevated rounded color="primary" :label="selectedCard.id ? 'Cambiar Tarjeta' : 'Seleccionar Tarjeta'" @click="basic = true" />
                <q-btn outline rounded style="color: goldenrod;" label="Agregar nueva tarjeta" icon-right="fas fa-plus" @click="formCreate = true" />
              </div>
            <q-dialog v-model="basic" transition-show="rotate" transition-hide="rotate">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Tarjetas</div>
                </q-card-section>
                <q-card-section>
                  <div v-for="(cards, index) in stateUserCards" :key="index">
                    <q-radio v-model="selectedCardIndex" :val="index" color="primary"
                      @input="selectCard(cards)"></q-radio>
                    <div class="row flex-center q-mb-md full-width">
                      <div class="card-2" style="position: relative; max-width: 100%;">
                        <div class="card__front card__part_modal" style="position: relative; left: auto; transform: none; width: 100%; max-width: 320px;">
                        <img class="card__square" src="https://raw.githubusercontent.com/muhammed/interactive-card/refs/heads/main/src/assets/images/chip.png" />
                        <div style="position: absolute; top: 12px; right: 12px;">
                          <i :class="cardBrandInfo(castCard(cards)).icon" style="font-size: 32px; color: #ffffff;"></i>
                        </div>
                        <p class="card_numer">{{ maskCardNumber(castCard(cards).number_card) }}</p>
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
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Aceptar" color="primary" @click="selectCard(stateUserCards[selectedCardIndex])"
                    v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <div class="q-pa-md q-gutter-sm">
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
                        :rules="[
                          (val) => !!val || 'El campo número de tarjeta es requerido',
                          (val) => {
                            if (!val) return true;
                            const digits = (val.match(/\d/g) || []).length;
                            const expLen = this.expectedCardLength(val); if (digits !== expLen) return `Debe tener ${expLen} dígitos. Actualmente tiene ${digits}`;
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
            <div class="row full-width justify-center q-mb-md" v-if="paymentMethod === 'card'">
              <div class="card" @click="selectedCard.id ? basic = true : null" :style="selectedCard.id ? 'cursor: pointer; position: relative; max-width: 100%; width: 320px; margin: 0 auto;' : 'position: relative; max-width: 100%; width: 320px; margin: 0 auto;'">
                <div class="card__front card__part" style="position: relative; left: auto; transform: none; width: 100%; max-width: 320px;">
                  <img class="card__square" src="https://raw.githubusercontent.com/muhammed/interactive-card/refs/heads/main/src/assets/images/chip.png" />
                  <div style="position: absolute; top: 12px; right: 12px;">
                    <i :class="cardBrandInfo(selectedCard).icon" style="font-size: 32px; color: #ffffff;"></i>
                  </div>
                  <p class="card_numer">{{ maskCardNumber(selectedCard.number_card) || 'Selecciona una tarjeta' }}</p>
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
            </div>

            <div class="row" v-if="paymentMethod === 'card'">
              <div class="col-12 col-sm-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="selectedCard.name" label="Nombre de la Tarjeta*" 
                    :rules="[
                      (val) => !!val || 'El nombre es requerido'
                    ]" />
                </q-item>
              </div>
              <div class="col-12 col-sm-6">
                <q-item>
                  <q-input dense outlined class="full-width" label="Número de la Tarjeta"
                    v-model="selectedCard.number_card" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) => {
                        if (!val) return true;
                        const digits = (val.match(/\d/g) || []).length;
                        const expLen = this.expectedCardLength(val);
                        return digits === expLen || `Debe tener ${expLen} dígitos. Actualmente tiene ${digits}`;
                      }
                    ]"/>
                </q-item>
              </div>
              <div class="col-12 col-sm-6">
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
              <div class="col-12 col-sm-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="cvv" type="text" maxlength="4" ref="cvvInput"
                    label="CVV *" :rules="[
                      (val) => !!val || 'El CVV es requerido',
                      (val) => (val.toString().length >= 3 && val.toString().length <= 4) || 'El CVV debe tener 3 o 4 dígitos'
                    ]" />
                </q-item>
              </div>
            </div>
            <div class="row" v-if="paymentMethod === 'cash'">
              <div class="col-12">
                <q-item>
                  <q-select class="full-width" color="purple-12" v-model="model" :options="availableCashOptions"
                    label="Efectivo en puntos de pago" emit-value map-options>
                    <template v-slot:prepend>
                      <q-icon name="account_balance" />
                    </template>
                  </q-select>
                </q-item>
              </div>
            </div>
            <div class="row" v-if="paymentMethod === 'card'">
              <div class="col-12">
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
            <q-banner
              dense
              rounded
              :class="[$q.dark.isActive ? 'bg-blue-10 text-blue-1' : 'bg-blue-1 text-blue-9', 'q-mb-md q-py-sm q-px-md']"
            >
              <template v-slot:avatar>
                <q-icon name="info" color="blue" size="sm" />
              </template>
              <div class="text-body2">
                <strong>Pasos a seguir para la confirmación de su evento:</strong>
                <ul class="q-pl-md q-mt-xs q-mb-none">
                  <li class="q-mb-xs">
                    <strong>Aprobación del Artista:</strong> Al finalizar esta orden, la solicitud será enviada al artista, quien deberá revisar los detalles y 
                    <strong>aceptar o rechazar</strong> el evento para formalizar el compromiso.
                  </li>
                  <li v-if="paymentMethod === 'cash'">
                    <strong>Referencia de Pago:</strong> Dado que ha seleccionado pago en efectivo, la referencia para depositar se le generará y mostrará 
                    <strong>únicamente después</strong> de que el artista acepte la solicitud.
                  </li>
                  <li v-if="paymentMethod === 'card'">
                    <strong>Retención de Fondos:</strong> Su método de pago será verificado, pero el cargo definitivo estará sujeto a la confirmación de asistencia por parte del artista.
                  </li>
                </ul>
              </div>
            </q-banner>
            <div class="row">
              <div class="col-12">
                <q-item-label header class="text-h6">Detalles de la Orden</q-item-label>
                <template v-for="(product, index) in shoppingCardDetail" :key="index">
                  <q-item class="full-width items-center">
                    <q-item-section class="col-5 text-left">
                      <q-item-label>{{ castProduct(product).artist.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section class="col-3 text-center">
                      <q-item-label>Total de {{ castProduct(product).hours }} hora(s)</q-item-label>
                    </q-item-section>
                    <q-item-section class="col-4 text-right">
                      <div v-if="+castProduct(product).price < +castProduct(product).artist.price_hour" class="row justify-end items-center no-wrap">
                        <span class="text-positive text-weight-bold">
                          ${{ (+castProduct(product).hours * +castProduct(product).price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                        </span>
                        <small style="text-decoration: line-through" class="text-red q-ml-xs">
                          ${{ (+castProduct(product).hours * +castProduct(product).artist.price_hour).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                        </small>
                      </div>
                      <div v-else class="text-weight-bold">
                        {{ "$ " + (+castProduct(product).hours * +castProduct(product).price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                      </div>
                    </q-item-section>
                  </q-item>
                </template>
                <q-separator></q-separator>
                <div v-if="totalExtraKmCost > 0" class="q-px-md q-py-sm">
                  <div class="text-subtitle2">Costo por cobertura extra:</div>
                  <template v-for="(product, index) in shoppingCardDetail" :key="index">
                    <div v-if="getExtraKmForProduct(product)" class="row justify-between q-py-xs text-caption text-grey q-pl-md">
                      <span>- {{ (getExtraKmForProduct(product).extra_km_distance || 0).toFixed(1) }} km x ${{ (+getExtraKmForProduct(product).extra_kilometre || 0).toFixed(2) }}</span>
                      <span>${{ (+getExtraKmForProduct(product).extra_km_cost || 0).toFixed(2) }}</span>
                    </div>
                  </template>
                  <q-separator class="q-my-xs"></q-separator>
                  <div class="row justify-between q-py-xs text-caption text-weight-medium">
                    <span>Total</span>
                    <span>${{ totalExtraKmCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
                  </div>
                </div>
                <q-item class="full-width" style="border-top: 3px dotted blue">
                  <q-item-section>
                    <q-item-label lines="1">
                      <h5>Total</h5>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    {{ "MXN " + (shoppingCartTotal + totalExtraKmCost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <q-card class="rounded-borders">
              <div class="row">
                <q-card-section class="col-12 col-sm-6 q-pt-xs">
                  <div class="text-h6 text-center q-mb-md">Datos del Evento</div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="home" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption">{{ formClient.adress_line2 }}</span>
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="location_city" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption">{{ formClient.city }}, {{ formClient.state_city }}</span>
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="markunread_mailbox" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption">CP {{ formClient.zip_code }}, {{ formClient.country }}</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="row items-center q-mb-sm">
                    <q-icon name="event" color="deep-orange" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-weight-medium">{{ formClient.event_date ? formClient.event_date.split('/').reverse().join('/') : '' }}</span>
                  </div>
                  <div class="row items-center">
                    <q-icon name="schedule" color="deep-orange" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-weight-medium">{{ formClient.event_hour }}</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="row items-center q-mb-sm">
                    <q-icon name="person" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption">{{ formClient.first_name }} {{ formClient.first_last }}</span>
                  </div>
                </q-card-section>
                <q-card-section class="col-12 col-sm-6 q-pt-xs">
                <div class="text-h6 text-center q-mb-md">Detalles del Pago</div>
                <div v-if="paymentMethod === 'card'">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="credit_card" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-grey-7">Tipo</span>
                    <span class="text-caption text-weight-medium q-ml-sm">{{ selectedCard.card_type && selectedCard.card_type !== 'Desconocida' ? selectedCard.card_type : cardBrandInfo(selectedCard).text }}</span>
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="person" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-grey-7">Titular</span>
                    <span class="text-caption text-weight-medium q-ml-sm">{{ selectedCard.name }}</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="row items-center q-mb-sm">
                    <q-icon name="dialpad" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-grey-7">Número</span>
                    <span class="text-caption text-weight-medium q-ml-sm">{{ maskCardNumber(selectedCard.number_card) }}</span>
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="date_range" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-grey-7">Vence</span>
                    <span class="text-caption text-weight-medium q-ml-sm">{{ selectedCard.expiration_date }}</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="row items-center">
                    <q-icon name="paid" color="positive" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-grey-7">Total a cobrar</span>
                    <span class="text-caption text-weight-bold text-positive q-ml-sm">
                      ${{ (shoppingCartTotal + totalExtraKmCost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} MXN
                    </span>
                  </div>
                </div>
                <div v-if="paymentMethod === 'cash'">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="payments" color="positive" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-grey">Método</span>
                    <span class="text-caption text-weight-medium q-ml-sm">Efectivo</span>
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="account_balance" color="primary" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-grey">Punto de pago</span>
                    <span class="text-caption text-weight-medium q-ml-sm">{{ model }}</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="row items-center">
                    <q-icon name="paid" color="positive" size="xs" class="q-mr-sm" />
                    <span class="text-caption text-grey">Total a pagar</span>
                    <span class="text-caption text-weight-bold text-positive q-ml-sm">
                      ${{ (shoppingCartTotal + totalExtraKmCost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} MXN
                    </span>
                  </div>
                </div>
              </q-card-section>
              </div>
            </q-card>

            <q-stepper-navigation>
              <q-btn rounded @click="paymentMethod === 'cash' ? payCash() : pay()" class="float-right q-mr-md q-mb-md" color="blue"
                label="Realizar Compra" />
              <q-btn flat @click="step = 2" color="primary" rounded label="Anterior" class="q-mr-sm float-right" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
      <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
        <q-card class=" no-shadow" bordered>
          <q-card-section class="text-center text-h6 text-white bg-primary">
            <q-icon name="shopping_cart" class="q-mr-sm" />
            Resumen del pedido
          </q-card-section>
          <div class="resumen-scroll">
          <template v-for="(product, index) in shoppingCardDetail" :key="index">
            <q-card-section class="q-pa-md text-center">
              <q-img :src="castProduct(product).artist.image" loading="lazy" style="object-fit: cover" height="70px"
                class="rounded-circle q-mb-sm" width="70px" />
              <div class="text-subtitle2 text-weight-bold text-primary">
                {{ castProduct(product).artist.name }}
              </div>
              <div class="text-caption text-grey-8">
                {{ castProduct(product).hours }} hora(s) x ${{ (+castProduct(product).price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </div>
              <div v-if="+castProduct(product).price < +castProduct(product).artist.price_hour">
                <div class="text-body2 text-grey text-strike q-mb-xs">
                  ${{ (+castProduct(product).hours * +castProduct(product).artist.price_hour).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                </div>
                <q-badge color="orange" class="q-mb-xs" :label="Math.round((1 - castProduct(product).price / castProduct(product).artist.price_hour) * 100) + '% OFF'" />
                <div class="text-weight-bold text-positive" style="font-size: 1.3rem">
                  ${{ (+castProduct(product).hours * +castProduct(product).price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                </div>
              </div>
              <div v-else class="text-weight-bold text-positive" style="font-size: 1.3rem">
                ${{ (+castProduct(product).hours * +castProduct(product).price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </div>
              <div v-if="getExtraKmForProduct(product)" class="text-caption text-grey q-mt-xs">
                <q-icon name="directions_car" size="14px" class="q-mr-xs" />
                {{ (getExtraKmForProduct(product).extra_km_distance || 0).toFixed(1) }} km extra: +${{ (+getExtraKmForProduct(product).extra_km_cost || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </div>
            </q-card-section>
            <q-separator v-if="index < shoppingCardDetail.length - 1"></q-separator>
          </template>
          </div>

          <q-separator></q-separator>
          <q-card-section class="col-3 q-pt-xs  text-white bg-primary">
            <div class=" full-width ">
              <div class="col-12 col-sm-3 col-md-4 text-center text-h6">
                TOTAL:
                <span class="text-right">{{ "$ " +
                  (shoppingCartTotal + totalExtraKmCost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showCashDialog" persistent>
      <q-card style="width: 420px; border-radius: 20px" class="q-pa-md">
        <div ref="paymentReceipt" class="receipt-card">
          <q-card-section class="text-center q-pb-none q-pt-md">
            <img src="/logovibeer-black.png" style="height: 55px" class="q-mb-sm" />
            <div class="text-h6 text-primary text-weight-bold">Referencia de pago</div>
          </q-card-section>
          <q-card-section class="text-center q-pt-md">
            <div class="row items-center justify-center q-mb-sm">
              <q-icon name="store" color="primary" size="sm" class="q-mr-xs" />
              <span class="text-subtitle1">Pagar en <strong>{{ cashReference?.store }}</strong></span>
            </div>
            <q-card flat bordered class="q-pa-md q-my-md bg-grey-1" style="border-radius: 12px">
              <div class="text-caption text-grey q-mb-xs">Referencia</div>
              <div class="text-h5 text-primary text-weight-bold" style="letter-spacing: 3px">{{ cashReference?.reference }}</div>
            </q-card>
            <img v-if="cashReference?.barcode" :src="cashReference.barcode" style="max-width: 260px; height: 80px; object-fit: contain" class="q-mx-auto q-my-md" />
            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-6">
                <div class="text-caption text-grey">Monto</div>
                <div class="text-subtitle1 text-weight-bold">${{ (parseFloat(cashReference?.amount) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} MXN</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey">Vence</div>
                <div class="text-subtitle1 text-weight-bold">{{ formatDueDate(cashReference?.due_date) }}</div>
              </div>
            </div>
          </q-card-section>
        </div>
        <q-card-actions align="center" class="q-pt-md">
          <q-btn-dropdown rounded color="primary" label="Descargar" icon="download">
            <q-list>
              <q-item clickable v-close-popup @click="downloadReceiptPDF">
                <q-item-section avatar>
                  <q-icon name="picture_as_pdf" color="red" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>PDF</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="downloadReceiptImage">
                <q-item-section avatar>
                  <q-icon name="image" color="green" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Imagen</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn rounded flat color="grey" label="Entendido" @click="showCashDialog = false; $router.push('/client/shopping-cart/view-my-order-details')" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { mapActions, mapState, mapGetters } from "vuex";
import { ref } from "vue";
import { api } from "boot/axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { notifySuccess, notifyError, notifyWarning, platformEvents } from "src/utils/notify";

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
      occupiedDates: ref([]),
      cashReference: ref(null),
      showCashDialog: ref(false),
      googleMapsEnabled: ref(false),
      latitude: ref(null),
      longitude: ref(null),
      googlePlaceId: ref(null),
      googleMapsLoaded: ref(false),
      userPosition: ref(null),
      googleMapsApiKey: ref(null),
      extraKmDataList: ref({}),
    };
  },
  methods: {
    formatDueDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const time = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      return `${day}/${month}/${year} ${time}`;
    },
    castCard(card) {
      return card;
    },

    dateOption(date) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const minDateStr = `${yyyy}/${mm}/${dd}`;

      const isValidDate = minDateStr <= date;
      const isOccupied = this.occupiedDates.includes(date);
      
      return isValidDate && !isOccupied;
    },

    timeOption(hr, min, sec) {
      if (!this.formClient.event_date) return false;

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const tomorrowStr = `${yyyy}/${mm}/${dd}`;

      if (tomorrowStr === this.formClient.event_date) {

        if (today.getHours() > hr) return false;

        if (today.getHours() === hr && null !== min && today.getMinutes() > min) return false;
      }

      return true;
    },

    async loadOccupiedDates(artistId) {
      if (!artistId) return;
      try {
        const url = `/api/artist-sales?artist_id=${artistId}`;
        const response = await api.get(url);
    
        if (response.data?.sales && Array.isArray(response.data.sales)) {
          const newDates = response.data.sales.map((sale) => {
            let dateVal = sale.event_date;
            if (!dateVal) return null;
            try {
              let dateStr = dateVal.toString();

              if (dateStr.includes('-')) {
                const datePart = dateStr.split('T')[0].split(' ')[0];
                const [y, mRaw, dRaw] = datePart.split('-');
                const m = String(mRaw).padStart(2, '0');
                const d = String(dRaw).padStart(2, '0');
                return `${y}/${m}/${d}`;
              }
              
              const d = new Date(dateVal);
              if (isNaN(d.getTime())) {
                console.warn('Invalid date:', dateVal);
                return null;
              }
              const y = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              const formatted = `${y}/${month}/${day}`;
              return formatted;
            } catch (e) {
              console.error('Error parsing date:', dateVal, e);
              return null;
            }
          }).filter(d => d !== null);
          this.occupiedDates = [...new Set([...this.occupiedDates, ...newDates])];
        }
      } catch (err) {
        console.error('Error loading occupied dates:', err.message);
        notifyWarning('No se pudieron cargar las fechas ocupadas. Por favor, verifica que el artista sea válido.');
      }
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
      if (!number) return 'Desconocida';
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
    expectedCardLength(number) {
      const type = this.detectCardType(number);
      return type === 'American Express' ? 15 : 16;
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
      !this.paymentMethod
        ? notifyError("Debes seleccionar un método de pago")
        : this.paymentMethod === 'card'
          ? !this.selectedCard || !this.selectedCard.number_card
            ? notifyError("Debes seleccionar una tarjeta")
            : !this.cvv || this.cvv.toString().length < 3 || this.cvv.toString().length > 4
              ? (notifyError("El CVV debe tener 3 o 4 dígitos"),
                 this.$nextTick(() => this.$refs.cvvInput?.validate()))
              : (this.step = 3)
          : this.paymentMethod === 'cash'
            ? !this.model
              ? notifyError("Debes seleccionar un punto de pago en efectivo")
              : (this.step = 3)
            : null;
    },
    validateCardNumber() {
      const val = this.form.number_card;
      if (!val) {
        notifyError('Campo requerido');
        return false;
      }
      const digits = (val.match(/\d/g) || []).length;
      const expLen = this.expectedCardLength(this.selectedCard.number_card || this.form.number_card);
      if (digits !== expLen) {
        notifyError(`Debe tener ${expLen} digitos, tiene ${digits}`);
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
        err.response?.data?.message && notifyError(err.response.data.message);
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
        const discountPercent = parseFloat(artistData.discount_percentage) || 0;
        const effectivePricePerHour = discountPercent > 0
          ? Math.round(artistData.price_hour * (1 - discountPercent / 100) * 100) / 100
          : parseFloat(artistData.price_hour);
        const clientTotal = Math.round(effectivePricePerHour * hoursCount * 100) / 100;

        this.quickBuyData = {
          artist_id: artistId,
          artist: {
            ...artistData,
            discount_percentage: discountPercent
          },
          hours: hoursCount,
          price: effectivePricePerHour,
          total: clientTotal
        };
        
        await this.loadOccupiedDates(artistId);
        this.isQuickBuy = true;
      } catch (err) {
        notifyError("Error al cargar el artista. Por favor, intenta de nuevo.");
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
        : await this.getListShoppingCard().then(async () => {
            this.shoppingCardDetail.length === 0
              ? (notifyWarning("Tu carrito está vacío. Agrega artistas antes de continuar."),
                this.$router.push("/client/shopping-cart"))
                : (this.occupiedDates = [], await Promise.all(
                    this.shoppingCardDetail
                      .filter(item => item.artist_id)
                      .map(item => this.loadOccupiedDates(item.artist_id))
                  ));
          });

      try {
        await this.fetchProfile();
      } catch (err) {

      }

      (!this.selectedCard || !this.selectedCard.id) && this.stateUserCards?.length && (
        (this.selectedCardIndex = 0),
        (this.selectedCard = { ...this.stateUserCards[0] })
      );
    },
    async fetchProfile() {
      try {
        const resp = await api.get('/api/client/last-order');
        resp.data?.success && resp.data?.order && (() => {
          const o = resp.data.order;
          this.formClient.first_name = o.first_name || '';
          this.formClient.first_last = o.last_name || '';
          this.formClient.email = o.email || '';
          this.formClient.phone = o.phone || '';
          this.formClient.adress_line2 = o.address || '';
          this.formClient.city = o.city || '';
          this.formClient.state_city = o.state || '';
          this.formClient.zip_code = o.zip_code || '';
          this.formClient.country = 'México';
          this.latitude = o.latitude || null;
          this.longitude = o.longitude || null;
          this.latitude && this.longitude && this.$nextTick(() => this.fetchExtraKmPreview());
        })();
      } catch (err) {
      }
    },
    async createNewOrders() {
      try {
        await this.createNewOrder(this.formClient.value);
        this.onReset();
        platformEvents.orderCreated();
      } catch (err) {
        if (err.response.data.message) {
          notifyError(err.response.data.message);
        }
      }
    },
    async createCardNew() {
      const cardData = this.form?.value || this.form;

      if (!cardData.name || cardData.name.trim().length < 3) {
        notifyError("El nombre debe tener al menos 3 caracteres");
        return;
      }

      if (!cardData.number_card) {
        notifyError("El número de tarjeta es requerido");
        return;
      }

      const digits = (cardData.number_card.match(/\d/g) || []).length;
      const expLen = this.expectedCardLength(cardData.number_card);
      if (digits !== expLen) {
        notifyError(`El número de tarjeta debe tener ${expLen} dígitos. Actualmente tiene ${digits}`);
        return;
      }

      const cardClean = cardData.number_card.replace(/[\s-]/g, '');
      if (!this.luhnCheck(cardClean)) {
        notifyError("El número de tarjeta no es válido (validación Luhn)");
        return;
      }

      if (!cardData.expiration_date) {
        notifyError("La fecha de expiración es requerida");
        return;
      }

      try {
        await this.createCard(cardData);
        this.formCreate = false;
        this.onReset();
        notifySuccess("Tarjeta creada correctamente");
        await this.gettCards();
        await this.showCards();

        this.stateUserCards?.length && (() => {
          const lastIndex = this.stateUserCards.length - 1;
          this.selectedCardIndex = lastIndex;
          this.selectedCard = { ...this.stateUserCards[lastIndex] };
        })();
      } catch (err) {
        notifyError(err.response?.data?.message || "Error al crear la tarjeta");
      }
    },
    maskCardNumber(cardNumber) {
      if (!cardNumber) return '';
      const cleaned = cardNumber.replace(/[\s-]/g, '');
      const last4 = cleaned.slice(-4);
      const hidden = cleaned.slice(0, -4).replace(/\d/g, 'x');
      const groups = [];
      const hiddenWithDashes = hidden.match(/.{1,4}/g);
      if (hiddenWithDashes) groups.push(...hiddenWithDashes);
      groups.push(last4);
      return groups.join('-');
    },
    cardBrandInfo(card) {
      const type = (card.card_type && card.card_type !== 'Desconocida') ? card.card_type : this.detectCardType(card.number_card);
      const brands = {
        'Visa': { color: '#1A1F71', text: 'VISA', icon: 'fab fa-cc-visa' },
        'Mastercard': { color: '#EB001B', text: 'MC', icon: 'fab fa-cc-mastercard' },
        'American Express': { color: '#2E77BC', text: 'AMEX', icon: 'fab fa-cc-amex' },
        'Discover': { color: '#FF6000', text: 'DISCOVER', icon: 'fab fa-cc-discover' },
        'Diners Club': { color: '#0079BE', text: 'DINERS', icon: 'fab fa-cc-diners-club' },
        'JCB': { color: '#0B7B4B', text: 'JCB', icon: 'fab fa-cc-jcb' },
      };
      return brands[type] || { color: '#6B7280', text: type, icon: 'fas fa-credit-card' };
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
          latitude: this.latitude,
          longitude: this.longitude,
        };

        const response = await api.post("/api/client/save-address", addressData);
        
        if (response.data.success) {
        }
      } catch (error) {
        console.error("Error guardando dirección:", error);
        throw error;
      }
    },
    async pay() {
      const validateAndNotify = (condition, message) => {
        return condition && (notifyError(message), true);
      };

      const digits = (this.selectedCard?.number_card?.match(/\d/g) || []).length;
      const expLen = this.expectedCardLength(this.selectedCard?.number_card || '');
      
      validateAndNotify(!this.selectedCard?.number_card, "Debes seleccionar una tarjeta")
      || validateAndNotify(digits !== expLen, `El número de tarjeta debe tener ${expLen} dígitos. Actualmente tiene ${digits}`)
      || validateAndNotify(!this.selectedCard?.expiration_date || this.selectedCard.expiration_date.length !== 5, "La fecha de expiración debe estar en formato mm/YY")
      || (() => {
        const [month] = this.selectedCard.expiration_date.split("/");
        const monthNum = parseInt(month, 10);
        return validateAndNotify(monthNum < 1 || monthNum > 12, "El mes debe estar entre 01 y 12");
      })()
      || validateAndNotify(!this.cvv || this.cvv.toString().length < 3 || this.cvv.toString().length > 4, "El CVV debe tener 3 o 4 dígitos")
      || (() => {
        const expectedCvvLength = this.getExpectedCvvLength(this.selectedCard.number_card);
        return validateAndNotify(this.cvv.toString().length !== expectedCvvLength,
          expectedCvvLength === 4
            ? "Esta tarjeta requiere un CVV de 4 dígitos"
            : "Esta tarjeta requiere un CVV de 3 dígitos");
      })()
      || validateAndNotify(typeof OpenPay === "undefined", "Error: OpenPay no está cargado. Recarga la página.") || this.processPay();
    },

    payCash() {
      !this.model
        ? notifyError("Debes seleccionar un punto de pago")
        : this.processCashPay();
    },

    
    async processPay() {
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
        OpenPay.setSandboxMode(openpayKeys.openpay_sandbox_mode ?? true);

        let deviceDataId = null;
        try {
          deviceDataId = OpenPay.deviceData?.generateSessionId?.() ?? OpenPay.deviceData?.setup?.("formId") ?? null;
        } catch (e) {
          console.warn('Device data setup fallido, continuando sin él:', e);
        }

        const card_number = this.selectedCard.number_card.replace(/[\s-]/g, "");
        const [month, year] = this.selectedCard.expiration_date.split('/');

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
                  latitude: this.latitude,
                  longitude: this.longitude,
                  google_place_id: this.googlePlaceId,
                },
                latitude: this.latitude,
                longitude: this.longitude,
                google_place_id: this.googlePlaceId,
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
                    number_card: (this.selectedCard.number_card || '').replace(/[\s-]/g, ''),
                    expiration_date: this.selectedCard.expiration_date,
                  };
                  await this.createCard(cardToSave);
                } catch (err) {
                  console.error("Error saving card:", err);
                }
              }

              this.$q.loading.hide();
              platformEvents.reservationRegistered();

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
              
              notifyError(errorMessage, { timeout: 5000 });
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
            
            notifyError("Error al crear el token: " + errorMessage, { timeout: 5000 });
          }
        );
      } catch (err) {
        this.$q.loading.hide();
        notifyError(err.message || "Vibeer no pudo procesar tu pago. Intenta de nuevo.");
      }
    },

    async processCashPay() {
      if (!this.formClient.email || !this.formClient.phone || !this.shoppingCartTotal) {
        notifyError('Por favor, completa los campos del cliente.');
        return;
      }

      const storeLimits = {
        'BBVA': 29999,
        'Santander': 29999,
        'Hsbc': 29999,
        'CityBanamex': 29999,
        'Oxxo': 5000
      };

      const selectedStore = this.model;
      const maxLimit = storeLimits[selectedStore] || 29999;

      if (this.shoppingCartTotal + this.totalExtraKmCost > maxLimit) {
        notifyWarning(
          `El límite máximo para pagos en efectivo en ${selectedStore} es de $${maxLimit.toLocaleString('en-US')} MXN. Por favor, utilice tarjeta.`,
          { timeout: 6000 }
        );
        return;
      }

      this.$q.loading.show({
        message: 'Registrando tu reserva...',
        spinnerColor: 'primary'
      });

      try {
        const artistList = this.isQuickBuy
          ? [{ artist_id: this.quickBuyData.artist_id, hours: this.quickBuyData.hours }]
          : this.shoppingCardDetail.map((e) => ({ artist_id: e.artist_id, hours: e.hours }));

        const payload = {
          store: this.model,
          amount: this.shoppingCartTotal * 100,
          order_details: {
            first_name: this.formClient.first_name,
            last_name: this.formClient.first_last,
            email: this.formClient.email,
            phone: this.formClient.phone,
            address: this.formClient.adress_line2,
            city: this.formClient.city,
            state: this.formClient.state_city,
            zip_code: this.formClient.zip_code,
            event_date: this.formClient.event_date,
            event_hour: this.formClient.event_hour,
            latitude: this.latitude,
            longitude: this.longitude,
            google_place_id: this.googlePlaceId,
          },
          latitude: this.latitude,
          longitude: this.longitude,
          google_place_id: this.googlePlaceId,
          artistList,
        };

        const response = await api.post('/api/payment/cash', payload);

        platformEvents.reservationRegistered(response.data?.message, { timeout: 6000 });

        this.$router.push('/client/shopping-cart/view-my-order-details');
      } catch (err) {
        console.error('Error procesando pago:', err);

        notifyError(
          err.response?.data?.message || err.response?.data?.error?.description || 'Error al generar la referencia',
          { timeout: 5000 }
        );
      } finally {
        this.$q.loading.hide();
      }
    },

    onReset() {
      (this.form?.value) 
        ? (this.form.value.id = "", 
           this.form.value.name = "", 
           this.form.value.number_card = "", 
           this.form.value.expiration_date = "")
        : (this.form = {
            id: "",
            name: "",
            number_card: "",
            expiration_date: "",
          });
    },

    async captureReceipt() {
      return await html2canvas(this.$refs.paymentReceipt, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
      });
    },

    async downloadReceiptImage() {
      this.$q.loading.show({ message: 'Descargando imagen...', spinnerColor: 'primary' });
      try {
        const canvas = await this.captureReceipt();
        const ref = this.cashReference?.reference || 'referencia';
        const link = document.createElement('a');
        link.download = `${ref}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        notifySuccess('Imagen descargada');
      } catch (err) {
        console.error(err);
        notifyError('Error al descargar la imagen');
      } finally {
        this.$q.loading.hide();
      }
    },

    async downloadReceiptPDF() {
      this.$q.loading.show({ message: 'Descargando PDF...', spinnerColor: 'primary' });
      try {
        const canvas = await this.captureReceipt();
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const ref = this.cashReference?.reference || 'referencia';
        pdf.save(`${ref}.pdf`);
        notifySuccess('PDF descargado');
      } catch (err) {
        console.error(err);
        notifyError('Error al descargar el PDF');
      } finally {
        this.$q.loading.hide();
      }
    },

    onToggleMap(val) {
      val
        ? this.loadGoogleMapsApi().then(() => {
            this.getCurrentPosition()
              .then((pos) => {
                this.userPosition = pos;
                this.$nextTick(() => this.initMap());
              })
              .catch(() => {
                this.$nextTick(() => this.initMap());
              });
          }).catch((err) => {
            console.error('Error loading Google Maps API:', err);
            notifyError('Error al cargar Google Maps');
            this.googleMapsEnabled = false;
          })
        : (this.latitude = null,
           this.longitude = null,
           this.googlePlaceId = null);
    },

    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation no soportada'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
          () => reject(new Error('No se pudo obtener la ubicación')),
          { timeout: 5000, enableHighAccuracy: true }
        );
      });
    },

    async loadGoogleMapsApi() {
      if (window.google && window.google.maps) {
        this.googleMapsLoaded = true;
        return window.google.maps;
      }

      let apiKey = this.googleMapsApiKey;
      if (!apiKey) {
        const resp = await api.get('/api/google-maps-key');
        apiKey = resp.data?.data?.google_maps_api_key;
        this.googleMapsApiKey = apiKey;
      }

      if (!apiKey) {
        throw new Error('GOOGLE_MAPS_API_KEY no configurada');
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.googleMapsLoaded = true;
          resolve(window.google.maps);
        };
        script.onerror = () => reject(new Error('Error al cargar Google Maps API'));
        document.head.appendChild(script);
      });
    },

    fillAddressFromGeocodeResult(result) {
      this.googlePlaceId = result.place_id || null;
      this.formClient.adress_line2 = result.formatted_address || '';

      const componentMap = {};
      for (const comp of result.address_components) {
        componentMap[comp.types[0]] = comp.long_name;
      }

      this.formClient.city = componentMap['administrative_area_level_1'] || componentMap['administrative_area_level_2'] || '';
      this.formClient.state_city = componentMap['locality'] || componentMap['sublocality'] || componentMap['postal_town'] || '';
      this.formClient.zip_code = componentMap['postal_code'] || '';
      this.formClient.country = componentMap['country'] || 'México';
      this.$nextTick(() => this.fetchExtraKmPreview());
    },

    initMap() {
      if (!this.$refs.mapContainer) return;

      const defaultPos = this.userPosition || { lat: 19.4326, lng: -99.1332 };

      this.initMapAtPosition(defaultPos);
    },

    initMapAtPosition(position) {
      if (!this.$refs.mapContainer || !window.google) return;

      this.mapInstance = new google.maps.Map(this.$refs.mapContainer, {
        center: position,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });

      this.markerInstance = new google.maps.Marker({
        map: this.mapInstance,
        position: position,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      const onMarkerMoved = (latLng) => {
        this.latitude = latLng.lat();
        this.longitude = latLng.lng();

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: this.latitude, lng: this.longitude } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            this.fillAddressFromGeocodeResult(results[0]);
          }
        });
      };

      this.markerInstance.addListener('dragend', () => {
        onMarkerMoved(this.markerInstance.getPosition());
      });

      this.mapInstance.addListener('click', (e) => {
        this.markerInstance.setPosition(e.latLng);
        this.mapInstance.panTo(e.latLng);
        onMarkerMoved(e.latLng);
      });

      if (!this.latitude) {
        this.latitude = position.lat;
        this.longitude = position.lng;
      }
    },

    getExtraKmForProduct(product) {
      const p = this.castProduct(product);
      if (!p || !p.artist_id) return null;
      return this.extraKmDataList[p.artist_id] || null;
    },

    async fetchExtraKmPreview() {
      if (!this.latitude || !this.longitude) return;

      this.extraKmDataList = {};

      const items = this.isQuickBuy
        ? [{ artist_id: this.quickBuyData.artist_id, hours: this.quickBuyData.hours }]
        : this.shoppingCardDetail.map((e) => ({ artist_id: e.artist_id, hours: e.hours }));

      for (const item of items) {
        try {
          const resp = await api.get('/api/payment/preview-extra-km', {
            params: {
              artist_id: item.artist_id,
              hours: item.hours,
              latitude: this.latitude,
              longitude: this.longitude,
            },
          });

          if (resp.data?.success) {
            this.extraKmDataList = {
              ...this.extraKmDataList,
              [item.artist_id]: resp.data.data,
            };
          }
        } catch (err) {
          console.error('Error fetching extra km preview:', err);
        }
      }
    },
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
        return parseFloat(this.quickBuyData.total) || 0;
      }
      return parseFloat(this.stateListShopingCard?.[0]?.total) || 0;
    },
    totalExtraKmCost() {
      return Object.values(this.extraKmDataList).reduce((sum, item) => sum + (parseFloat(item.extra_km_cost) || 0), 0);
    },
    availableCashOptions() {
      const totalAmount = this.shoppingCartTotal;
      const storeMaxLimits = {
        'BBVA': 29999,
        'Santander': 29999,
        'Hsbc': 29999,
        'CityBanamex': 29999,
        'Oxxo': 5000
      };

      const defaultOptions = [
        { label: 'BBVA', value: 'BBVA' },
        { label: 'Santander', value: 'Santander' },
        { label: 'Hsbc', value: 'Hsbc' },
        { label: 'CityBanamex', value: 'CityBanamex' },
        { label: 'Oxxo', value: 'Oxxo' },
      ];

      return defaultOptions
        .filter(option => totalAmount <= storeMaxLimits[option.value])
        .map(option => ({
          ...option,
          label: `${option.label} (Max $${storeMaxLimits[option.value].toLocaleString('en-US')})`
        }));
    }
  },
  watch: {
    'form.number_card': {
      handler(val) {
        let digits = val.replace(/[\s-]/g, '').replace(/\D/g, '');
        if (digits.length === 0) {
          if (val !== '') this.form.number_card = '';
          return;
        }
        const maxLen = /^3[47]/.test(digits) ? 15 : 16;
        digits = digits.slice(0, maxLen);
        const groups = [];
        for (let i = 0; i < digits.length; i += 4) {
          groups.push(digits.slice(i, i + 4));
        }
        const formatted = groups.join('-');
        if (val !== formatted) this.form.number_card = formatted;
      },
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

.resumen-scroll {
  max-height: 400px;
  overflow-y: auto;
}
</style>
