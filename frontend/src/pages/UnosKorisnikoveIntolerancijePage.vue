<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 600px">

      <q-card-section>
        <div class="text-h6">Prehrambene intolerancije</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm">

          <q-select
            filled
            v-model="odabranePI"
            :options="piOptions"
            option-value="ID_pi"
            option-label="Naziv_pi"
            label="Odaberi jednu ili više prehrambenu intoleranciju"
            multiple
            emit-value
            map-options
            use-chips
          />

          <div class="q-mt-md">
            <q-btn
              type="submit"
              label="Potvrdi"
              color="primary"
              :loading="loading"
            />
          </div>

          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
          <div v-if="success" class="text-positive q-mt-sm">{{ success }}</div>

        </q-form>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const piOptions = ref([])
const odabranePI = ref([])

const loading = ref(false)
const error = ref(null)
const success = ref(null)

// DOHVAT INTOLERANCIJA
onMounted(async () => {
  try {
    const token = JSON.parse(localStorage.getItem('token'))

    // dohvat svih opcija
    const resOptions = await axios.get('http://localhost:3000/pi')
    piOptions.value = resOptions.data

    // dohvat korisnikovih odabranih intolerancija
    const resUser = await axios.get(`http://localhost:3000/korisnik/${token.id}`)
    
    // Postavi samo ID-eve u odabranePI
    odabranePI.value = resUser.data.Intolerancije || []
    
  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju prehrambenih intolerancija'
  }
})


// SPREMANJE
const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    const token = JSON.parse(localStorage.getItem('token'))

    await axios.post('http://localhost:3000/korisnik/intolerancije', {
      ID_korisnika: token.id,
      intolerancije: odabranePI.value
    })

    success.value = 'Intolerancije spremljene'
    odabranePI.value = []

  } catch (err) {
    console.error(err)
    error.value = 'Greška na serveru'
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
