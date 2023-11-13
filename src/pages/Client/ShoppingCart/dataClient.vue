<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
        <q-stepper v-model="step" header-nav ref="stepper" class="no-shadow" bordered animated>
          <q-step :name="1" title="Informacion de la Compra" icon="shopping_cart" :done="step > 1" :header-nav="step > 1">
            <img class="openpay" src="https://assets.stickpng.com/images/62e3c66bd889babae63d750e.png" />
            <q-form @submit="createNewOrders">
              <div class="row">
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined class="full-width" type="text" v-model="formClient.first_name"
                      label="Nombre *" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined class="full-width" type="text" v-model="formClient.first_last"
                      label="Apellidos *" required />
                  </q-item>
                </div>
                <div class="col-12">
                  <q-item>
                    <q-input dense outlined type="email" v-model="formClient.email" class="full-width" label="Email*"
                      required />
                  </q-item>
                </div>
                <div class="col-12">
                  <q-item>
                    <q-input dense outlined type="text" v-model="formClient.adress_line2" class="full-width"
                      label="Domicilio *" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="text" class="full-width" v-model="formClient.city" label="Cuidad *"
                      required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="text" class="full-width" v-model="formClient.state_city"
                      label="Estado de la Cuidad" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="number" class="full-width" v-model="formClient.zip_code"
                      label="Codigo Postal" required />
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-input dense outlined type="text" v-model="formClient.country" label="Pais *" class="full-width"
                      required />
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
                <q-btn rounded @click="() => { done1 = true; step = 2; }" class="float-right q-mr-md q-mb-md" color="blue"
                  label="Next"
                  :disable="!formClient.first_name || !formClient.first_last || !formClient.email || !formClient.adress_line2 || !formClient.city || !formClient.state_city || !formClient.zip_code || !formClient.country" />
              </q-stepper-navigation>
            </q-form>
          </q-step>

          <q-step :name="2" title="Opciones de Pago" icon="shopping_cart" :done="step > 2" :header-nav="step > 2">
            <div class="q-gutter-md q-flex">
            <q-btn unelevated rounded color="primary" class="select-card" label="Seleccionar Tarjeta" @click="basic = true" />
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
                        <p class="card_numer">{{ cards.number_card }}</p>
                        <div class="card__space-75">
                          <span class="card__label">Nombre de la Tarjeta</span>
                          <p class="card__info">{{ cards.name }}</p>
                        </div>
                        <div class="card__space-25">
                          <span class="card__label">Expires</span>
                          <p class="card__info">{{ cards.expiration_date }}</p>
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

            <section>
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
                      <q-form @submit="createCardNew" class="q-gutter-md col-6">
                        <q-input dense lazy-rules v-model="form.name" autofocus label="Nombre completo del propietario"
                          :rules="[(val) => !!val || 'El campo nombre es requerido']" />

                        <q-input dense lazy-rules v-model="form.number_card" label="Numero de trajeta" fill-mask
                          mask="#### - #### - #### - ####" :rules="[
                            (val) => !!val || 'El campo número de tarjeta es requerido',
                          ]" />

                        <q-input dense lazy-rule v-model="form.expiration_date" label="Fecha de expiración" mask="##/##"
                          fill-mask hint="Fecha: mm/YY" :rules="[
                            (val) => !!val || 'El campo fecha de expiración es requerido',
                          ]" />
                        <q-card-actions align="right" class="text-primary">
                          <q-btn flat label="Cancelar" v-close-popup color="red" />
                          <q-btn flat label="Crear" type="submit" color="primary" />
                        </q-card-actions>
                      </q-form>
                    </q-card-section>
                  </q-card>
                </q-dialog>
              </div>
            </section>
          </div>
            <div class="row">

              <div class="card col-12 col-sm-3 col-md-4 q-ma-sm">
                <div class="card__front card__part">
                  <img class="card__square" src="https://conta.nubank.com.br/images/nu-white.png" />
                  <p class="card_numer">{{ selectedCard.number_card }}</p>
                  <div class="card__space-75">
                    <span class="card__label">Nombre de la Tarjeta</span>
                    <p class="card__info">{{ selectedCard.name }}</p>
                  </div>
                  <div class="card__space-25">
                    <span class="card__label">Expires</span>
                    <p class="card__info">{{ selectedCard.expiration_date }}</p>
                  </div>
                </div>
              </div>

              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" v-model="selectedCard.name" label="Nombre de la Tarjeta*" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense outlined class="full-width" label="Numero de la Tarjeta*"
                    v-model="selectedCard.number_card"/>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense autogrow outlined class="full-width" v-model="selectedCard.expiration_date"
                    label="Fecha de Expiracion *" />
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-input dense autogrow outlined class="full-width"
                    label="CVV *" />
                </q-item>
              </div>
            </div>
            <div class="row">
              <div class="col-6 full-width">
                <q-item>
                  <q-select class="full-width" color="purple-12" v-model="model" :options="options"
                    label="Efectivo en puntos de pago">
                    <template v-slot:prepend>
                      <q-icon name="account_balance" />
                    </template>
                  </q-select>
                </q-item>
              </div>
            </div>
            <div class="col-6">
              <q-item>
                <q-checkbox dense outlined class="full-width"
                  label="Desea recordar los datos de la tarjeta de crédito para la próxima Compra"
                  v-model="card_detail.checkbox" />
              </q-item>
            </div>

            <q-stepper-navigation>
              <q-btn rounded @click="() => { done2 = true; step = 3; }" class="float-right q-mr-md q-mb-md" color="blue"
                label="Next" />
              <q-btn flat @click="step = 1" color="primary" rounded label="Back" class="q-mr-sm float-right" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Revise su orden" icon="shopping_cart" :header-nav="step > 3">
            <div class="row">
              <div class="col-12">
                <q-item-label header class="text-h6">Detalles de la Orden</q-item-label>
                <q-item class="full-width" v-for="(product, index) in stateListShopingCard[0].shopping_card_detail"
                  :key="index">
                  <q-item-section class="r">
                    <q-item-label>{{ product.artist.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section class="" middle>
                    <q-item-label>Total de {{ product.hours }} hora(s)</q-item-label>
                  </q-item-section>
                  <q-item-section class="text-right" side>
                    {{ "$ " + product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
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
                  <div class="text-subtitle1 q-mb-xs">Tipo de Tarjeta - Visa</div>
                  <div class="text-subtitle1 q-mb-xs">
                    Titular de la tarjeta - {{ selectedCard.name }}
                  </div>
                  <div class="text-subtitle1 q-mb-xs">
                    Numero de la Tarjeta - {{ maskCardNumber(selectedCard.number_card) }}
                  </div>
                  <div class="text-subtitle1 q-mb-xs">
                    Fecha de Expiracion - {{ selectedCard.expiration_date }}
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>

            <q-stepper-navigation>
              <q-btn rounded @click="done3 = true" class="float-right q-mr-md q-mb-md" color="blue"
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
              <q-img :src="product.artist.image" loading="lazy" style="object-fit: cover" height="100px"
                class="rounded-circle q-responsive" width="110px" />
            </q-card-section>

            <q-card-section>
              <div class="text-subtitle2 q-mt-sm text-center">
                {{ product.artist.name }}
              </div>
              <div class="text-subtitle2 q-mb-xs text-center">
                {{ "$ " + product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
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
import { mapActions, mapGetters } from "vuex";
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

    return {
      formCreate,
      selectedCard: {},
      basic: ref(false),
      model: ref(null),
      options: [
        { label: 'BBVA', value: 'BBVA' },
        { label: 'Santander', value: 'Santander' },
        { label: 'Hsbc', value: 'Hsbc' },
        { label: 'CityBanamex', value: 'CityBanamex' },
        { label: 'Oxxo', value: 'Oxxo' },
      ],
      address_detail: ref({}),
      card_detail: ref({}),
      listShopingCard: {},
      cards: {},
      formClient,
      form,
      step,
    };
  },
  methods: {
    ...mapActions("card", ["showCards"]),
    ...mapActions("shoppingCard", ["getListShoppingCard"]),
    ...mapActions("card", ["createCard"]),
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
      try {
        await this.createCard(this.form);
        this.formCreate = false;
        this.onReset();
        this.$q.notify({
          type: "positive",
          message: `Tarjeta creada correctamente`,
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
  },
  computed: {
    ...mapGetters("card", ["stateUserCards"]),
    ...mapGetters("shoppingCard", ["stateListShopingCard"]),
  },
  created() {
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
