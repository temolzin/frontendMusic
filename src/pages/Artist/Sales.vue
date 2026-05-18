<template>
  <q-page>
    <q-card>
      <q-card-section>

        <q-markup-table dense flat bordered class="table-responsive">
            <thead>
              <tr class="bg-primary">
                <th class="">
                  <div class="row no-wrap items-center">
                    <div class="q-ml-md text-white"></div>
                    <div class="artist-name-2" style="font-size: 32px">
                      Mis Ventas
                    </div>
                  </div>
                </th>

                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <!-- Contenido de la primera tabla aquí -->
            <tbody>
              <tr
                v-for="(sale, index) in stateArtistSales"
                :key="index"
              >

                <td class="text-left">
                  <span class="artist-name">ID de la Transacción:</span>
                  <p class="artist-zone">{{ sale.openpay_transaction_id }}</p>
                </td>
                <td>
                  <q-btn
                    flat
                    round
                    @click=""
                    label="Estado"
                    color="primary"
                  />
                </td>

                <td class="text-left">
                  
                  5 hora(s)
                  
                </td>
                <td class="text-left">
                  {{"$ " +sale.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
          <notice-not-info v-if="artist == null"></notice-not-info>
          <notice-no-sales v-if="artist != null && (!stateArtistSales || stateArtistSales.length === 0)"></notice-no-sales>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import { useQuasar } from "quasar";
import { mapState } from "vuex";
import NoticeNoSales from "src/components/Artist/NoticeNoSales.vue";
import NoticeNotInfo from "src/components/Artist/NoticeNotInfo.vue";
let $q;

export default {
  
  components: {
    NoticeNoSales, NoticeNotInfo
  },

  data() {
    return {
    };
  },
  methods: {
    ...mapActions("artistSales", ["getArtistSales"]),
    ...mapActions("artist", ["getArtist"]),
    async getArtistSaless() {
      try {
        await this.getArtist();
        if (this.artist != null) { 
          await this.getArtistSales();
        }
        console.log(this.stateArtistSales)
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    getSales() {
      return this.stateArtistSales;
    }
  },
  computed: {
    ...mapGetters("artistSales", ["stateArtistSales"]),
    ...mapState({
      artist: (state) => state.artist.artist,
    }),
  },
  created: function () {
    return this.getArtistSaless();
  },
  mounted() {
    $q = useQuasar();
  }
};
</script>
