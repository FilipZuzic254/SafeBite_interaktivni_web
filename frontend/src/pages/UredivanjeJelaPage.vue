<!-- Matea Matković / Uredivanje jela -->
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
const idStavke = route.query.ID_stavke // dobiva se iz URL-a

// POLJA FORME
const naziv = ref("")
const cijena = ref(null)
const sastav = ref("")
const idObjekta = ref(null)
const idAdmina = ref(null)
const idVlasnika = ref(null)
const selectedIntolerances = ref([])

// Opcije za select
const piOptions = ref([])

const loading = ref(false)

onMounted(async () => {
  try {
    // 1. Učitaj sve prehrambene intolerancije
    const piRes = await axios.get("http://localhost:3000/pi")
    piOptions.value = piRes.data

    // 2. Dohvati podatke jela po ID_stavke
    const res = await axios.get(`http://localhost:3000/jelovnici/${idStavke}`)
    const jelo = res.data

    // 3. Popuni formu
    naziv.value = jelo.Naziv_stavke
    cijena.value = jelo.Cijena_stavke
    sastav.value = jelo.Sastav_stavke
    idObjekta.value = jelo.ID_objekta
    idAdmina.value = jelo.ID_admina
    idVlasnika.value = jelo.ID_vlasnika
    selectedIntolerances.value = jelo.Intolerancije || []

    console.log(jelo.ID_objekta)

  } catch (err) {
    console.error("Greška pri dohvaćanju jela:", err)
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

    // ✅ Vrati korisnika na jelovnikModificiraj s točnim ID_objekta
   
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
.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
