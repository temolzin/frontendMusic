<template>
  <q-page>
    <h6 class="q-mb-md q-ml-lg q-mt-lg">
      Tus tarjetas
      <q-btn
        outline
        style="color: goldenrod"
        label="Agregar nueva tarjeta"
        icon-right="fas fa-plus"
        @click="formCreate = true"
      />
    </h6>
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
            <q-btn
              size="md"
              dense
              round
              color="green"
              icon="edit"
              class="card__front-logo card__logo q-mr-sm"
              @click="showFormEdit(card)"
            ></q-btn>
            <!-- Fin de boton editar -->

            <!-- Inicio de boton eliminar -->
            <q-btn
              size="md"
              dense
              round
              color="red"
              icon="delete"
              class="card__front-logo2 card__logo"
              @click="removeCard(card)"
            ></q-btn>
            <!-- Fin de boton eliminar -->

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
    <div
      v-else
      v-bind:class="{
        'justify-center': $q.screen.md || $q.screen.sm || $q.screen.xs,
      }"
    >
      <q-banner inline-actions rounded class="bg-positive text-white q-ma-md">
        <div class="q-ma-md">
          <p class="text-h6 q-mb-sm">Aún no tienes tarjetas guardadas 😥</p>
          <p class="q-mt-none">
            Guarda tus tarjetas de crédito o débito de forma 100% segura y confiable.
            Recuerda que no se te solicitará el CVV hasta que realices la contratación de un servicio.
          </p>
        </div>
      </q-banner>
    </div>
  </q-page>

  <!-- Inicio de Formulario nuevo usuario -->
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
            <q-form ref="formCreateCard" @submit="createCardNew" class="q-gutter-md col-6">
              <q-input
                dense
                v-model="form.name"
                autofocus
                label="Nombre completo del propietario"
                :rules="[
                  (val) => !!val || 'El campo nombre es requerido',
                  (val) => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                  (val) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(val) || 'El nombre solo puede contener letras y espacios'
                ]"
              />

              <q-input
                dense
                v-model="form.number_card"
                label="Numero de tarjeta"
                fill-mask
                mask="#### - #### - #### - ####"
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
                lazy-rules
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
  </section>
  <!-- Fin de Formulario nuevo usuario -->

  <!-- Inicio de Formulario nuevo usuario -->
  <section>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="formEdit" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">
              Editar tarjeta
              <q-icon name="fas fa-solid fa-credit-card"></q-icon>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form ref="formEditCard" @submit="editCard" class="q-gutter-md col-6">
              <q-input
                dense

                v-model="form.name"
                autofocus
                label="Nombre completo del propietario"
                :rules="[
                  (val) => !!val || 'El campo nombre es requerido',
                  (val) => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres'
                ]"
              />

              <q-input
                dense
                v-model="form.number_card"
                label="Numero de tarjeta"
                fill-mask
                mask="#### - #### - #### - ####"
                :rules="[
                  (val) => !!val || 'El campo número de tarjeta es requerido',
                  (val) => {
                    if (!val) return true;
                    const clean = val.replace(/[\s-]/g, '');
                    if (clean.length !== 16) return `Debe tener 16 dígitos. Actualmente tiene ${clean.length}`;
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
                lazy-rules
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
                <q-btn
                  flat
                  label="Cancelar"
                  v-close-popup
                  color="red"
                  @click="onReset"
                />
                <q-btn flat label="Editar" type="submit" color="primary" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </section>
  <!-- Fin de Formulario nuevo usuario -->
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";

let $q;
export default {
  data() {
    return {
      formCreate: false,
      formEdit: false,
      form: {
        id: "",
        name: "",
        number_card: "",
        expiration_date: "",
      },
    };
  },
  methods: {
    ...mapActions("card", ["getCards"]),
    ...mapActions("card", ["createCard"]),
    ...mapActions("card", ["deleteCard"]),
    ...mapActions("card", ["updateCard"]),
    
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
    
    async gettCards() {
      try {
        await this.getCards();
      } catch (err) {
        if (err.response?.data?.message) {
          this.$q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },

    async createCardNew() {
      const valid = await this.$refs.formCreateCard.validate();
      if (!valid) {
        this.$q.notify({
          type: "negative",
          message: "Por favor completa todos los campos correctamente",
        });
        return;
      }
      
      // Validación adicional del número de tarjeta
      const digits = (this.form.number_card.match(/\d/g) || []).length;
      if (digits !== 16) {
        this.$q.notify({
          type: "negative",
          message: `El número de tarjeta debe tener 16 dígitos. Actualmente tiene ${digits}`,
        });
        return;
      }
      
      const cardClean = this.form.number_card.replace(/[\s-]/g, '');
      if (!/^\d+$/.test(cardClean)) {
        this.$q.notify({
          type: "negative",
          message: "El número de tarjeta solo debe contener dígitos",
        });
        return;
      }
      
      if (!this.luhnCheck(cardClean)) {
        this.$q.notify({
          type: "negative",
          message: "El número de tarjeta no es válido (validación Luhn)",
        });
        return;
      }
      
      try {
        await this.createCard(this.form);
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
        }
      }
    },

    removeCard(card) {
      try {
        let id = card.id;
        let name = card.name;

        this.$q
          .dialog({
            title: "Mensaje de confirmación",
            message: `¿Estás seguro de eliminar el registro de la tarjeta de ${name}?`,
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            try {
              this.deleteCard(id);
              this.$q.notify({
                type: "positive",
                message: `La tarjeta de ${name} fue eliminada correctamente`,
              });
            } catch (err) {
              if (err.response?.data?.message) {
                this.$q.notify({
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

    showFormEdit(card) {
      this.formEdit = true;
      this.form.id = card.id;
      this.form.name = card.name;
      this.form.number_card = card.number_card;
      this.form.expiration_date = card.expiration_date;
    },

    async editCard() {
      const valid = await this.$refs.formEditCard.validate();
      if (!valid) {
        this.$q.notify({
          type: "negative",
          message: "Por favor completa todos los campos correctamente",
        });
        return;
      }
      
      const digits = (this.form.number_card.match(/\d/g) || []).length;
      if (digits !== 16) {
        this.$q.notify({
          type: "negative",
          message: `El número de tarjeta debe tener 16 dígitos. Actualmente tiene ${digits}`,
        });
        return;
      }
      
      const cardClean = this.form.number_card.replace(/[\s-]/g, '');
      if (!/^\d+$/.test(cardClean)) {
        this.$q.notify({
          type: "negative",
          message: "El número de tarjeta solo debe contener dígitos",
        });
        return;
      }
      
      if (!this.luhnCheck(cardClean)) {
        this.$q.notify({
          type: "negative",
          message: "El número de tarjeta no es válido (validación Luhn)",
        });
        return;
      }
      
      try {
        await this.updateCard(this.form);
        this.formEdit = false;
        this.$q.notify({
          type: "positive",
          message: `Tarjeta modificada correctamente`,
        });
        this.onReset();
        await this.gettCards();
      } catch (err) {
        if (err.response?.data?.message) {
          this.$q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },

    onReset() {
      this.form.id = "";
      this.form.name = "";
      this.form.number_card = "";
      this.form.expiration_date = "";
    },
  },
  created() {
    this.gettCards();
  },
  computed: {
    ...mapState({
      cards: (state) => state.card.cards,
    }),
  },
  mounted() {
    $q = useQuasar();
  },
};
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
  -webkit-perspective: 600px;
  -moz-perspective: 600px;
  perspective: 600px;
}

.card__part {
  box-shadow: 1px 1px #aaa3a3;
  top: 0;
  position: absolute;
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
