<template>
  <div class="col-12 col-md-6 flex content-center justify-center" :class="mode ? 'bg-modedark' : 'bg-primary'" v-bind:style="{ height: '60em' }">
    <q-card class="my-card shadow-box shadow-2" :class="`shadow-10`" flat v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '60%' }">
      <q-card-section horizontal>
        <q-card-section class="col-12 col-sm-12 col-md-12" v-bind:style="$q.screen.lt.sm ? { width: '100%' } : { width: '100%' }">
          <p class="text-center q-mb-lg text-weight-regular text-h3">Crear nueva contraseña</p>

          <q-form class="q-gutter-md q-px-lg q-py-lg q-px-xl" @submit.prevent="submitReset">
            <q-input label="Correo electrónico" v-model="email" readonly />
            <q-input
              label="Nueva contraseña"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
            <q-input
              label="Confirmar contraseña"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              v-model="passwordConfirmation"
            >
              <template #append>
                <q-icon
                  :name="showPasswordConfirmation ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                />
              </template>
            </q-input>

            <div class="q-pt-lg">
              <q-btn :loading="loading" :disable="loading" class="full-width" color="primary" label="Guardar nueva contraseña" type="submit" />
              <q-btn class="full-width q-mt-md" outline color="primary" label="Volver" @click="$router.push('/login')" />
            </div>
          </q-form>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ResetPassword',
  setup () {
    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const email = ref('')
    const token = ref('')
    const password = ref('')
    const passwordConfirmation = ref('')
    const showPassword = ref(false)
    const showPasswordConfirmation = ref(false)
    const loading = ref(false)

    const mode = computed(() => $q.dark.isActive)

    const readToken = () => {
      token.value = route.query.token ? String(route.query.token) : ''
    }

    const readEmail = () => {
      email.value = route.query.email ? String(route.query.email) : email.value
    }

    onMounted(() => {
      readToken()
      readEmail()
    })

    watch(() => route.query.token, () => {
      readToken()
    })

    watch(() => route.query.email, () => {
      readEmail()
    })

    const notifyError = (message) => {
      $q.notify({ type: 'negative', message })
    }

    const notifySuccess = (message) => {
      $q.notify({ type: 'positive', message })
    }

    const submitReset = async () => {
      if (!token.value || !email.value || !password.value || !passwordConfirmation.value) {
        notifyError('Abre el enlace del correo para cargar el token y el correo.')
        return
      }

      if (password.value !== passwordConfirmation.value) {
        notifyError('Las contraseñas no coinciden.')
        return
      }

      loading.value = true
      try {
        const payload = {
          token: token.value,
          email: email.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value
        }
        const res = await store.dispatch('auth/resetPassword', payload)
        notifySuccess(res.message || 'Contraseña actualizada correctamente.')
        router.push('/login')
      } catch (err) {
        console.error('resetPassword error:', err)
        let msg = 'Error al restablecer la contraseña.'
        if (err && err.response && err.response.data) {
          const data = err.response.data
          msg = data.message || data.error || (data.errors && data.errors.password && data.errors.password[0]) || JSON.stringify(data)
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
      token,
      password,
      passwordConfirmation,
      showPassword,
      showPasswordConfirmation,
      loading,
      mode,
      submitReset
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
