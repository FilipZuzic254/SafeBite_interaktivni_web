<!-- Filip Žužić -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <!-- Naslov obrasca -->
      <q-card-section>
        <div class="text-h6">Prijava vlasnika objekta</div>
      </q-card-section>

      <!-- Forma za login -->
      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacPrijava">
          <!-- Polja -->
          <q-input filled v-model="email" label="Email" type="email" required class="q-mt-sm" />
          <q-input filled v-model="lozinka" label="Lozinka" type="password" required class="q-mt-sm" />

          <!-- Gumb za prijavu -->
          <div class="q-mt-md">
            <q-btn type="submit" label="Prijava" color="primary" rounded :loading="loading" />
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
import { useRouter } from 'vue-router'
import axios from 'axios'

// Reaktivne varijable
const email = ref('')
const lozinka = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const router = useRouter()
const ObrazacPrijava = ref(null)

// Funkcija za login
const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    console.log("Login vlasnika:", {
      Email_vlasnika: email.value,
      Lozinka_vlasnika: lozinka.value
    })

    // POST request na backend
    const response = await axios.post('http://localhost:3000/vlasnik/prijava', {
      Email_vlasnika: email.value,
      Lozinka_vlasnika: lozinka.value
    })

    // backend vraća: { message, user }
    const tokenObj = {
      id: response.data.user.ID_vlasnika,
      korIme: response.data.user.Email_vlasnika,
      uloga: 'vlasnik'
    }

    // Spremi token i trigger event za MainLayout
    localStorage.setItem('token', JSON.stringify(tokenObj))
    window.dispatchEvent(new CustomEvent('prijava', { detail: tokenObj }))

    // Poruka uspjeha
    success.value = 'Vlasnik uspješno prijavljen!'

    // Reset forme
    ObrazacPrijava.value?.reset()
    email.value = ''
    lozinka.value = ''

    // Navigacija na početnu stranicu
    router.push('/')
  } catch (err) {
    if (err.response) {
      error.value = err.response.data.message || 'Greška prilikom prijave'
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
