<!-- Matea Lesica -->
<template>
  <q-page class="flex flex-center"> <!-- centriran sadržaj -->
    <q-card class="q-pa-md" style="width: 400px"> <!-- kartica gdje je obrazac -->
      <q-card-section>
        <div class="text-h6">Registracija korisnika</div> <!-- naslov iznad obrasca -->
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacRegistracija"> <!-- validacija i resetiranje, @submit.prevent spriječava refresh, ref onogućava resetrianje -->
          <!-- polaj za unos, reaktivne varijable preko v-modela -->
          <q-input filled v-model="ime" label="Ime" required />
          <q-input filled v-model="prezime" label="Prezime" required class="q-mt-sm" />
          <q-input filled v-model="email" label="Email" type="email" required class="q-mt-sm" />
          <q-input filled v-model="korisnickoIme" label="Korisničko ime" required class="q-mt-sm" />
          <q-input filled v-model="lozinka" label="Lozinka" type="password" required class="q-mt-sm" />

          <div class="q-mt-md">
            <q-btn type="submit" label="Registracija" color="primary" rounded :loading="loading" /> <!-- loading animacija dok se čeka potvrda ili grška -->
          </div>

          <!-- Poruke o grešci ili uspjehu -->
          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
          <div v-if="success" class="text-positive q-mt-sm">{{ success }}</div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue' //import za reaktivne varijable
import { useRouter } from 'vue-router' //za navigaciju na druge stranice (prijava)
import axios from 'axios' //za zahtjev prema backendu

// ruter
const router = useRouter()

// reaktivne varijable povezane na input polja
const ime = ref('')
const prezime = ref('')
const email = ref('')
const korisnickoIme = ref('')
const lozinka = ref('')
const intolerancije = ref([])

const loading = ref(false) //animacija gumba loading
const error = ref(null) //teskt grške
const success = ref(null) //tekst o uspješnoj registraciji

// ref na obrazac
const ObrazacRegistracija = ref(null)

// funkcija koja se pokreće kada se pošalje obrazac
const submitForm = async () => {
  loading.value = true //pokreće se animacija loading
  error.value = null //brisanje stagre greške
  success.value = null //brisanje stare potvrde

  try {
    //šaljemo podatke backendu POST-om
    await axios.post('http://localhost:3000/korisnik', {
      Korisnicko_ime: korisnickoIme.value,
      Lozinka_korisnika: lozinka.value,
      Ime_korisnika: ime.value,
      Prezime_korisnika: prezime.value,
      Email_korisnika: email.value,
      Intolerancije: []
    })

    // registracija uspješna
    success.value = 'Korisnik uspješno registriran!'

    // pauza da korisnik vidi poruku
    setTimeout(() => {
      // reset obrasca
      ObrazacRegistracija.value?.reset()

      ime.value = ''
      prezime.value = ''
      email.value = ''
      korisnickoIme.value = ''
      lozinka.value = ''
      intolerancije.value = []

      //odlazak na stranicu prijava
      router.push('/prijava/korisnik')
    }, 3000) // 3 sekunde

  } catch (err) {
    // ako API vrati grešku onda se ovo prikaže korisniku
    if (err.response) {
      error.value = err.response.data.message || 'Greška prilikom registracije'
    } else {
      // Ako server nije upaljen ili dostupan
      error.value = 'Greška u mreži, provjerite backend server.'
    }
    console.error(err)
  } finally {
    //prestanak animacije loading
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
