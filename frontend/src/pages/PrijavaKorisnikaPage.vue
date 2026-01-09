<!-- Petra Grgić -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <!-- Naslov obrasca -->
      <q-card-section>
        <div class="text-h6">Prijava korisnika</div>
      </q-card-section>

      <!-- Forma za login -->
      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacPrijava">
          <!-- Polja -->
          <q-input filled v-model="korIme" label="Korisničko ime" required />
          <q-input filled v-model="lozinka" label="Lozinka" type="password" required class="q-mt-sm" />

          <!-- Gumb za prijavu -->
          <div class="q-mt-md">
            <q-btn type="submit" label="Prijava" color="primary" :loading="loading" />
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

// Router za redirect
const router = useRouter()

// Reaktivne varijable
const korIme = ref('')
const lozinka = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

// Ref na formu (za reset)
const ObrazacPrijava = ref(null)

// Funkcija za submit
const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  // Logiraj što šaljemo
  console.log("Slanje podataka:", {
    Korisnicko_ime: korIme.value,
    Lozinka_korisnika: lozinka.value
  });

  try {
    const response = await axios.post(
      'http://localhost:3000/korisnik/prijava',
      {
        Korisnicko_ime: korIme.value,
        Lozinka_korisnika: lozinka.value
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Spremi token u localStorage
    const tokenObj = {
    id: response.data.user.ID_korisnika,
    korIme: response.data.user.Korisnicko_ime,
    uloga: 'korisnik'
    }
    localStorage.setItem('token', JSON.stringify(tokenObj))
    window.dispatchEvent(new CustomEvent('prijava', { detail: tokenObj }))


    // Navigacija na pocetnu stranicu
    router.push('/')

    console.log("Odgovor backend-a:", response.data);

    // Ako login uspije
    success.value = 'Prijava uspješna!'

    // Reset i redirect nakon 1.5 sekunde
    setTimeout(() => {
      ObrazacPrijava.value?.reset()
      korIme.value = ''
      lozinka.value = ''

      router.push('/') // ili neki dashboard
    }, 1500)

  } catch (err) {
    // Ako login ne uspije
    if (err.response) {
      error.value = err.response.data.message || 'Korisničko ime ili lozinka nisu ispravni'
    } else {
      error.value = 'Greška u mreži, provjerite backend server.'
    }
    console.error("Axios greška:", err)
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
