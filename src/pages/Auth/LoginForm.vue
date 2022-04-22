<template></template>
<script>
import { mapActions } from "vuex";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeUnmount } from "vue";

let $q;
export default {
  name: "LoginForm",

  setup() {
    const $q = useQuasar();
    let timer;

    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    return {
      showLoading() {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: "accent",
          spinnerSize: 140,
          backgroundColor: "primary",
          message: "Iniciando sesión...",
          messageColor: "white",
        });

        // hiding in 3s
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 3000);
      },
    };
  },

  methods: {
    ...mapActions("auth", ["getMeUser"]),
    loginUser() {
      try {
        this.getMeUser()
          .then(() => {
            $q.notify({
              type: "positive",
              message: "Usuario encontrado",
            });
            //const toPath = this.$route.query.to || "/dashboard/home";
            this.$router.push({ name: "dashboardH" });
          })
          .catch(() => {
            $q.notify({
              type: "negative",
              message: "Error inesperado por parte del servidor",
            });
            this.$router.push({ name: "LoginIn" });
          });
      } catch (err) {
        console.log("error");
      }
    },
  },
  // computed: {
  //   ...mapGetters("auth", ["getToken"]),
  // },
  created() {
    $q = useQuasar();
    this.showLoading();
    this.loginUser();
  },
};
</script>
