<template>
  <div class="col-12 col-md-6 flex content-center justify-center" :class="mode ? 'bg-modedark' : 'bg-primary'" v-bind:style="{ height: '60em' }">
    <q-card class="my-card shadow-box shadow-2" :class="`shadow-10`" flat v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '60%' }">
      <q-card-section horizontal>
        <q-card-section class="col-12 col-sm-12 col-md-12" v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '100%' }">
          <p class="text-center q-mb-lg text-weight-regular text-h3">Recuperar Contraseña</p>

          <q-form class="q-gutter-md q-px-lg q-py-lg q-px-xl" @submit.prevent="submitRecover">
            <q-input label="Correo electrónico" v-model="email" />

            <div class="q-pt-lg">
              <q-btn :loading="loading" :disable="loading" class="full-width" color="primary" label="Enviar enlace" type="submit" />
              <q-btn class="full-width q-mt-md" outline color="primary" label="Volver" @click="$router.push('/login')" />
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
