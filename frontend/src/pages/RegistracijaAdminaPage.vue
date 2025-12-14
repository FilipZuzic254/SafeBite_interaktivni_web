<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Registracija admina</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacRegistracija">
          <q-input filled v-model="ime" label="Ime" required />
          <q-input filled v-model="prezime" label="Prezime" required class="q-mt-sm" />
          <q-input filled v-model="korIme" label="Korisničko ime" required class="q-mt-sm" />
          <q-input filled v-model="lozinka" label="Lozinka" type="password" required class="q-mt-sm" />

          <div class="q-mt-md">
            <q-btn type="submit" label="Registracija" color="primary" :loading="loading" />
          </div>

          <!-- Poruke o grešci / uspjehu -->
          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
          <div v-if="success" class="text-positive q-mt-sm">{{ success }}</div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Reactive varijable
const ime = ref('')
const prezime = ref('')
const korIme = ref('')
const lozinka = ref('')

const loading = ref(false)
const error = ref(null)
const success = ref(null)

// Ref na formu
const ObrazacRegistracija = ref(null)

// Submit funkcija
const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    console.log({
      Ime_admina: ime.value,
      Prezime_admina: prezime.value,
      Korisnicko_ime: korIme.value,
      Lozinka_admina: lozinka.value,
    })

    await axios.post('http://localhost:3000/admin', {
      ime: ime.value,
      prezime: prezime.value,
      Ime_admina: korIme.value,
      Lozinka_admina: lozinka.value,
    })

    success.value = 'Admin uspješno registriran!'

    ObrazacRegistracija.value?.reset()
    ime.value = ''
    prezime.value = ''
    korIme.value = ''
    lozinka.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Došlo je do greške prilikom registracije'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
