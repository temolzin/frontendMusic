<template>
  <q-page>
    <div class="q-pa-md q-pb-none">
      <PageBreadcrumbs :items="[{ label: 'Mis Tarjetas', icon: 'fas fa-solid fa-credit-card' }]" />
    </div>
    <h6 class="q-mb-md q-ml-lg q-mt-lg row items-center">
      <span class="q-mr-md">Tus tarjetas</span>
      <q-btn
        unelevated
        color="primary"
        style="border-radius: 8px;"
        label="AGREGAR NUEVA TARJETA"
        icon="fas fa-plus"
        @click="formCreate = true"
      />
    </h6>
    <div class="row justify-center q-gutter-lg q-ma-sm" v-if="cards != 0">
      <div v-for="(card, index) in cards" :key="index" class="col-auto">
        <div class="card-wrapper">
          <div class="card">
            <div class="card__front card__part">
              <img
                class="card__square"
                src="https://raw.githubusercontent.com/muhammed/interactive-card/refs/heads/main/src/assets/images/chip.png"
              />
              <i :class="cardBrandInfo(card).icon" class="card__brand-icon"></i>
              <p class="card_numer">{{ maskCardNumber(card.number_card) }}</p>
              <div class="card__space-75">
                <span class="card__label">Nombre</span>
                <p class="card__info">{{ card.name }}</p>
              </div>
              <div class="card__space-25">
                <span class="card__label">Expires</span>
                <p class="card__info">{{ card.expiration_date }}</p>
              </div>
            </div>
          </div>
          <div class="card__actions">
            <q-btn size="sm" dense round outline color="green" icon="edit" @click="showFormEdit(card)" />
            <q-btn size="sm" dense round outline color="red" icon="delete" @click="removeCard(card)" />
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
                :rules="[
                  (val) => !!val || 'El campo número de tarjeta es requerido',
                  (val) => {
                    if (!val) return true;
                    const digits = (val.match(/\d/g) || []).length;
                    const expLen = this.expectedCardLength(val);
                    if (digits < 15) return 'Debe tener al menos 15 dígitos';
                    if (digits !== expLen) return `Debe tener ${expLen} dígitos. Actualmente tiene ${digits}`;
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
                :rules="[
                  (val) => !!val || 'El campo número de tarjeta es requerido',
                  (val) => {
                    if (!val) return true;
                    const digits = (val.match(/\d/g) || []).length;
                    const expLen = this.expectedCardLength(val);
                    if (digits < 15) return 'Debe tener al menos 15 dígitos';
                    if (digits !== expLen) return `Debe tener ${expLen} dígitos. Actualmente tiene ${digits}`;
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
import PageBreadcrumbs from "src/components/PageBreadcrumbs.vue";
import { useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import { notifySuccess, notifyError } from "src/utils/notify";

let $q;
export default {
  components: { PageBreadcrumbs },
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
    expectedCardLength(number) {
      const clean = number.replace(/[\s-]/g, '');
      return /^3[47]/.test(clean) ? 15 : 16;
    },

    maskCardNumber(cardNumber) {
      const clean = cardNumber.replace(/\D/g, '');
      const last4 = clean.slice(-4);
      const masked = clean.slice(0, -4).replace(/\d/g, 'x');
      const formatted = [];
      for (let i = 0; i < masked.length; i += 4) {
        formatted.push(masked.slice(i, i + 4));
      }
      formatted.push(last4);
      return formatted.join('-');
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
          notifyError(err.response.data.message);
        }
      }
    },

    async createCardNew() {
      const valid = await this.$refs.formCreateCard.validate();
      if (!valid) {
        notifyError("Por favor completa todos los campos correctamente");
        return;
      }
      
      // Validación adicional del número de tarjeta
      const digits = (this.form.number_card.match(/\d/g) || []).length;
      const expLen = this.expectedCardLength(this.form.number_card);
      if (digits !== expLen) {
        notifyError(`El número de tarjeta debe tener ${expLen} dígitos. Actualmente tiene ${digits}`);
        return;
      }
      
      const cardClean = this.form.number_card.replace(/[\s-]/g, '');
      if (!/^\d+$/.test(cardClean)) {
        notifyError("El número de tarjeta solo debe contener dígitos");
        return;
      }
      
      if (!this.luhnCheck(cardClean)) {
        notifyError("El número de tarjeta no es válido (validación Luhn)");
        return;
      }
      
      try {
        await this.createCard(this.form);
        this.formCreate = false;
        this.onReset();
        notifySuccess(`Tarjeta creada correctamente`);
        await this.gettCards();
      } catch (err) {
        if (err.response?.data?.message) {
          notifyError(err.response.data.message);
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
              notifySuccess(`La tarjeta de ${name} fue eliminada correctamente`);
            } catch (err) {
              if (err.response?.data?.message) {
                notifyError(err.response.data.message);
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
        notifyError("Por favor completa todos los campos correctamente");
        return;
      }
      
      const digits = (this.form.number_card.match(/\d/g) || []).length;
      const expLen = this.expectedCardLength(this.form.number_card);
      if (digits !== expLen) {
        notifyError(`El número de tarjeta debe tener ${expLen} dígitos. Actualmente tiene ${digits}`);
        return;
      }
      
      const cardClean = this.form.number_card.replace(/[\s-]/g, '');
      if (!/^\d+$/.test(cardClean)) {
        notifyError("El número de tarjeta solo debe contener dígitos");
        return;
      }
      
      if (!this.luhnCheck(cardClean)) {
        notifyError("El número de tarjeta no es válido (validación Luhn)");
        return;
      }
      
      try {
        await this.updateCard(this.form);
        this.formEdit = false;
        notifySuccess(`Tarjeta modificada correctamente`);
        this.onReset();
        await this.gettCards();
      } catch (err) {
        if (err.response?.data?.message) {
          notifyError(err.response.data.message);
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
  position: relative;
  max-width: 100%;
}

.card__part {
  box-shadow: 1px 1px #aaa3a3;
  top: 0;
  position: absolute;
  z-index: 1000;
  left: 0;
  display: inline-block;
  width: 100%;
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

.card__brand-icon {
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 32px;
  color: #ffffff;
  z-index: 10;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.card__square {
  image-rendering: crisp-edges;
  height: 30px;
}

.card_numer {
  display: block;
  width: 100%;
  word-spacing: 0px;
  font-size: 19px;
  letter-spacing: 2px;
  color: #fff;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 25px;
  white-space: nowrap;
}

.card__space-75 {
  width: 75%;
  float: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__space-25 {
  width: 25%;
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
  white-space: nowrap;
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
