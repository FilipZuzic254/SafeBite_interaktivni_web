<!-- Ana Krišto, Filip žužić-->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 600px"> <!--sirina ogranicena na 600px-->
      <q-card-section>
        <div class="text-h6">Unos poslovnog objekta</div>
      </q-card-section>

      <q-card-section>
        <!-- q-form hvata submit događaj, prevent spriječava refresh stranice-->
        <q-form @submit.prevent="submitForm" ref="formObjekt">

          <!-- input za ime objekta -->
          <!--v-model veze vrijednost inputa s varijablom imeObjekta--> 
          <q-input filled v-model="imeObjekta" label="Ime objekta" required />

          <!-- input za adresu -->
          <q-input filled v-model="adresaObjekta" label="Adresa objekta" required class="q-mt-sm" />

          <!-- textarea za opis objekta -->
          <q-input filled v-model="opisObjekta" label="Opis objekta" type="textarea" class="q-mt-sm" />

          <!-- dropdown za odabir grada -->
          <!--
          v-model="postanskiBroj" -> u ,pdel se sprema vrijednost postanskog broja
          :options="gradOptions" -> opcije se dohvacaju iz baze (GET /gradovi)
          option-value="Postanski_broj" -> vrijednost opcije je Postanski_broj
          option-label="Naziv_grada" -> tekst prikaza je Naziv_grada
          label="Grad"
          emit-value -> u v-model se sprema samo value (postanski broj), a ne cijeli objekt
          map-options -> mapira option-value/option-label
          required
          class="q-mt-sm"
          -->
          <q-select
            filled
            v-model="postanskiBroj" 
            :options="gradOptions"
            option-value="Postanski_broj"
            option-label="Naziv_grada"
            label="Grad"
            emit-value
            map-options
            required
            class="q-mt-sm"
          />

          <!-- dropdown za odabir tipa objekta -->
          <q-select
            filled
            v-model="tipObjekta"
            :options="[
              { label: 'Restoran', value: 'Restoran' },
              { label: 'Kafić', value: 'Kafić' }
            ]"
            label="Tip objekta"
            required
            class="q-mt-sm"
          />

          <!-- input za email objekta -->
          <q-input filled v-model="emailObjekta" label="Email objekta" type="email" required class="q-mt-sm" />

          <!-- input za OIB -->
           <!--maxlenght/minlenght 11 -> cilj je tocno 11 znakova
           @input="validateOIB"-> na svaki unos poziva se funkcija koja mice sve sto nije broj, reze na max 11 znamenki
           -->
          <q-input
            filled
            v-model="oibObjekta"
            label="OIB objekta"
            type="text"
            maxlength="11"
            minlength="11"
            required
            class="q-mt-sm"
            @input="validateOIB"
          />

          <!--FILE UPLOAD: maslovna slika objekta-->
          <q-file filled v-model="thumbnail" label="Naslovna slika objekta" class="q-mt-sm"/>

          <!--sumbit gumb-->

          <div class="q-mt-md">
            <q-btn type="submit" label="Unesi objekt" color="primary" rounded :loading="loading" />
          </div>

          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
          <div v-if="success" class="text-positive q-mt-sm">{{ success }}</div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const imeObjekta = ref('') //ime objekta (q-input)
const adresaObjekta = ref('') //adresa objekta(q-input)
const opisObjekta = ref('') //opis objekta (textarea)
const postanskiBroj = ref(null) //odabrani grad (postanski broj) (q-select)
const tipObjekta = ref(null) //tip objekta (q-select -> objekt {label,value})
const emailObjekta = ref('') //email objekta
const oibObjekta = ref('') //OIB objekta (11 znamenki)
const thumbnail = ref(null) //file objekt (q-file)

const gradOptions = ref([]) //opcije gradova dohvacene iz baze
const loading = ref(false) //status loading spinnra
const error = ref(null) //poruka o gresci
const success = ref(null) //poruka o uspjehu
const formObjekt = ref(null) //ref na formu da se moze resetirati


// Dobivanje gradova iz baze
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/gradovi') //get request za gradove
    gradOptions.value = res.data // očekuje se niz objekata { Postanski_broj, Naziv_grada }
  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju gradova' //poruka ako request ne uspije
  }
})

// Validacija OIB
function validateOIB() {
  oibObjekta.value = oibObjekta.value.replace(/\D/g, '') // ukloni sve sto nije broj
  if (oibObjekta.value.length > 11) oibObjekta.value = oibObjekta.value.slice(0, 11) //ogranici na 11 znamenki
}

const submitForm = async () => {
  if (oibObjekta.value.length !== 11) {
    error.value = 'OIB mora imati točno 11 znamenki'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    // Dobivanje ID vlasnika ili admina iz tokena spremljenog u localStorage
    const token = JSON.parse(localStorage.getItem('token'))
    const idVlasnika = token?.uloga === 'vlasnik' ? token.id : null
    const idAdmina = token?.uloga === 'admin' ? token.id : null

    const dataToSend = {
      Ime_objekta: imeObjekta.value,
      Adresa_objekta: adresaObjekta.value,
      Opis_objekta: opisObjekta.value,
      Postanski_broj: postanskiBroj.value,
      Tip_objekta: tipObjekta.value.value, //value odabrane opcije
      Email_objekta: emailObjekta.value,
      OIB_objekta: oibObjekta.value,
      ID_vlasnika: idVlasnika,
      ID_admina: idAdmina
    }

    //post request za unos objekta u bazu
    const res = await axios.post('http://localhost:3000/objekti', dataToSend)
    const id_objekta = res.data.id

    const imgData = new FormData() //kreira formData ("lista")
    imgData.append('id', id_objekta) //dodaje u listu pod ključ "id" - id objekta
    imgData.append('image', thumbnail.value) //dodaje u listu pod ključ "image" - slika objekta

    await axios.put('http://localhost:3000/img/add/objekt', //šalje podatke apiju
      imgData, //šalje se i imageData ("lista")
      {
        headers: { 'Content-Type': 'multipart/form-data' } //imagedata se sastoji od dijelova, znaci od id-ija i slike
      }
    )

    success.value = res.data.message
    

    //reset forme i svih varijabli nakon uspjesnog unosa (s delay-om 1.5s)


    
    setTimeout(() => {
      formObjekt.value?.reset()
      imeObjekta.value = ''
      adresaObjekta.value = ''
      opisObjekta.value = ''
      postanskiBroj.value = null
      tipObjekta.value = null
      emailObjekta.value = ''
      oibObjekta.value = ''
      thumbnail.value = null
    }, 1500)
    

  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'Greška – backend nije dostupan'
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
