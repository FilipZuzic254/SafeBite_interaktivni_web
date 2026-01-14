<!-- Matea Matković, Filip Žužić -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 500px">

      <!-- Naslov stranice -->
      <q-card-section>
        <div class="text-h6">Unos jela</div>
      </q-card-section>

      <q-card-section>
        <!-- Forma za unos jela
        submit.prevent sprječava reload i poziva submitForm -->
        <q-form @submit.prevent="submitForm" ref="formJelo">

          <!-- NAZIV JELA -->
          <!-- v-model veže unos u varijablu naziv -->
          <q-input filled v-model="naziv" label="Naziv jela" required />

          <!-- CIJENA -->
          <!-- v-model.number pretvara u broj -->
          <!-- min i step ograničavaju unos -->
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
          <!-- textarea za duži tekst -->
          <q-input
            filled
            v-model="sastav"
            label="Sastav jela"
            type="textarea"
            class="q-mt-sm"
          />

          <!-- OBJEKT -->
          <!-- dropdown za odabir objekta -->
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

          <!-- INTOLERANCIJE -->
          <!-- multiple = može se odabrati više -->
          <!-- use-chips = prikaz u obliku oznaka -->
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

          <!-- GUMB ZA SLANJE -->
          <div class="q-mt-md">
            <q-btn
              type="submit"
              label="Unesi jelo"
              color="primary"
              rounded
              :loading="loading"
            />
          </div>

          <!-- PRIKAZ GREŠKE -->
          <div v-if="error" class="text-negative q-mt-sm">
            {{ error }}
          </div>

          <!-- PRIKAZ USPJEHA -->
          <div v-if="success" class="text-positive q-mt-sm">
            {{ success }}
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue' // reaktivne varijable + lifecycle hook
import { useRoute, useRouter } from 'vue-router' // rad s URL-om
import axios from 'axios' // backend pozivi

// Router & route
const route = useRoute()
const router = useRouter()

// ID objekta (ako dolazi iz druge stranice)
const idObjekta = ref(null)

// POLJA FORME
const naziv = ref('')
const cijena = ref(null)
const sastav = ref('')
const selectedIntolerances = ref([])

// OPCIJE ZA SELECT
const piOptions = ref([]) // intolerancije
const objektOptions = ref([]) // objekti

const loading = ref(false)
const error = ref(null)
const success = ref(null)
const formJelo = ref(null)

// Pokreće se kad se stranica učita
onMounted(async () => {
  try {
    // DOHVAT INTOLERANCIJA
    const piRes = await axios.get('http://localhost:3000/pi')
    piOptions.value = piRes.data.map(p => ({
      ID_pi: Number(p.ID_pi),
      Naziv_pi: p.Naziv_pi
    }))

    // DOHVAT OBJEKATA
    // provjera uloge korisnika iz tokena
    const token = JSON.parse(localStorage.getItem('token'))
    const idVlasnika =
      token?.uloga === 'vlasnik' ? token.id : null

    // Ako nije vlasnik -> dohvaća sve objekte
    if (idVlasnika === null) {
      const objRes = await axios.get(
        'http://localhost:3000/objekti'
      )
      objektOptions.value = objRes.data
    } 
    // Ako je vlasnik -> dohvaća samo njegove objekte
    else {
      const objRes = await axios.get(
        'http://localhost:3000/objekti',
        { params: { vlasnikID: idVlasnika } }
      )
      objektOptions.value = objRes.data
    }

    // Ako dolazi s druge stranice s objektID
    idObjekta.value = route.query.objektID
      ? Number(route.query.objektID)
      : null

  } catch (err) {
    console.error(err)
    error.value = "Backend nije dostupan."
  }
})

// Funkcija za slanje forme
const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  // Dohvat tokena
  const token = JSON.parse(localStorage.getItem('token'))
  const idVlasnika =
    token?.uloga === 'vlasnik' ? token.id : null
  const idAdmina =
    token?.uloga === 'admin' ? token.id : null

  // Pretvaranje intolerancija u brojeve
  const selectedIDs = selectedIntolerances.value
    .filter(n => n != null)
    .map(n => Number(n))

  // Podaci za backend
  const dataToSend = {
    Naziv_stavke: naziv.value,
    Cijena_stavke: cijena.value,
    ID_admina: idAdmina,
    ID_objekta: idObjekta.value,
    ID_vlasnika: idVlasnika,
    Sastav_stavke: sastav.value,
    Intolerancije: selectedIDs
  }

  try {
    // POST zahtjev za unos jela
    const res = await axios.post(
      'http://localhost:3000/jelovnici',
      dataToSend
    )

    success.value = res.data.message

    // Reset forme nakon 1.5s
    setTimeout(() => {
      formJelo.value?.reset()
      naziv.value = ''
      cijena.value = null
      sastav.value = ''
      idObjekta.value = null
      selectedIntolerances.value = []
    }, 1500)

    // Povratak na jelovnik s istim objektID
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
/* Stil stranice */
.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
