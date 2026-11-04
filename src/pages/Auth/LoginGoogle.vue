<template></template>
<script>
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";

import { QSpinnerFacebook } from "quasar";
import { onBeforeUnmount } from "vue";
import { notifySuccess, notifyError } from "src/utils/notify";

let $q;
export default {
  name: "LoginGoogle",

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
          message: "Redirigiendo...",
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
    ...mapActions("auth", ["doLoginGmailCallback"]),
    loginUser() {
      try {
        this.doLoginGmailCallback({
          code: this.$route.query.code,
        })
          .then(() => {
            notifySuccess(this.getToken.acction);
            this.$router.push({ name: "dashboardH" });
          })
          .catch((err) => {
            notifyError(err.message);
            const toPath = this.$route.query.to || "/login";
            this.$router.push(toPath);
          });
      } catch (err) {
        //console.log("error");
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  created() {
    $q = useQuasar();
    this.loginUser();
    this.showLoading();
  },
};
</script>
