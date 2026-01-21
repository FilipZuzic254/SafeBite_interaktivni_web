<!-- Ana Krišto-->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Prijava administratora</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacPrijava"> <!-- qform hvata submit događaj, prevent spriječava default refresh-->
          <q-input filled v-model="korIme" label="Korisničko ime" required />
          <q-input filled v-model="lozinka" label="Lozinka" type="password" required class="q-mt-sm" /> <!--input za loz admina, type passw skriva unos-->

          <!--gumb za submit forme-->
          <div class="q-mt-md">
            <!--tip submit da se pokrene submitForm, tekst gumba, boja gumba, zaobljeni rubovi gumba, prikazuje loading spinner dok traje request-->
            <q-btn type="submit" label="Prijava" color="primary" rounded :loading="loading" />
          </div>

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
import { useRouter } from 'vue-router'

//reaktivna varijabla
const router = useRouter() //router za navigaciju između stranica
const korIme = ref('') //veze se na input korisnickog imena
const lozinka = ref('') //veze se na input lozinke
const loading = ref(false) //status loading spinnera
const error = ref(null) //poruka o gresci
const success = ref(null) //poruka o uspjehu
const ObrazacPrijava = ref(null) //ref na formu da se moze resetirati


const api_url=import.meta.env.VITE_API_URL

const submitForm = async () => { //funkcija za submit forme
  //aktiviraj loading i ocisti stare poruke
  loading.value = true 
  error.value = null
  success.value = null

  try {
    //posalji POST request na backend endpoint za login admina
    const response = await axios.post(`${api_url}/admin/login`, {
      Ime_admina: korIme.value, //korisnicko ime koje je unio admin
      Lozinka_admina: lozinka.value, //lozinka koju je admin unio
    })

    // Spremi token u localStorage
    const tokenObj = {
    id: response.data.admin.ID_admina, //ID admina
    korIme: response.data.admin.Ime_admina, //korisnicko ime admina
    uloga: 'admin' //uloga
    }
    localStorage.setItem('token', JSON.stringify(tokenObj)) //spremi u localStorage
    window.dispatchEvent(new CustomEvent('prijava', { detail: tokenObj }))


    // Navigacija na pocetnu stranicu
    router.push('/') 
    

    success.value = response.data.message
    ObrazacPrijava.value?.reset()
    korIme.value = ''
    lozinka.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Došlo je do greške prilikom prijave'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.q-page {
  min-height: 100vh; /*visina pokriva cijeli ekran */
  background-color: #f5f5f5; /*svijetlo siva pozadina */
}
</style>
