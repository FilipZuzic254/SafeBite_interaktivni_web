<!-- Matea Matković, Filip Žužić -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 500px">

      <!-- Naslov stranice -->
      <q-card-section>
        <div class="text-h6">Uređivanje jela</div>
      </q-card-section>

      <q-card-section>
        <!-- Forma za uređivanje jela
        @submit.prevent sprječava refresh i poziva updateForm -->
        <q-form @submit.prevent="updateForm">

          <!-- NAZIV JELA -->
          <!-- v-model veže unos u varijablu naziv -->
          <q-input
            filled
            v-model="naziv"
            label="Naziv jela"
            required
          />

          <!-- CIJENA -->
          <!-- v-model.number automatski pretvara u broj -->
          <q-input
            filled
            v-model.number="cijena"
            label="Cijena (EUR)"
            type="number"
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

          <!-- INTOLERANCIJE -->
          <!-- q-select s više izbora -->
          <!-- options = sve intolerancije iz baze -->
          <!-- multiple = može se više odabrati -->
          <!-- use-chips = prikazuje odabrane kao oznake -->
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

          <!-- Gumb za spremanje -->
          <div class="q-mt-md">
            <!-- loading prikazuje spinner -->
            <q-btn
              type="submit"
              label="Spremi izmjene"
              color="primary"
              rounded
              :loading="loading"
            />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue" // ref = reaktivne varijable
import { useRoute, useRouter } from "vue-router" // za rad s URL-om i navigacijom
import axios from "axios" // za backend zahtjeve

const route = useRoute()
const router = useRouter()

// ID stavke dolazi iz URL-a
const idStavke = route.query.ID_stavke

// POLJA FORME
const naziv = ref("") // naziv jela
const cijena = ref(null) // cijena
const sastav = ref("") // sastav
const idObjekta = ref(null)
const idAdmina = ref(null)
const idVlasnika = ref(null)
const selectedIntolerances = ref([]) // odabrane intolerancije

// Opcije za dropdown (sve intolerancije)
const piOptions = ref([])

const loading = ref(false)


const api_url=import.meta.env.VITE_API_URL

// Pokreće se kad se stranica učita
onMounted(async () => {
  try {
    // 1. Dohvati sve intolerancije
    const piRes = await axios.get(`${api_url}/pi`)
    piOptions.value = piRes.data

    // 2. Dohvati podatke jela po ID-u
    const res = await axios.get(
      `${api_url}/jelovnici/${idStavke}`
    )
    const jelo = res.data

    // 3. Popuni formu postojećim podacima
    naziv.value = jelo.Naziv_stavke
    cijena.value = jelo.Cijena_stavke
    sastav.value = jelo.Sastav_stavke
    idObjekta.value = jelo.ID_objekta
    idAdmina.value = jelo.ID_admina
    idVlasnika.value = jelo.ID_vlasnika
    selectedIntolerances.value =
      jelo.Intolerancije || []

    console.log(jelo.ID_objekta)

  } catch (err) {
    console.error("Greška pri dohvaćanju jela:", err)
  }
})

// Funkcija za spremanje izmjena
const updateForm = async () => {
  loading.value = true

  try {
    // PUT zahtjev za ažuriranje jela
    await axios.put(
      `${api_url}/jelovnici/${idStavke}`,
      {
        Naziv_stavke: naziv.value,
        Cijena_stavke: cijena.value,
        Sastav_stavke: sastav.value,
        ID_objekta: idObjekta.value,
        ID_admina: idAdmina.value,
        ID_vlasnika: idVlasnika.value,
        Intolerancije: selectedIntolerances.value
      }
    )

    // Nakon uspjeha vraća korisnika na listu jelovnika
    router.push({
      path: '/jelovnikModificiraj',
      query: {
        objektID: idObjekta.value
      }
    })

  } catch (err) {
    console.error("Greška pri ažuriranju jela:", err)
    alert("Greška pri ažuriranju jela!")
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
