<template>
  <h4>Login with Gmail...</h4>
</template>
<script>
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from "vuex";
import { ref } from "vue";

let $q;
export default {
  name: "LoginGoogle",

  methods: {
    ...mapActions("auth", ["doLoginGmailCallback"]),
    loginUser() {
      try {
        this.doLoginGmailCallback({
          code: this.$route.query.code,
        }).then((response) => {
          $q.notify({
            type: "positive",
            message: this.getToken.acction,
          });

          const toPath = this.$route.query.to || "/dashboard/home";
          this.$router.push(toPath);
        });
      } catch (err) {
        console.log("error");
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  created() {
    $q = useQuasar();
    this.loginUser();
  },
};
</script>
