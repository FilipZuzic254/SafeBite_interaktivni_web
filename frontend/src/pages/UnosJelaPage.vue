<!-- Matea Matković / Unos jela -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6">Unos jela</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="formJelo">

          <!-- NAZIV JELA -->
          <q-input filled v-model="naziv" label="Naziv jela" required />

          <!-- CIJENA -->
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

          <!-- SASTAV -->
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
              label="Unesi jelo"
              color="primary"
              rounded
              :loading="loading"
            />
          </div>

          <div v-if="error" class="text-negative q-mt-sm">
            {{ error }}
          </div>

          <div v-if="success" class="text-positive q-mt-sm">
            {{ success }}
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// Router & route
const route = useRoute()
const router = useRouter()

// Ako je došlo s jelovnikaModificiraj ili iz objekta
const idObjekta = ref(route.query.objektID || null)

// Polja forme
const naziv = ref('')
const cijena = ref(null)
const sastav = ref('')
const idAdmina = ref(null)
const idVlasnika = ref(null)
const selectedIntolerances = ref([])

// Opcije za select
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

const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  const selectedIDs = selectedIntolerances.value
    .filter(n => n != null)
    .map(n => Number(n))

  const dataToSend = {
    Naziv_stavke: naziv.value,
    Cijena_stavke: cijena.value,
    ID_admina: idAdmina.value,
    ID_objekta: idObjekta.value,
    ID_vlasnika: idVlasnika.value,
    Sastav_stavke: sastav.value,
    Intolerancije: selectedIDs
  }

  try {
    const res = await axios.post(
      'http://localhost:3000/jelovnici',
      dataToSend
    )

    success.value = res.data.message

    setTimeout(() => {
      formJelo.value?.reset()
      naziv.value = ''
      cijena.value = null
      sastav.value = ''
      idObjekta.value = null
      idAdmina.value = null
      idVlasnika.value = null
      selectedIntolerances.value = []
    }, 1500)

    // ✅ Ispravljena navigacija: vraća na jelovnikModificiraj s istim objektID
    router.push({
      path: '/jelovnikModificiraj',
      query: { objektID: idObjekta.value }
    })

  } catch (err) {
    if (err.response)
      error.value = err.response.data.message
    else
      error.value = 'Greška – backend nije dostupan'
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
