<template>
    <q-select
        rounded
        outlined
        v-model="searchBar"
        use-input
        input-debounce="0"
        label="Buscar por artista o genero musical"
        :options="options"
        @filter="filterFn" 
        style="width: 26vw; margin-right: 1.5vw;"
        behavior="menu"
        option-label="name"
        option-value="url"
        hide-dropdown-icon
        :loading="loading"
        @virtual-scroll="onScroll"
    >
        <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" @click="redirectToRoute(scope.opt.url)">
            <q-item-section>
            <q-item-label>{{ scope.opt.name }}</q-item-label>
            </q-item-section>
        </q-item>
        </template>
        <template v-slot:append>
        <q-icon name="search"/>
        </template>
        <template v-slot:no-option>
        <q-item>
            <q-item-section class="text-grey">
            No se encontró la busqueda
            </q-item-section>
        </q-item>
        </template>
        
    </q-select>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { mapGetters, mapActions } from "vuex";

let $q;
export default {
  name: "Search-Bar",
  setup() {
    return {
      isActiveDarkMode: ref(false),
      options: ref(),
      allOptions: [],
    };
  },
  computed: {
    ...mapGetters("artistList", ["stateArtistList"]),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
  created() {
    this.getArtistss();
    this.isActiveDarkMode = this.mode;
  },
  methods: {
    ...mapActions("artistList", ["getArtists"]),
    async getArtistss() {
      try {
        await this.getArtists();
      } catch (err) {
        if (err.response.data.message) {
          $q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        }
      }
    },
    redirectToRoute(value) {
      this.$router.push(value);      
    },
    removeDuplicates(arr) {
      const uniqueArray = arr.filter((obj, index, self) =>
        index === self.findIndex((o) => o.name === obj.name)
      );
      return uniqueArray;
    },
    getMusicalGendersAndArtist() {
      let genres = [];
      let artists = [];
      
      this.stateArtistList.forEach(artist => {
        artist.musical_genders.forEach(genre => {
          const obj = {name : genre.name, url: `/client/musical-genders/${genre.slug}`};
          genres.push(obj);
        });
      });

      this.stateArtistList.forEach(artist => {
        const obj = {name : artist.name, url: `/client/musical-genders/${artist.musical_genders[0].name}/${artist.slug}`};
        artists.push(obj);
      });

      this.allOptions = this.removeDuplicates([...genres, ...artists]);
    },
    filterFn (val, update, abort) {
      this.getMusicalGendersAndArtist();
      if (val.length < 1) {
        abort()
        return
      } 
      
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.allOptions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
  },
  mounted() {
    $q = useQuasar();
  },
};
</script>
