<template>
  <q-page padding>
    <q-layout>
      <q-dialog v-model="mostrar" persistent style="width: 500px !important;">
      <!-- Contenido del modal -->
      <q-card style="width: 700px !important;">
        <q-card-section>
          <!-- Campos de facturación
          <q-input v-model="client.name" label="Nombre" />
          <q-input v-model="client.lastname" label="Dirección" />
          <q-input v-model="client.email" label="Email" /> -->
          <!-- Campos de tarjeta de crédito -->
          <div class="row q-ma-sm" v-if="cards != 0">
            <div v-for="(card, index) in cards" :key="index">
              <div class="card col-12 col-sm-3 col-md-4 q-ma-sm">
                <div class="card__front card__part">
                  <!-- Inicio de logo izquierdo -->
                  <img
                    class="card__square"
                    src="https://conta.nubank.com.br/images/nu-white.png"
                  />
                  <!-- Fin de logo izquierdo -->

                  <!-- Inicio de boton editar -->
                  <q-radio 
                    v-model="selectedCard"
                    :val="card.id"
                    name="radio_card"
                    size="md"
                    color="red"
                    class="card__front-logo2 card__logo q-mr-sm"
                  />
                  <!-- Fin de boton editar -->

                  <!-- Inicio de información de la tarjeta -->
                  <p class="card_numer">{{ card.number_card }}</p>
                  <div class="card__space-75">
                    <span class="card__label">Nombre</span>
                    <p class="card__info">{{ card.name }}</p>
                  </div>
                  <div class="card__space-25">
                    <span class="card__label">Expires</span>
                    <p class="card__info">{{ card.expiration_date }}</p>
                  </div>
                  <!-- Fin de información de la tarjeta -->
                </div>
              </div>
            </div>        
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" @click="cerrarModal" />
          <q-btn label="Comprar" color="positive" @click="pay()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
      <q-layout-main>
        <label><h5>Agregar Domicilio</h5></label>
        <q-card class="shadow-box">
          <q-card-section>
            <q-form @submit.prevent="onSubmit">
              <div class="form-group">
                <label for="name">Nombre</label>
                <q-input v-model="client.name" hint="Incluye tus apellidos" />
              </div>

              <div class="form-group">
                <label for="last-name">Apellido</label>
                <q-input
                  v-model="client.lastname"
                  hint="Incluye tus apellidos"
                />
              </div>

              <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <q-input
                  v-model="client.email"
                  hint="Incluye tu correo electrónico"
                />
              </div>

              <div class="form-group">
                <label for="postal">Código postal</label>
                <q-input v-model="client.postal" hint="Codigo postal" />
              </div>

              <div class="form-group">
                <label for="phone">Teléfono</label>
                <q-input v-model="client.phone" hint="Telefono de contacto" />
              </div>

              <div class="form-group">
                <label for="address">Dirección</label>
                <q-input v-model="client.address" hint="Direccion Actual" />
              </div>

              <div class="form-group">
                <label for="city">Ciudad</label>
                <q-input v-model="client.city" hint="Cuidad" />
              </div>

              <div class="form-group">
                <label for="city_state">Estado de la Cuidad</label>
                <q-input v-model="client.city_state" hint="Estado de la republica" />
              </div>

              <div class="form-group">
                <q-btn label="Continuar" @click="mostrarModal()" type="button" color="blue"></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-layout-main>

      <q-layout-right>
        <label><h5>Metodos de Pago</h5></label>
        <q-card class="shadow-box q-ma-md" style="justify-content: center">
          <q-card-section style="align-items: center">
            <q-list style="justify-content: center">
              <q-item>
                <q-item-section>
                  <q-icon name="credit_card" />
                  <span>Tarjeta de Crédito</span>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-icon name="paypal" />
                  <span>PayPal</span>
                </q-item-section>
              </q-item>

              <q-item>
                <q-btn
                  label="Agregar Tarjeta"
                  color="blue"
                  @click="$router.push('/client/card')"
                  class="q-btn--small"
                  align-self="center"
                ></q-btn>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-layout-right>
    </q-layout>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import { ref } from "vue";
import { mapGetters } from "vuex";

let $q;
export default {
  data() {
    return {
      showInfo: null,
      mostrar: false,
      selectedCard: null,
      item: {
        artist_id: "",
        hours_artist: "",
      },
      client: {
        name: "",
        lastname: "",
        postal: "",
        phone: "",
        address: "",
        city: "",
        city_state: "",
      },
      paymentMethods: {
        credit_card: false,
        paypal: false,
      },
    };
  },

  methods: {
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
    async gettListShoppingCard() {
      try {
        await this.getListShoppingCard().then(() => {
          if (this.stateListShopingCard == null) {
            this.showInfo = false;
          } else {
            this.showInfo = true;
          }
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
    deleteItem(artist) {
      try {
        let artist_id = artist.id;
        let name = artist.name;
        console.log(artist_id);
        this.$q
          .dialog({
            title: "Mensaje de confirmación",
            message: `¿Estas seguro de eliminar a ${name}`,
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            try {
              this.deleteItembyId(artist_id);
              this.$q.notify({
                type: "positive",
                message: `${name} fue eliminado correctamente`,
              });
            } catch (err) {
              if (err.response.data.message) {
                $q.notify({
                  type: "negative",
                  message: err.response.data.message,
                });
              }
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    async changeQuantity(artist, cantHours, type) {
      this.item.artist_id = artist.id;

      if (type) {
        this.item.hours_artist = cantHours + 1;
        await this.updateItemShoppingCart(this.item);
      } else {
        this.item.hours_artist = cantHours - 1;
        await this.updateItemShoppingCart(this.item);
      }
    },
    mostrarModal() {
      this.mostrar = true;
    },
    cerrarModal() {
      this.mostrar = false;
    },
    async pay () {

      OpenPay.setId(this.$q.config.OpenPayID);
      OpenPay.setApiKey(this.$q.config.OpenPayKey);
      OpenPay.setSandboxMode(this.$q.config.OpenPaySanboxMode);

      var deviceDataId = OpenPay.deviceData.setup("formId");
      const cardData = this.stateCards.find(item => item.id === this.selectedCard);
      const dateCard = cardData.expiration_date.split("/");
      const card_numberArr = cardData.number_card.split(" - ");
      const card_number = card_numberArr[0] + card_numberArr[1] + card_numberArr[2] + card_numberArr[3];

      OpenPay.token.create({
        "card_number": card_number,
        "holder_name": this.client.name + " " + this.client.lastname,
        "expiration_year": dateCard[1],
        "expiration_month": dateCard[0],
        "cvv2":"110",
        "address":{
          "city": this.client.city,
          "postal_code": this.client.postal,
          "line1": this.client.address,
          "state": this.client.city_state,
          "country_code": "MX"
        }
      }, async (response) => {
        const data = {
          card_holder_name: this.client.name + " " + this.client.lastname,
          card_number: card_number,
          expiration_month: dateCard[0],
          expiration_year: dateCard[1],
          cvv2: 123,
          amount: this.stateListShopingCard[0].total,
          name: this.client.name,
          last_name: this.client.lastname,
          email: this.client.email,
          deviceSessionId: deviceDataId,
          token : response.data.id
        }

        try {
          await this.createPayment(data);
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
      
    }
  },
  computed: {
    ...mapGetters("shoppingCard", ["stateListShopingCard"]),
    ...mapGetters("card", ["stateCards"]),
    ...mapState({
      cards: (state) => state.card.cards,
    }),
  },
  created() {
    this.gettListShoppingCard();
    this.gettCards();
  },
  mounted() {
    $q = useQuasar();

  },
};
</script>

<style scoped>
.q-layout-main {
  flex: 1;
  max-width: 50%;
}

.q-layout-right {
  flex: 1;
  max-width: 50%;
}

@media screen and (max-width: 767px) {
  .q-layout-main,
  .q-layout-right {
    max-width: 100%;
  }
}
</style>

<style scoped>
  .title {
    margin-bottom: 30px;
    color: #162969;
  }
  .card {
    width: 320px;
    height: 190px;
    -webkit-perspective: 600px;
    -moz-perspective: 600px;
    perspective: 600px;
  }
  .card__part {
    box-shadow: 1px 1px #aaa3a3;
    top: 0;
    z-index: 1000;
    left: 0;
    display: inline-block;
    width: 320px;
    height: 190px;
    background-image: url("https://cdn.pixabay.com/photo/2017/11/15/09/28/music-player-2951399_960_720.jpg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 8px;
    -webkit-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -moz-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -ms-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -o-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
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
</style>
