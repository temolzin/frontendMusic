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
          <q-form class="q-gutter-md q-px-lg q-py-lg q-px-xl" @submit.prevent="submitReset">
            <p class="text-center q-mb-lg text-weight-regular text-h3">Crear nueva contraseña</p>
            <p class="text-center q-mb-sm text-weight-light">
              Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
            </p>
            <q-input label="Correo electrónico" v-model="email" readonly />
            <q-input
              label="Nueva contraseña"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
            >
              <template #append>
                <q-btn
                  :icon="showPassword ? 'visibility_off' : 'visibility'"
                  flat
                  dense
                  round
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                />
              </template>
            </q-input>
            <q-input
              label="Confirmar contraseña"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              v-model="passwordConfirmation"
            >
              <template #append>
                <q-btn
                  :icon="showPasswordConfirmation ? 'visibility_off' : 'visibility'"
                  flat
                  dense
                  round
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                  :aria-label="showPasswordConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                />
              </template>
            </q-input>

            <div class="q-pt-lg">
              <q-btn :loading="loading" :disable="loading" class="full-width" color="primary" label="Guardar nueva contraseña" type="submit" />
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
