<!-- Ana Krišto -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Prijava administratora</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacPrijava">
          <q-input filled v-model="korIme" label="Korisničko ime" required />
          <q-input filled v-model="lozinka" label="Lozinka" type="password" required class="q-mt-sm" />

          <div class="q-mt-md">
            <q-btn type="submit" label="Prijava" color="primary" :loading="loading" />
          </div>

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

const korIme = ref('')
const lozinka = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const ObrazacPrijava = ref(null)

const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    console.log({ Ime_admina: korIme.value, Lozinka_admina: lozinka.value })

    const response = await axios.post('http://localhost:3000/admin/login', {
      Ime_admina: korIme.value,
      Lozinka_admina: lozinka.value,
    })

    success.value = response.data.message
    ObrazacPrijava.value?.reset()
    korIme.value = ''
    lozinka.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Došlo je do greške prilikom prijave'
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
