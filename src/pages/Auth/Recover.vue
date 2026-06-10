<template>
  <div class="col-12 col-md-6 flex content-center justify-center" :class="mode ? 'bg-modedark' : 'bg-primary'" v-bind:style="{ height: '60em' }">
    <q-card class="my-card shadow-box shadow-2" :class="`shadow-10`" flat v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '60%' }">
      <q-card-section horizontal>
        <q-img
          class="col-5 col-sm-1 col-md-5"
          src="https://cdn.pixabay.com/photo/2019/12/18/04/11/dj-4702977_960_720.jpg"
          v-bind:style="$q.screen.lt.sm ? { width: '0%' } : { width: '40%' }"
        />

        <q-card-section class="col-7 col-sm-12 col-md-7" v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '60%' }">
          <div class="row">
            <div class="col-6 text-left q-px-md" style="font-size: 2em">
              <q-btn round flat icon="fas fa-arrow-left" to="/login" />
            </div>
            <div class="col-6 text-right q-px-md" style="font-size: 2em">
              <img
                :src="$q.dark.isActive ? '/vibeerlogowithouttext.png' : '/viberlogowithouttext-black.png'"
                @click="$router.push('/')"
                style="height: 64px; cursor: pointer; vertical-align: middle;"
              />
            </div>
          </div>

          <q-form class="q-gutter-md q-px-lg q-py-lg q-px-xl" @submit.prevent="submitRecover">
            <p class="text-center q-mb-lg text-weight-regular text-h3">Recuperar Contraseña</p>
            <p class="text-center q-mb-sm text-weight-light">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <q-input label="Correo electrónico" v-model="email" />

            <div class="q-pt-lg">
              <q-btn :loading="loading" :disable="loading" class="full-width" color="primary" label="Enviar enlace" type="submit" />
            </div>

            <div class="q-mt-md q-mb-lg text-center">
              ¿Recordaste tu contraseña?
              <router-link class="text-primary" to="/login">Inicia sesión</router-link>
            </div>
          </q-form>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Recover',
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const store = useStore()

    const email = ref('')
    const loading = ref(false)

    const mode = computed(() => $q.dark.isActive)

    const notifyError = (message) => {
      $q.notify({ type: 'negative', message })
    }

    const notifySuccess = (message) => {
      $q.notify({ type: 'positive', message })
    }

    const submitRecover = async () => {
      if (!email.value) {
        notifyError('Introduce tu correo electrónico.')
        return
      }

      loading.value = true
      try {
        const res = await store.dispatch('auth/recoverPassword', { email: email.value })
        if (res && res.reset_url) {
          notifySuccess(res.message || 'Se generó el enlace de recuperación.')
          const targetUrl = new URL(res.reset_url, window.location.origin)
          targetUrl.searchParams.set('email', email.value)
          window.location.href = targetUrl.toString()
          return
        }

        notifySuccess(res.message || 'Se generó el enlace de recuperación.')
        router.push('/login')
      } catch (err) {
        console.error('recoverPassword error:', err)
        let msg = 'Error al enviar el correo.'
        if (err && err.response && err.response.data) {
          const data = err.response.data
          msg = data.message || data.error || (data.errors && data.errors.email && data.errors.email[0]) || JSON.stringify(data)
        } else if (err && err.message) {
          msg = err.message
        }
        notifyError(msg)
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      mode,
      submitRecover
    }
  }
})
</script>

<style lang="sass" scoped>
.shadow-box
  margin: 25px
  border-radius: 20px
  font-size: 12px
</style>
