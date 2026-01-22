<!-- Matea Matković -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 520px">

      <!-- Naslov kartice -->
      <q-card-section>
        <div class="text-h6">Unos prehrambene intolerancije</div>
      </q-card-section>

      <q-card-section>
        <!-- Forma za unos intolerancije -->
        <q-form @submit.prevent="submitForm" ref="formIntolerancija">
          <!-- Input polje za naziv intolerancije -->
          <q-input filled v-model="naziv_pi" label="Naziv intolerancije" required />

          <!-- Gumb za slanje forme -->
          <div class="q-mt-md">
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

      <q-separator />

      <!-- ISPIS POSTOJEĆIH INTOLERANCIJA -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Postojeće intolerancije:</div>

        <div v-if="loadingList" class="text-grey-7">
          Učitavanje...
        </div>

        <div v-else-if="intolerancije.length === 0" class="text-grey-7">
          Trenutno nema unesenih intolerancija.
        </div>

        <q-list v-else bordered separator>
          <q-item v-for="pi in intolerancije" :key="pi.ID_pi">
            <q-item-section>
              {{ pi.Naziv_pi }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Reaktivne varijable (forma)
const naziv_pi = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const formIntolerancija = ref(null)

// Reaktivne varijable (lista intolerancija)
const intolerancije = ref([])
const loadingList = ref(false)

const api_url = import.meta.env.VITE_API_URL

// Dohvat svih intolerancija (GET /pi)
const fetchIntolerancije = async () => {
  loadingList.value = true
  try {
    const res = await axios.get(`${api_url}/pi`)
    intolerancije.value = res.data

    // ispis u konzolu (ako ti treba)
    console.log('Postojeće intolerancije:', intolerancije.value)
  } catch (err) {
    console.error(err)
    // ne rušimo cijelu stranicu, ali možemo prikazati poruku
    error.value = 'Greška pri dohvaćanju postojećih intolerancija.'
  } finally {
    loadingList.value = false
  }
}

// Kad se stranica učita, dohvatimo sve intolerancije
onMounted(async () => {
  await fetchIntolerancije()
})

// Funkcija koja se poziva kad se pošalje forma
const submitForm = async () => {
  if (!naziv_pi.value.trim()) {
    error.value = 'Nedostaju obavezna polja.'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    const token = JSON.parse(localStorage.getItem('token'))
    if (!token) throw new Error('Niste prijavljeni.')

    const ID_admina = token?.uloga === 'admin' ? token.id : null
    if (!ID_admina) throw new Error('Neispravan token – korisnik nije admin.')

    const dataToSend = {
      Naziv_pi: naziv_pi.value,
      ID_admina: ID_admina
    }

    const res = await axios.post(`${api_url}/pi`, dataToSend)

    success.value = res.data.message || 'Intolerancija uspješno unesena!'

    // osvježi listu da se nova intolerancija odmah vidi
    await fetchIntolerancije()

    // reset forme nakon 1.5 sekundi
    setTimeout(() => {
      formIntolerancija.value?.reset()
      naziv_pi.value = ''
    }, 1500)

  } catch (err) {
    console.error(err)
    error.value =
      err.response?.data?.message ||
      err.message ||
      'Greška – backend nije dostupan'
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
