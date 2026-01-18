<!-- Ana Krišto -->
<template>
  <q-page class="flex flex-center"> <!--flex+flex-center centriraju sadrzaj horizontalno i vertikalno-->
    <q-card class="q-pa-md" style="width: 600px">

      <q-card-section>
        <div class="text-h6">Prehrambene intolerancije</div>
      </q-card-section>

      <q-card-section>
        <!--q-form hvata submit događaj, prevent spriječava refresh stranice-->
        <q-form @submit.prevent="submitForm">

          
          <!--
            v-model="odabranePI" u ovu varijablu se sprema korisnikov odabir
            :options="piOptions" opcije dolaze iz baze (GET /pi)
            option-value="ID_pi" vrijednost opcije je ID intolerancije
            option-label="Naziv_pi" tekst koji se prikazuje korisniku je naziv
            label="Odaberi jednu ili više prehrambenu intoleranciju"
            multiple omogucuje odabir vise opcija
            emit-value  umjesto cijelog objekta u v-model salje samo value (ID)
            map-options Quasar mapira opcije prema option-value/option-label
            use-chips  prikazuje odabrane stavke kao "čipove"        
          -->
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

          <!--razmak iznad gumba-->
          <div class="q-mt-md">
            <!--submit gumb forme-->
            <q-btn
              type="submit"
              label="Potvrdi"
              color="primary"
              rounded
              :loading="loading"
            />
            <!-- :loading="loading" prikazuje spinner i onemogućuje gumb dok traje spremanje-->
          </div>

          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
          <div v-if="success" class="text-positive q-mt-sm">{{ success }}</div>

        </q-form>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue' //onMouted() izvrsava se kad se komponenta ucita 
import { useRouter } from 'vue-router'
import axios from 'axios'

//router koristimo za navigaciju na drugu stranicu (npr. nakon spremanja)
const router = useRouter()

const piOptions = ref([]) //lista svih intolerancija koje dođu s backenda (GET /pi)
const odabranePI = ref([]) //korisnikov izbor iz q-eselcta, zbog emit-value ovdje se spremaju samo ID-evi intolerancija

const loading = ref(false) //kontrolira spinner na gumbu
const error = ref(null) //poruka greske
const success = ref(null) //poruka uspjeha

// DOHVAT INTOLERANCIJA
onMounted(async () => {
  try {
    //token se cita iz localStorage
    //pretpostavka: token je JSON objekt i ima token.id (ID korisnika)
    const token = JSON.parse(localStorage.getItem('token'))

    // dohvat svih opcija
    const resOptions = await axios.get('http://localhost:3000/pi')
    piOptions.value = resOptions.data

    // dohvat korisnikovih odabranih intolerancija (i onih vec spremljenih)
    const resUser = await axios.get(`http://localhost:3000/korisnik/${token.id}`)
    
    // Postavi samo ID-eve u odabranePI
    //odabranePI treba biti lista ID-eva
    odabranePI.value = resUser.data.Intolerancije || []
    
  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju prehrambenih intolerancija'
  }
})


// SPREMANJE
const submitForm = async () => {
  //priprema UI state-a za spremanje
  loading.value = true
  error.value = null
  success.value = null

  try {
    //ponovno citanje tokena (ID korisnika potreban za spremanje)
    const token = JSON.parse(localStorage.getItem('token'))

    // SPREMI odgovor u varijablu res
    //salje ID_korisnika: koji korisnik sprema, i listu odabranih ID-eva intolerancija
    const res = await axios.post('http://localhost:3000/korisnik/intolerancije', {
      ID_korisnika: token.id,
      intolerancije: odabranePI.value
    })

    // Backend vraća korisnika s ažuriranim intolerancijama
    const korisnik = res.data;

    success.value = 'Intolerancije spremljene';

    // postavi odabrane intolerancije u select da ostanu prikazane
    odabranePI.value = korisnik.Intolerancije

  } catch (err) {
    console.error(err)
    error.value = 'Greška na serveru'
  } finally {
    //ovako se prebacuje na profil korisnika
    router.push('/profilKorisnik')
  }
}

</script>

<!--scoped znaci da se stilovi spremaju samo na ovu komponentu-->
<style scoped>
.q-page {
  min-height: 100vh; /*stranica uvijek minimalne visine ekrana */
  background-color: #f5f5f5; /*svijetlo siva pozadina */
}
</style>
