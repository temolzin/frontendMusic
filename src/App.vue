<template>
  <router-view/>
</template>
<script>
import { defineComponent } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'App',
  beforeCreate () {
    this.$store.dispatch('auth/init')
    const token = localStorage.getItem("token");
    //const token = this.$store.getters.getToken
    //console.log(token)
    if (token) {
      api.defaults.headers.common.Authorization = 'Bearer ' + token.access_token
    } else {
      api.defaults.headers.common.Authorization = ''
    }
  },
  created () {
    this.$q.dark.set(false)
  }
})
</script>