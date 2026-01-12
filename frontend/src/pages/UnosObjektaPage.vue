<!-- Ana Krišto-->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 600px">
      <q-card-section>
        <div class="text-h6">Unos poslovnog objekta</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="formObjekt">

          <!-- Ime objekta -->
          <q-input filled v-model="imeObjekta" label="Ime objekta" required />

          <!-- Adresa -->
          <q-input filled v-model="adresaObjekta" label="Adresa objekta" required class="q-mt-sm" />

          <!-- Opis -->
          <q-input filled v-model="opisObjekta" label="Opis objekta" type="textarea" class="q-mt-sm" />

          <!-- Grad dropdown -->
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

          <!-- Tip objekta -->
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

          <!-- Email -->
          <q-input filled v-model="emailObjekta" label="Email objekta" type="email" required class="q-mt-sm" />

          <!-- OIB -->
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

          
          <q-file filled v-model="thumbnail" label="Naslovna slika objekta" class="q-mt-sm"/>

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

const imeObjekta = ref('')
const adresaObjekta = ref('')
const opisObjekta = ref('')
const postanskiBroj = ref(null)
const tipObjekta = ref(null)
const emailObjekta = ref('')
const oibObjekta = ref('')
const thumbnail = ref(null)

const gradOptions = ref([])
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const formObjekt = ref(null)


// Dobivanje gradova iz baze
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/gradovi')
    gradOptions.value = res.data // očekuje se niz objekata { Postanski_broj, Naziv_grada }
  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju gradova'
  }
})

// Validacija OIB
function validateOIB() {
  oibObjekta.value = oibObjekta.value.replace(/\D/g, '') // samo brojevi
  if (oibObjekta.value.length > 11) oibObjekta.value = oibObjekta.value.slice(0, 11)
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
    // Dobivanje ID vlasnika ili admina iz tokena
    const token = JSON.parse(localStorage.getItem('token'))
    const idVlasnika = token?.uloga === 'vlasnik' ? token.id : null
    const idAdmina = token?.uloga === 'admin' ? token.id : null

    const dataToSend = {
      Ime_objekta: imeObjekta.value,
      Adresa_objekta: adresaObjekta.value,
      Opis_objekta: opisObjekta.value,
      Postanski_broj: postanskiBroj.value,
      Tip_objekta: tipObjekta.value.value,
      Email_objekta: emailObjekta.value,
      OIB_objekta: oibObjekta.value,
      ID_vlasnika: idVlasnika,
      ID_admina: idAdmina
    }


    
    const res = await axios.post('http://localhost:3000/objekti', dataToSend)
    const id_objekta = res.data.id

    const imgData = new FormData()
    imgData.append('id', id_objekta)
    imgData.append('image', thumbnail.value)

    await axios.put('http://localhost:3000/img/add/objekt',
      imgData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )

    success.value = res.data.message
    



    /*
    setTimeout(() => {
      formObjekt.value?.reset()
      imeObjekta.value = ''
      adresaObjekta.value = ''
      opisObjekta.value = ''
      postanskiBroj.value = null
      tipObjekta.value = null
      emailObjekta.value = ''
      oibObjekta.value = ''
    }, 1500)
    */

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
