<template>
  <q-page padding>
    <q-layout>
      <q-layout-main>
        <label><h5>Agregar Domicilio</h5></label>
        <q-card class="shadow-box">
          <q-card-section>
            <q-form @submit.prevent="onSubmit">
              <div class="form-group">
                <label for="nombre">Nombre</label>
                <q-input
                  v-model="cliente.nombre"
                  hint="Incluye tus apellidos"
                />
              </div>

              <div class="form-group">
                <label for="apellido">Apellido</label>
                <q-input
                  v-model="cliente.apellido"
                  hint="Incluye tus apellidos"
                />
              </div>

              <div class="form-group">
                <label for="postal">Código postal</label>
                <q-input v-model="cliente.postal" hint="Codigo postal" />
              </div>

              <div class="form-group">
                <label for="telefono">Teléfono</label>
                <q-input
                  v-model="cliente.telefono"
                  hint="Telefono de contacto"
                />
              </div>

              <div class="form-group">
                <label for="direccion">Dirección</label>
                <q-input v-model="cliente.direccion" hint="Direccion Actual" />
              </div>

              <div class="form-group">
                <label for="ciudad">Ciudad</label>
                <q-input v-model="cliente.ciudad" hint="Cuidad" />
              </div>

              <div class="form-group">
                <label for="estado">Estado</label>
                <q-input
                  v-model="cliente.estado"
                  hint="Estado de la republica"
                />
              </div>

              <div class="form-group">
                <q-btn label="Continuar" type="submit" color="blue"></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-layout-main>

      <!--- Mover el bloque q-layout-right aquí -->
      <q-layout-right >
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
      cliente: {
        nombre: "",
        correo: "",
        apellido: "",
        postal: "",
        calle: "",
        numero_exterior: "",
        numero_interior: "",
        referencia: "",
        colonia: "",
        municipio: "",
        destinatario: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        estado: "",
        pais: "",
      },
      metodosDePago: {
        tarjetaCredito: false,
        paypal: false,
      },
      // Agrega la variable step con el valor inicial deseado (por ejemplo, 1)
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
/* Estilos personalizados para el diseño */
.q-layout-main {
  flex: 1; /* Esto hará que ocupe la mitad del ancho en todas las pantallas */
  max-width: 50%; /* Limita el ancho máximo al 50% de la pantalla */
}

.q-layout-right {
  flex: 1; /* Esto hará que ocupe la otra mitad del ancho en todas las pantallas */
  max-width: 50%; /* Limita el ancho máximo al 50% de la pantalla */
}

/* Hacerlo responsive: En pantallas pequeñas, cambia a diseño de una columna */
@media screen and (max-width: 767px) {
  .q-layout-main,
  .q-layout-right {
    max-width: 100%; /* Ocupa el ancho completo en pantallas pequeñas */
  }
}
</style>
<style lang="sass" scoped>
.shadow-box
  margin: 25px
  border-radius: 20px
  font-size: 12px
</style>