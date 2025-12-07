<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Prijava vlasnika objekta</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacPrijava">
          <q-input filled v-model="email" label="Email" type="email" required class="q-mt-sm" />
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

// Reactive varijable
const email = ref('')
const lozinka = ref('')

const loading = ref(false)
const error = ref(null)
const success = ref(null)

// Ref na formu
const ObrazacPrijava = ref(null)

// Submit funkcija
const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    console.log({
      Email_vlasnika: email.value,
      Lozinka_vlasnika: lozinka.value
    })

    let url = `http://localhost:3000/vlasnik?mail=${email.value}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length == 0 || data[0].Email_vlasnika != email.value || data[0].Lozinka_vlasnika != lozinka.value) {
      error.value = "Pogrešni mail i/ili lozinka";
    } else {
      // Ako je prijava uspješna
      success.value = 'Vlasnik uspješno prijavljen!'
    }


    // Reset forme
    ObrazacPrijava.value?.reset()

    // Ručno reset polja
    email.value = ''
    lozinka.value = ''
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
