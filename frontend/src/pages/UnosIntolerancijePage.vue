<!-- Matea Matković-->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Unos prehrambene intolerancije</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="formIntolerancija">
          <!-- Naziv intolerancije -->
          <q-input filled v-model="naziv_pi" label="Naziv intolerancije" required />

          <div class="q-mt-md">
            <q-btn type="submit" label="Unesi" color="primary" rounded :loading="loading" />
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

const naziv_pi = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const formIntolerancija = ref(null)

const submitForm = async () => {
  if (!naziv_pi.value.trim()) {
    error.value = 'Nedostaju obavezna polja.'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    // Dohvati token iz localStorage
    const token = JSON.parse(localStorage.getItem('token'))
    if (!token) throw new Error('Niste prijavljeni.')

    // ID admina iz tokena
    const ID_admina = token?.uloga === 'admin' ? token.id : null
    if (!ID_admina) throw new Error('Neispravan token – korisnik nije admin.')

    // Podaci za backend
    const dataToSend = {
      Naziv_pi: naziv_pi.value,
      ID_admina: ID_admina
    }

    const res = await axios.post('http://localhost:3000/pi', dataToSend)

    success.value = res.data.message || 'Intolerancija uspješno unesena!'

    setTimeout(() => {
      formIntolerancija.value?.reset()
      naziv_pi.value = ''
    }, 1500)

  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || err.message || 'Greška – backend nije dostupan'
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
