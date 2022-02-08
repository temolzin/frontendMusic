<template>
  <h4>Login by redirecting...</h4>
</template>
<script>
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";
import { ref } from "vue";

let $q;
export default {
  name: "LoginForm",

  methods: {
    ...mapActions("auth", ["getMeUser"]),
    loginUser() {
      try {
        this.getMeUser().then((response) => {
          $q.notify({
            type: "positive",
            message: "Usuario encontrado",
          });

          //const toPath = this.$route.query.to || "/dashboard/home";
          this.$router.push({ name: "dashboardH" });
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
    this.loginUser();
  },
};
</script>
