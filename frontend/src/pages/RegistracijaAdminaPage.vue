<!-- Ana Krišto -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Registracija admina</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacRegistracija">
          <q-input filled v-model="ime" label="Ime" required /> <!--input za ime admina, v-model povezuje varijablu ime s inputom-->
          <q-input filled v-model="prezime" label="Prezime" required class="q-mt-sm" />
          <q-input filled v-model="korIme" label="Korisničko ime" required class="q-mt-sm" />
          <q-input filled v-model="lozinka" label="Lozinka" type="password" required class="q-mt-sm" />

          <div class="q-mt-md">
            <q-btn type="submit" label="Registracija" color="primary" rounded :loading="loading" /> <!-- gumb za sumbit formu, loading prikazuje loading spinner dok traje zahtjev-->
          </div>

          <!-- Poruke o grešci / uspjehu -->
          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
          <div v-if="success" class="text-positive q-mt-sm">{{ success }}</div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Reactive varijable
// varijable koje ce se vezati na inpute forme
const ime = ref('')
const prezime = ref('')
const korIme = ref('')
const lozinka = ref('')

//varijable za upravljanje statusom forme
const loading = ref(false) //loading spinner
const error = ref(null) //poruka o gresci
const success = ref(null) //poruka o uspjehu

// Ref na formu da se moze resetirati nakon uspjesne registracije
const ObrazacRegistracija = ref(null)

// Submit funkcija
const submitForm = async () => {
  //aktiviraj loading i ocisti stare poruke
  loading.value = true
  error.value = null
  success.value = null

  try {
    //logira podatke u konzolu za debug
    console.log({
      Ime_admina: ime.value,
      Prezime_admina: prezime.value,
      Korisnicko_ime: korIme.value,
      Lozinka_admina: lozinka.value,
    })

    //post request na backend endpoint za registraciju admina
    await axios.post('http://localhost:3000/admin', {
      ime: ime.value, //ime admina
      prezime: prezime.value, //prezime admina
      Ime_admina: korIme.value, //korisnicko ime admina
      Lozinka_admina: lozinka.value, //lozinka plain text, backend hashira
    })

    //ako je request uspjesan, prikazi poruku
    success.value = 'Admin uspješno registriran!'

    //reset forme i varijabli
    ObrazacRegistracija.value?.reset()
    ime.value = ''
    prezime.value = ''
    korIme.value = ''
    lozinka.value = ''
  } catch (err) {
    //ako dođe do greske prikazi poruku
    error.value = err.response?.data?.message || 'Došlo je do greške prilikom registracije'
    console.error(err)
  } finally {
    //u svakom slucaju, iskljuci loading
    loading.value = false
  }
}
</script>

<style scoped>
.q-page {
  min-height: 100vh; /* visina stranice pokriva cijeli ekran */
  background-color: #f5f5f5; /*svijetlo siva pozadina */
}
</style>
