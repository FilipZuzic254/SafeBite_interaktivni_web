<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6">Unos jela</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="formJelo">
          <q-input filled v-model="naziv" label="Naziv jela" required />
          <q-input filled v-model.number="cijena" label="Cijena (EUR)" type="number" min="0" step="0.01" required class="q-mt-sm" />
          <q-input filled v-model="sastav" label="Sastav jela" type="textarea" class="q-mt-sm" />
          <q-input filled v-model.number="idObjekta" label="ID objekta" type="number" min="1" required class="q-mt-sm" />
          <q-input filled v-model.number="idAdmina" label="ID admina" type="number" min="1" required class="q-mt-sm" />

          <!-- Multi-select za postojeće intolerancije -->
          <q-select
            filled
            v-model="selectedIntolerances"
            :options="piOptions"
            option-value="ID_pi"
            option-label="Naziv_pi"
            label="Odaberite intolerancije"
            multiple
            emit-value
            map-options
            use-chips
            class="q-mt-sm"
          />

          <div class="q-mt-md">
            <q-btn type="submit" label="Unesi jelo" color="primary" :loading="loading" />
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

const naziv = ref('')
const cijena = ref(null)
const sastav = ref('')
const idObjekta = ref(null)
const idAdmina = ref(null)
const selectedIntolerances = ref([])

const piOptions = ref([])
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const formJelo = ref(null)

// Dohvati sve postojeće intolerancije iz baze
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/pi')
    piOptions.value = res.data
      .filter(p => p.ID_pi != null)
      .map(p => ({ ID_pi: Number(p.ID_pi), Naziv_pi: p.Naziv_pi }))
  } catch (err) {
    console.error("Greška pri dohvaćanju intolerancija:", err)
    error.value = "Backend nije dostupan."
  }
})

// Funkcija za unos stavke
const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  // filtriraj null i konvertiraj u broj
  const selectedIDs = selectedIntolerances.value
    .filter(n => n != null)
    .map(n => Number(n))

  const dataToSend = {
    Naziv_stavke: naziv.value,
    Cijena_stavke: cijena.value,
    ID_admina: idAdmina.value,
    ID_objekta: idObjekta.value,
    Sastav_stavke: sastav.value,
    Intolerancije: selectedIDs
  }

  console.log("Šaljem na API:", JSON.stringify(dataToSend, null, 2))

  try {
    const res = await axios.post('http://localhost:3000/jelovnici', dataToSend)
    success.value = res.data.message

    setTimeout(() => {
      formJelo.value?.reset()
      naziv.value = ''
      cijena.value = null
      sastav.value = ''
      idObjekta.value = null
      idAdmina.value = null
      selectedIntolerances.value = []
    }, 1500)
  } catch (err) {
    if (err.response) error.value = err.response.data.message
    else error.value = 'Greška – backend nije dostupan'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.q-page { min-height: 100vh; background-color: #f5f5f5; }
</style>
