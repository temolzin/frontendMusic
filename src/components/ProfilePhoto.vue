<template>
    <q-btn-dropdown class="q-ml-sm" round outline flat>
        <template v-slot:label>
            <div class="row items-center no-wrap">
            <q-avatar size="40px">
                <img :src="getBackendImageUrl(getMe.image)" />
            </q-avatar>
            </div>
        </template>
        <div class="row no-wrap q-ma-md">
            <div class="column items-center">
            <q-avatar size="82px">
                <img :src="getBackendImageUrl(getMe.image)" class="" />
            </q-avatar>
            <div class="text-subtitle1 q-mt-md q-mb-xs">
                {{ getMe.name }}
            </div>
            <b style="text-transform: capitalize">{{ getMe.role[0] }}</b>
            <small class="q-mt-sm">{{ getMe.email }}</small>

            <div class="row q-mt-md q-ma-sm">
                <q-btn
                outline
                color="indigo col-5"
                label="Editar perfil"
                push
                size="sm"
                v-close-popup
                to="/dashboard/user/profile"
                v-if="$can('edit-profile')"
                />
                <div class="col-2"></div>
                <q-btn
                outline
                color="red col-5"
                label="Cerrar Sesión"
                push
                size="sm"
                v-close-popup
                @click="logout"
                />
            </div>
        </div>
        </div>
    </q-btn-dropdown>
</template>


<script>
import { getMe } from "src/store/auth/getters";
import { ref } from "vue";
import { mapGetters } from "vuex";

export default {
  name: "ProfilePhoto",
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      isActiveDarkMode: ref(false),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      text: ref(""),
      mobileData: ref(false),
      bluetooth: ref(false),
      numberShopping: 0,
    };
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    mode: function () {
      return this.$q.dark.isActive;
    },
  },
  created() {
    this.isActiveDarkMode = this.mode;
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/signOut");
      const toPath = this.$route.query.to || "/";
      this.$router.push(toPath);
    },
    darkMode(val) {
      this.$q.dark.set(val);
    },
    redirect() {
      const toPath = this.$route.query.to || "/";
      this.$router.push(toPath);
    },
    getImageUrl(image) {
      if (image) {
        return `/user_profile_images/${image}`;
      }
    },
    getBackendImageUrl(image) {
      if (image) {
        const rutaCompleta = image;
        const partes = rutaCompleta.split("/");
        const nombreImagen = partes[partes.length - 1];
        return `http://127.0.0.1:8000/storage/user_profile/${nombreImagen}`;
      }
    }
  }
}
</script>
