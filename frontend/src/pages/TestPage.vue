<!-- Matea Matković -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Unos slika</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm" ref="ObrazacIntolerancija">

            <q-input
                filled
                v-model.number="id_restorana"
                label="ID restorana"
                type="number"
                min="1"
                required
                class="q-mt-sm"
            />

        
            <q-file filled v-model="image" label="Img upload" class="q-mt-sm"/>
        

            <div class="q-mt-md">
                <q-btn type="submit" label="Unesi" color="primary" :loading="loading" />
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

const id_restorana = ref(null)
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const ObrazacIntolerancija = ref(null)

const image = ref(null)


const submitForm = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    const formData = new FormData()
    formData.append('id', id_restorana.value)
    formData.append('image', image.value) // THIS is the file

    const res = await axios.put(
      'http://localhost:3000/img/create/objekt',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    success.value = res.data.message || 'Intolerancija uspješno unesena!'

    setTimeout(() => {
      ObrazacIntolerancija.value?.reset()
      id_restorana.value = null
      image.value = null
    }, 2000)

  } catch (err) {
    if (err.response) {
      error.value = err.response.data.message || 'Greška prilikom unosa.'
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
