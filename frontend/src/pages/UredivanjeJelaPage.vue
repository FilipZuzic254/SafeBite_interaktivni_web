<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6">Uređivanje jela</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="updateForm">

          <!-- NAZIV JELA -->
          <q-input filled v-model="naziv" label="Naziv jela" required />

          <!-- CIJENA -->
          <q-input
            filled
            v-model.number="cijena"
            label="Cijena (EUR)"
            type="number"
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

         
          <!-- INTOLERANCIJE -->
          <q-select
            filled
            v-model="selectedIntolerances"
            :options="piOptions"
            option-value="ID_pi"
            option-label="Naziv_pi"
            label="Intolerancije"
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

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"

const route = useRoute()
const router = useRouter()
const idStavke = route.query.ID_stavke // ID već dolazi iz liste jela

// POLJA FORME
const naziv = ref("")
const cijena = ref(null)
const sastav = ref("")
const idObjekta = ref(null)
const idAdmina = ref(null)
const idVlasnika = ref(null)
const selectedIntolerances = ref([])

const piOptions = ref([])
const objektOptions = ref([])
const adminOptions = ref([])
const vlasnikOptions = ref([])

const loading = ref(false)

onMounted(async () => {
  try {
    // 1. učitaj opcije
    piOptions.value = (await axios.get("http://localhost:3000/pi")).data
    objektOptions.value = (await axios.get("http://localhost:3000/objekti")).data
    adminOptions.value = (await axios.get("http://localhost:3000/admin")).data
    vlasnikOptions.value = (await axios.get("http://localhost:3000/vlasnik")).data

    // 2. DOHVATI JELA PO ID
    const res = await axios.get(`http://localhost:3000/jelovnici/${idStavke}`)
    const j = res.data

    // 3. POPUNI FORMU
    naziv.value = j.Naziv_stavke
    cijena.value = j.Cijena_stavke
    sastav.value = j.Sastav_stavke
    idObjekta.value = j.ID_objekta
    idAdmina.value = j.ID_admina
    idVlasnika.value = j.ID_vlasnika
    selectedIntolerances.value = j.Intolerancije || []

  } catch (e) {
    console.error("Greška:", e)
  }
})

const updateForm = async () => {
  loading.value = true
  try {
    await axios.put(`http://localhost:3000/jelovnici/${idStavke}`, {
      Naziv_stavke: naziv.value,
      Cijena_stavke: cijena.value,
      Sastav_stavke: sastav.value,
      ID_objekta: idObjekta.value,
      ID_admina: idAdmina.value,
      ID_vlasnika: idVlasnika.value,
      Intolerancije: selectedIntolerances.value
    })
    alert("Jelo uspješno ažurirano!")
    router.push(`/jelovnik?objektID=${idObjekta.value}`)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
