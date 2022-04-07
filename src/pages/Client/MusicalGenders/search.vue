<template>
  <q-page>
    <div class="q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el
          to="/dashboard/home"
          label="Inico"
          class="text-weight-bold text-h6 uppercase"
          :class="mode ? 'text-grey-5' : 'text-dark'"
        />
        <q-breadcrumbs-el
          to="/client/musical-genders"
          label="Generos Musicales"
          class="text-weight-bold text-h6 uppercase"
          :class="mode ? 'text-grey-5' : 'text-dark'"
        />
        <q-breadcrumbs-el
          :label="slug"
          class="text-weight-bold text-h6 uppercase"
          :class="mode ? 'text-grey-5' : 'text-dark'"
        />
      </q-breadcrumbs>
    </div>
    <div v-if="clientMusicalGenders[0]">
      <!-- Inicio de Parallax de nobre del grupo y descripción -->
      <q-parallax :height="250" :speed="0.5" v-if="skeleton == false">
        <template v-slot:media>
          <img
            src="https://cdn.pixabay.com/photo/2017/03/09/20/53/microphone-2130806_960_720.jpg"
          />
        </template>

        <template v-slot:content="scope">
          <div
            class="absolute column items-center"
            :style="{
              opacity: 0.45 + (1 - scope.percentScrolled) * 0.75,
              top: scope.percentScrolled * 50 + '%',
              left: 0,
              right: 0,
            }"
          >
            <div class="text-h3 text-white text-center q-mb-sm uppercase">
              {{ clientMusicalGenders[0].name }}
            </div>
            <div class="text-white text-center">
              {{ clientMusicalGenders[0].description }}
            </div>
          </div>
        </template>
      </q-parallax>
      <!-- Fin de Parallax de nobre del grupo y descripción -->
      <!-- Inico de carga de Parallax -->
      <div class="q-gutter-y-md" v-if="skeleton == true">
        <q-skeleton height="150px" />
      </div>
      <!-- Fin de carga de Parallax -->
      <q-table
        grid
        card-class="bg-primary text-white"
        :rows="clientMusicalGenders[0].artists"
        :columns="columns"
        row-key="name"
        :filter="filter"
        hide-header
        no-data-label="Sin registros"
        no-results-label="Ningún registro coincidente"
      >
        <template v-slot:top-left>
          <h5
            class="q-ma-none q-mt-md"
            :class="mode ? 'text-grey-5' : 'text-modedark text-weight-medium'"
            v-if="skeleton == false"
          >
            Resultados relacionados a {{ clientMusicalGenders[0].name }}
          </h5>
          <q-skeleton width="400px" v-if="skeleton == true" />
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar por nombre... "
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-skeleton
              class="q-ma-sm"
              height="350px"
              v-if="skeleton == true"
            />
            <q-card class="my-card q-ma-sm" v-if="skeleton == false">
              <q-img :src="props.row.image" class="imageArtist" />

              <q-card-section>
                <q-btn
                  fab
                  color="primary"
                  icon="fas fa-solid fa-cart-plus"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%)"
                  v-on:click="addCart(props.row)"
                />

                <div class="row no-wrap items-center">
                  <div
                    class="col text-h6 ellipsis search text-weight-regular"
                    @click="search(props.row.slug)"
                  >
                    {{ props.row.name }}
                  </div>

                  <div
                    class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
                  >
                    <q-icon name="map" />
                    <small>{{ props.row.zone }}</small>
                  </div>
                </div>

                <q-rating
                  v-model="starts"
                  :max="5"
                  size="32px"
                  no-dimming
                  readonly
                />
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  <span class="text-h5 text-primary text-weight-bold">
                    ${{ props.row.price_hour }}.00
                  </span>
                  <small> pesos por hora</small>
                </div>
                <div class="text-caption text-grey ellipsis">
                  {{ props.row.history }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat round color="red" icon="favorite" />
                <q-btn flat round color="primary" icon="share" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
    <!-- Inicio de sin registros -->
    <div v-if="clientMusicalGenders[0] == null">
      <div class="q-pa-md">
        <q-card class="my-card">
          <q-parallax
            src="https://cdn.quasar.dev/img/parallax1.jpg"
            :height="150"
          />

          <q-card-section>
            <div class="text-h6">Sin resultados</div>
            <div class="text-subtitle2">
              Al parecer no existe el género con el slug: {{ slug }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- Fin de sin registros -->

    <q-card class="my-card q-mb-xl">
      <q-card-section>
        <div class="text-h6 q-mb-xs">
          Tu carrito de compras
          <q-btn dense round flat icon="shopping_cart">
            <q-badge color="red" floating transparent>
              {{ listCarrito.length }}
            </q-badge>
          </q-btn>
        </div>
        <div class="row no-wrap items-center">
          <!-- <q-rating size="18px" v-model="stars" :max="5" color="primary" /> -->
          <!-- <span class="text-caption text-grey q-ml-sm">4.2 (551)</span> -->
        </div>
      </q-card-section>

      <q-list>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Nombre</th>
              <th class="text-left">Precio</th>
              <th class="text-left">Cantidad hr</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in listCarrito" :key="index">
              <td class="text-left">{{ product.name }}</td>
              <td class="text-left">{{ product.price_hour }}</td>
              <td class="text-left">
                <q-btn
                  flat
                  round
                  icon="remove_circle_outline"
                  v-on:click="changeQuantity(index, false)"
                />
                {{ product.cant }} hora(s)
                <q-btn
                  flat
                  round
                  icon="add_circle_outline"
                  v-on:click="changeQuantity(index, true)"
                />
              </td>
              <td>
                <q-btn
                  flat
                  round
                  icon="delete"
                  v-on:click="deleteItem(index)"
                />
              </td>
            </tr>
            <tr class="bg-grey-9">
              <td class="text-left">Total (Pesos)</td>
              <td class="text-left" colspan="3">
                <strong class="text-center">$ {{ onViewTotal() }} pesos</strong>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <q-btn
                  label="Procesar Pedido"
                  color="modedark"
                  class="float-right"
                  v-on:click="onSendOrder()"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-list>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import { ref } from "vue";

let $q;
export default {
  name: "SearchBySlug",

  data() {
    const columns = [{ name: "name", field: "name", sortable: true }];
    return {
      filter: ref(""),
      columns,
      slug: null,
      skeleton: true,
      showResult: null,
      starts: 4,
      listCarrito: [],
    };
  },
  methods: {
    ...mapActions("clientMusicalGenders", ["getMusicalGendersBySlug"]),
    ...mapActions("shoppingCard", ["create_order"]),
    async gettMusicalGendersBySlug() {
      try {
        await this.getMusicalGendersBySlug(this.slug).then(() => {
          this.skeleton = false;
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
    search(slug) {
      this.$router.push({
        name: "client.view-group-by-gender-slug",
        params: {
          slugMG: this.slug,
          slugA: slug,
        },
      });
    },

    addCart(item) {
      let change = false;
      this.listCarrito.forEach(function (valor, indice) {
        if (valor.id == item.id) {
          valor.cant = valor.cant + 1;
          change = true;
        }
      });

      if (change != true) {
        const itemcar = {
          id: item.id,
          name: item.name,
          slug: item.slug,
          cant: 1,
          price_hour: item.price_hour,
          zone: item.zone,
          image: item.image,
        };
        this.listCarrito.push(itemcar);
      }

      //alert(JSON.stringify(item));
    },
    deleteItem(i) {
      this.listCarrito.splice(i, 1);
    },
    changeQuantity(i, type) {
      // sacar variable de carrito
      const dataCar = this.listCarrito;

      // sacar la cantidad de producto
      let cantd = dataCar[i].cant;

      if (type) {
        cantd = cantd + 1;
      } else if (type == false && cantd >= 1) {
        cantd = cantd - 1;
      }

      if ((type == false && cantd >= 1) || type) {
        dataCar[i].cant = cantd;
        this.listCarrito;
      }
    },
    onViewTotal() {
      let total = 0;
      this.listCarrito.map((data) => {
        total = total + parseFloat(data.cant) * parseFloat(data.price_hour);
      });
      return total;
    },
    onSendOrder() {
      if (this.listCarrito.length >= 1) {
        // sumar todal de los productos
        let total = 0;
        this.listCarrito.map((data) => {
          total = total + data.cant * data.price_hour;
        });

        const formData = new FormData();
        formData.append("services", JSON.stringify(this.listCarrito));
        formData.append("order_date_start", this.printDateStart());
        formData.append("order_date_finish", this.printDateFinish());
        formData.append("total", total);
        this.create_order(formData).then(() => {
          alert("Enviado");
        });
      }
    },
    printDateStart: function () {
      return new Date().toLocaleString();
    },
    printDateFinish: function () {
      var d = new Date();
      return this.sumarDias(d, 2);
    },
    sumarDias(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return fecha.toLocaleString();
    },
  },
  created() {
    this.slug = this.$route.params.slug;
    this.gettMusicalGendersBySlug();
  },
  computed: {
    ...mapState({
      clientMusicalGenders: (state) =>
        state.clientMusicalGenders.artistsGenders,
    }),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>
<style lang="css" scoped>
.imageArtist {
  max-height: 200px;
  min-height: 200px;
  object-fit: cover;
}
.search {
  cursor: pointer;
}
.search:hover {
  color: #ff78a5;
}
.uppercase {
  text-transform: uppercase;
}
</style>
