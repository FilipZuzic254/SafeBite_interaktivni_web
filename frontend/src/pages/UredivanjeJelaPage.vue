<!-- UrediJeloPage.vue - Matea Matković style -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6">Uredi jelo</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="formJelo">

          <!-- ODABIR JELA -->
          <q-select
            filled
            v-model="selectedJeloId"
            :options="jelaOptions"
            option-value="ID_stavke"
            option-label="Naziv_stavke"
            label="Odaberi jelo za uređivanje"
            emit-value
            map-options
            @update:model-value="loadJeloData"
            class="q-mb-sm"
          />

          <!-- Prikaži formu samo ako je jelo odabrano -->
          <template v-if="selectedJeloId">

            <q-input filled v-model="naziv" label="Naziv jela" required />

            <q-input
              filled
              v-model.number="cijena"
              label="Cijena (EUR)"
              type="number"
              min="0"
              step="0.01"
              required
              class="q-mt-sm"
            />

            <q-input
              filled
              v-model="sastav"
              label="Sastav jela"
              type="textarea"
              class="q-mt-sm"
            />

            <!-- OBJEKT -->
            <q-select
              filled
              v-model="idObjekta"
              :options="objektOptions"
              option-value="ID_objekta"
              option-label="Ime_objekta"
              label="Odaberi objekt"
              emit-value
              map-options
              class="q-mt-sm"
            />

            <!-- ADMIN -->
            <q-select
              filled
              v-model="idAdmina"
              :options="adminOptions"
              option-value="ID_admina"
              option-label="Ime_admina"
              label="Odaberi admina"
              emit-value
              map-options
              class="q-mt-sm"
            />

            <!-- VLASNIK -->
            <q-select
              filled
              v-model="idVlasnika"
              :options="vlasnikOptions"
              option-value="ID_vlasnika"
              option-label="Ime_vlasnika"
              label="Odaberi vlasnika"
              emit-value
              map-options
              class="q-mt-sm"
            />

            <!-- INTOLERANCIJE -->
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
              <q-btn
                type="submit"
                label="Spremi izmjene"
                color="primary"
                :loading="loading"
              />
            </div>

            <div v-if="error" class="text-negative q-mt-sm">
              {{ error }}
            </div>

            <div v-if="success" class="text-positive q-mt-sm">
              {{ success }}
            </div>

          </template>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Odabrano jelo
const selectedJeloId = ref(null)
const jelaOptions = ref([])

// Podaci forme
const naziv = ref('')
const cijena = ref(null)
const sastav = ref('')

const idObjekta = ref(null)
const idAdmina = ref(null)
const idVlasnika = ref(null)

const selectedIntolerances = ref([])

// Dropdowni
const piOptions = ref([])
const objektOptions = ref([])
const adminOptions = ref([])
const vlasnikOptions = ref([])

const loading = ref(false)
const error = ref(null)
const success = ref(null)
const formJelo = ref(null)

onMounted(async () => {
  try {
    // JELA
    const jelaRes = await axios.get('http://localhost:3000/edit-jela')
    jelaOptions.value = jelaRes.data

    // INTOLERANCIJE
    const piRes = await axios.get('http://localhost:3000/pi')
    piOptions.value = piRes.data.map(p => ({
      ID_pi: Number(p.ID_pi),
      Naziv_pi: p.Naziv_pi
    }))

    // OBJEKTI
    const objRes = await axios.get('http://localhost:3000/objekti')
    objektOptions.value = objRes.data

    // ADMIN
    const admRes = await axios.get('http://localhost:3000/admin')
    adminOptions.value = admRes.data

    // VLASNICI
    const vlasRes = await axios.get('http://localhost:3000/vlasnik')
    vlasnikOptions.value = vlasRes.data

  } catch (err) {
    console.error(err)
    error.value = "Backend nije dostupan."
  }
})

// Učitaj podatke odabranog jela
const loadJeloData = async (jeloId) => {
  if (!jeloId) {
    resetForm()
    return
  }

  try {
    const response = await axios.get(`http://localhost:3000/edit-jela/${jeloId}`)
    const jelo = response.data

    // Popuni formu
    naziv.value = jelo.Naziv_stavke || ''
    cijena.value = jelo.Cijena_stavke || null
    sastav.value = jelo.Sastav_stavke || ''
    idObjekta.value = jelo.ID_objekta || null
    idAdmina.value = jelo.ID_admina || null
    idVlasnika.value = jelo.ID_vlasnika || null
    selectedIntolerances.value = Array.isArray(jelo.Intolerancije) 
      ? jelo.Intolerancije.map(id => Number(id)) 
      : []

    error.value = null
    success.value = null

  } catch (err) {
    console.error('Greška pri dohvaćanju jela:', err)
    error.value = err.response?.data?.message || 'Greška pri učitavanju jela'
  }
}

// Submit - ažuriraj jelo
const submitForm = async () => {
  if (!selectedJeloId.value) {
    error.value = "Odaberi jelo za uređivanje"
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  const selectedIDs = selectedIntolerances.value
    .filter(n => n != null)
    .map(n => Number(n))

  const dataToSend = {
    Naziv_stavke: naziv.value,
    Cijena_stavke: cijena.value,
    Sastav_stavke: sastav.value,
    ID_objekta: idObjekta.value,
    ID_admina: idAdmina.value,
    ID_vlasnika: idVlasnika.value,
    Intolerancije: selectedIDs
  }

  try {
    const res = await axios.put(
      `http://localhost:3000/edit-jela/${selectedJeloId.value}`,
      dataToSend
    )

    success.value = res.data.message || 'Jelo uspješno ažurirano!'

    // Osvježi listu jela (naziv bi se mogao promijeniti)
    const jelaRes = await axios.get('http://localhost:3000/edit-jela')
    jelaOptions.value = jelaRes.data

    // Ponovno učitaj jelo da pokažemo nove podatke
    await loadJeloData(selectedJeloId.value)

  } catch (err) {
    if (err.response)
      error.value = err.response.data.message || 'Greška pri ažuriranju'
    else
      error.value = 'Greška – backend nije dostupan'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  naziv.value = ''
  cijena.value = null
  sastav.value = ''
  idObjekta.value = null
  idAdmina.value = null
  idVlasnika.value = null
  selectedIntolerances.value = []
  error.value = null
  success.value = null
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>