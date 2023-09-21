<template>
  <q-page padding>
    <q-layout>
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
                <q-btn label="Continuar" type="submit" color="blue"></q-btn>
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
import { mapActions } from "vuex";
import { ref } from "vue";
import { mapGetters } from "vuex";

let $q;
export default {
  data() {
    return {
      showInfo: null,
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
  },
  computed: {
    ...mapGetters("shoppingCard", ["stateListShopingCard"]),
  },
  created() {
    this.gettListShoppingCard();
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

<style lang="sass" scoped>
.shadow-box
  margin: 25px
  border-radius: 20px
  font-size: 12px
</style>
