<template>
  <q-dialog v-model="edit" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          Edit product "{{ stateProduct.product.name }}"
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <form class="q-gutter-md">
          <q-input
            dense
            v-model="editForm.name"
            autofocus
            label="Name product"
            :rules="[(val) => !!val || 'Field is required']"
          />
          <q-input
            dense
            v-model="editForm.price"
            label="Price product"
            :rules="[(val) => !!val || 'Field is required']"
          />
        </form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Submit"
          type="submit"
          v-on:click="upProduct"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <section>
    <div class="q-pa-md q-gutter-sm">
      <q-btn class="" label="Create" color="primary" @click="prompt = true" />
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Create new product</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <form class="q-gutter-md">
              <q-input
                dense
                v-model="form.name"
                autofocus
                label="Name product"
                :rules="[(val) => !!val || 'Field is required']"
              />
              <q-input
                dense
                v-model="form.price"
                label="Price product"
                :rules="[(val) => !!val || 'Field is required']"
              />
            </form>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              flat
              label="Submit"
              type="submit"
              v-on:click="createPro"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </section>

  <section>
    <div class="q-pa-lg">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">Id</th>
            <th class="text-left">Name</th>
            <th class="text-left">Price</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td class="text-left">{{ product.id }}</td>
            <td class="text-left">{{ product.name }}</td>
            <td class="text-left">{{ product.price }}</td>
            <td>
              <div class="q-pa-md q-gutter-sm">
                <q-btn
                  @click="showProduct(product.id)"
                  round
                  color="secondary"
                  icon="edit"
                />
                <q-btn
                  @click="removeProduct(product.id)"
                  round
                  color="deep-orange"
                  icon="warning"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </section>
</template>

<script>
import { useQuasar } from "quasar";
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      form: {
        name: "",
        price: "",
      },
      editForm: {
        id: "",
        name: "",
        price: "",
      },
      myJson: [],
      prompt: false,
      edit: false,
    };
  },
  created: function () {
    return this.getProductss();
  },
  computed: {
    ...mapGetters("product", ["stateProducts"]),
    ...mapGetters("product", ["stateProduct"]),
    products() {
      this.myJson = this.stateProducts;
      return this.myJson;
    },
  },
  methods: {
    ...mapActions("product", ["getProducts"]),
    ...mapActions("product", ["createProduct"]),
    ...mapActions("product", ["deleteProduct"]),
    ...mapActions("product", ["editProduct"]),
    ...mapActions("product", ["updateProduct"]),

    async getProductss() {
      try {
        await this.getProducts();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },

    async removeProduct(id) {
      try {
        this.$q
          .dialog({
            title: "Mensaje de confirmación",
            message: "¿Estas seguro de eliminar el registro?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            try {
              this.deleteProduct(id);
              this.$q.notify({
                type: "positive",
                message: `Producto eliminado correctamente`,
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

    async createPro() {
      await this.createProduct(this.form);
      this.clearForm();
      this.$q.notify({
        type: "positive",
        message: `Producto creado correctamente`,
      });
    },

    async showProduct(id) {
      try {
        await this.editProduct(id);
        this.editForm.id = this.stateProduct.product.id;
        this.editForm.name = this.stateProduct.product.name;
        this.editForm.price = this.stateProduct.product.price;
        this.edit = true;
      } catch (err) {
        if (err.response.data.error) {
          $q.notify({
            type: "negative",
            message: err.response.data.error,
          });
        }
      }
    },

    async upProduct() {
      try {
        let product = {
          id: this.editForm.id,
          form: this.editForm,
        };
        this.edit = true;
        await this.updateProduct(product);
        this.$q.notify({
          type: "positive",
          message:
            `Producto ` + this.editForm.name + ` actualizado correctamente`,
        });
      } catch (error) {
        console.error(error);
      }
    },

    clearForm() {
      this.form.name = "";
      this.form.price = "";
    },
  },
};
</script>
