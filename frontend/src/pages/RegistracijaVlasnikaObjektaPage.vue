<!-- Filip Žužić -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Registracija vlasnika objekata</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacRegistracija">
          <q-input filled v-model="ime" label="Ime" required />
          <q-input filled v-model="prezime" label="Prezime" required class="q-mt-sm" />
          <q-input filled v-model="email" label="Email" type="email" required class="q-mt-sm" />
          <q-input filled v-model="lozinka" label="Lozinka" type="password" required class="q-mt-sm" />

          <div class="q-mt-md">
            <q-btn type="submit" label="Registracija" color="primary" rounded :loading="loading" />
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
const email = ref('')
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
      Ime_vlasnika: ime.value,
      Lozinka_vlasnika: lozinka.value,
      Prezime_vlasnika: prezime.value,
      Email_vlasnika: email.value,
    })

    await axios.post('http://localhost:3000/vlasnik', {
      Ime_vlasnika: ime.value,
      Lozinka_vlasnika: lozinka.value,
      Prezime_vlasnika: prezime.value,
      Email_vlasnika: email.value,
    })

    // Ako je registracija uspješna
    success.value = 'Vlasnik uspješno registriran!'

    // Reset forme
    ObrazacRegistracija.value?.reset()

    // Ručno reset polja
    ime.value = ''
    prezime.value = ''
    email.value = ''
    lozinka.value = ''
  } catch (err) {
    if (err.response) {
      error.value = err.response.data.message || 'Greška prilikom registracije'
    } else {
      error.value = 'Greška u mreži, provjerite backend server.'
    }
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
