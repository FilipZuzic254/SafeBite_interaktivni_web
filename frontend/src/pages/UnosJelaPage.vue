<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6">Unos jela</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacJelo">
          <!-- Polja za unos jela -->
          <q-input filled v-model="naziv_stavke" label="Naziv jela" required />
          <q-input filled v-model.number="cijena_stavke" label="Cijena (EUR)" type="number" min="0" step="0.01" required class="q-mt-sm" />
          <q-input filled v-model="sastav_stavke" label="Sastav jela" type="textarea" required class="q-mt-sm" />
          <q-input filled v-model.number="id_objekta" label="ID objekta" type="number" min="1" required class="q-mt-sm" />
          <q-input filled v-model.number="id_admina" label="ID admina" type="number" min="1" required class="q-mt-sm" />
          <q-input filled v-model.number="id_vlasnika" label="ID vlasnika" type="number" min="1" required class="q-mt-sm" />

          <div class="q-mt-md">
            <q-btn type="submit" label="Unesi jelo" color="primary" :loading="loading" />
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
import { ref } from 'vue'
import axios from 'axios'

const naziv_stavke = ref('')
const cijena_stavke = ref(0)
const sastav_stavke = ref('')
const id_objekta = ref('')
const id_admina = ref('')
const id_vlasnika = ref('')

const loading = ref(false)
const error = ref(null)
const success = ref(null)

const ObrazacJelo = ref(null)

const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    await axios.post('http://localhost:3000/jela', {
      Naziv_stavke: naziv_stavke.value,
      Cijena_stavke: cijena_stavke.value,
      Sastav_stavke: sastav_stavke.value,
      ID_objekta: id_objekta.value,
      ID_admina: id_admina.value,
      ID_vlasnika: id_vlasnika.value
    })

    success.value = 'Jelo uspješno uneseno!'

    setTimeout(() => {
      ObrazacJelo.value?.reset()
      naziv_stavke.value = ''
      cijena_stavke.value = 0
      sastav_stavke.value = ''
      id_objekta.value = ''
      id_admina.value = ''
      id_vlasnika.value = ''
    }, 2000)
  } catch (err) {
    if (err.response) {
      error.value = err.response.data.message || 'Greška prilikom unosa jela'
    } else {
      error.value = 'Greška u mreži, provjerite backend server.'
    }
    console.error(err)
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
