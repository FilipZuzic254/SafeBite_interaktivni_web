<!-- Matea Lesica-->
<template>
  <div class="q-pa-md">
    <!-- Ikona -->
    <q-card flat class="my-card">
      <q-img src="src/assets/Restorani.png" :height="400" />
    </q-card>

    <!-- Naslov i citat -->
    <div class="q-pa-md text-center naslov-container">
      <p class="citat">
        “Restoran je mjesto gdje se stol pretvara u druženje, a okus u priču.”
      </p>
    </div>

    <!-- Kartice restorana -->
    <div class="q-pa-md row justify-center items-start q-gutter-lg">
      <q-card
        v-for="restoran in restorani"
        :key="restoran.ID_objekta"
        class="my-card restorani-card"
        flat
        bordered
        @click="$router.push({ path: '/jelovnik', query: { objektID: restoran.ID_objekta } })"
        style="cursor: pointer"
      >
        <q-img
          :src="restoran.Slika_objekta ? api_url + restoran.Slika_objekta : '/images/default.jpg'"
          class="card-img"
        />
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ restoran.Ime_objekta }}</div>
            <div class="col-auto text-grey text-caption">{{ restoran.Adresa_objekta }}</div>
          </div>

          <q-rating :model-value="restoran.prosjecna_ocjena || 0" :max="5" size="22px" readonly />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-caption text-grey">{{ restoran.Opis_objekta }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const restorani = ref([])


const api_url=import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    const res = await axios.get(`${api_url}/objekti`, {
      params: { tip: 'Restoran' }
    })
    restorani.value = res.data
  } catch (err) {
    console.error('Greška pri dohvaćanju restorana:', err)
  }
})
</script>

<style scoped>
.naslov-container {
  width: 100%;
  text-align: center;
  margin-top: 40px;
}

.naslov {
  font-size: 60px;
  font-family: "Georgia", serif;
  font-weight: bold;
  color: black;
  margin-bottom: 15px;
}

.citat {
  font-size: 22px;
  font-style: italic;
  color: #333;
  max-width: 900px;
  margin: 25px auto;
}

.restorani-card {
  width: 300px;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.restorani-card:hover {
  transform: scale(1.04);
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
