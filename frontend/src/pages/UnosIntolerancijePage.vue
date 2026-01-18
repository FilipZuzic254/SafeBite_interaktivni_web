<!-- Matea Matković -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">

      <!-- Naslov kartice -->
      <q-card-section>
        <div class="text-h6">Unos prehrambene intolerancije</div>
      </q-card-section>

      <q-card-section>
        <!-- Forma za unos intolerancije
        @submit.prevent -> sprječava refresh stranice i poziva submitForm -->
        <q-form @submit.prevent="submitForm" ref="formIntolerancija">

          <!-- Input polje za naziv intolerancije
          v-model veže vrijednost u varijablu naziv_pi -->
          <q-input filled v-model="naziv_pi" label="Naziv intolerancije" required />

          <!-- Gumb za slanje forme -->
          <div class="q-mt-md">
            <!-- loading prikazuje spinner dok se šalje -->
            <q-btn
              type="submit"
              label="Unesi"
              color="primary"
              rounded
              :loading="loading"
            />
          </div>

          <!-- Ako postoji greška, prikaži poruku crveno -->
          <div v-if="error" class="text-negative q-mt-sm">
            {{ error }}
          </div>

          <!-- Ako je uspješno, prikaži poruku zeleno -->
          <div v-if="success" class="text-positive q-mt-sm">
            {{ success }}
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue' // ref stvara reaktivne varijable
import axios from 'axios' // axios za slanje zahtjeva backendu

// Reaktivne varijable
const naziv_pi = ref('') // naziv intolerancije
const loading = ref(false) // stanje učitavanja
const error = ref(null) // poruka greške
const success = ref(null) // poruka uspjeha
const formIntolerancija = ref(null) // referenca na formu


const api_url=import.meta.env.VITE_API_URL

// Funkcija koja se poziva kad se pošalje forma
const submitForm = async () => {

  // Provjera je li polje prazno
  if (!naziv_pi.value.trim()) {
    error.value = 'Nedostaju obavezna polja.'
    return
  }

  // Postavljanje početnih stanja
  loading.value = true
  error.value = null
  success.value = null

  try {
    // Dohvat tokena iz localStorage
    const token = JSON.parse(localStorage.getItem('token'))
    if (!token) throw new Error('Niste prijavljeni.')

    // Provjera je li korisnik admin
    const ID_admina = token?.uloga === 'admin' ? token.id : null
    if (!ID_admina) throw new Error('Neispravan token – korisnik nije admin.')

    // Podaci koje šaljemo backendu
    const dataToSend = {
      Naziv_pi: naziv_pi.value,
      ID_admina: ID_admina
    }

    // Slanje POST zahtjeva serveru
    const res = await axios.post(
      `${api_url}/pi`,
      dataToSend
    )

    // Poruka uspjeha
    success.value =
      res.data.message || 'Intolerancija uspješno unesena!'

    // Reset forme nakon 1.5 sekundi
    setTimeout(() => {
      formIntolerancija.value?.reset()
      naziv_pi.value = ''
    }, 1500)

  } catch (err) {
    // Ako dođe do greške
    console.error(err)
    error.value =
      err.response?.data?.message ||
      err.message ||
      'Greška – backend nije dostupan'
  } finally {
    // Uvijek se izvrši – gasi loading
    loading.value = false
  }
}
</script>

<style scoped>
/* Stil za stranicu */
.q-page {
  min-height: 100vh; /* puna visina ekrana */
  background-color: #f5f5f5; 
}
</style>
