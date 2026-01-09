<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-parallax
        src="src/assets/rijeka.jpg"
        :height="550"
      />
    </q-card>
  </div>

  <div class="q-pa-md text-center naslov-container">
    <h1 class="naslov">Grad Rijeka</h1>
    <p class="citat">
      Rijeka je živahan hrvatski grad prepun šarmantnih kafića u kojima se uvijek može uživati u opuštenoj atmosferi i dobrom društvu.
    </p>
  </div>

  <!-- Kartice -->
  <div class="q-pa-md row justify-center items-start q-gutter-lg">
    <q-card
      v-for="kafic in kafici"
      :key="kafic.ID_objekta"
      class="my-card cafe-card"
      flat
      bordered
    >
      <!-- Slika -->
      <q-img :src="kafic.Slika || 'src/assets/default.jpg'" class="card-img" />

      <!-- Ime + Adresa -->
      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ kafic.Ime_objekta }}</div>
          <div class="col-auto text-grey text-caption">{{ kafic.Adresa_objekta }}</div>
        </div>

        <!-- Zvjezdice -->
        <q-rating
          :model-value="kafic.prosjecna_ocjena || 0"
          :max="5"
          size="22px"
          readonly
        />
      </q-card-section>

      <!-- Opis objekta -->
      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey">{{ kafic.Opis_objekta }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const kafici = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/objekti', {
      params: { tip: 'Kafić' } // filtriramo samo kafiće
    })
    kafici.value = res.data
  } catch (err) {
    console.error('Greška pri dohvaćanju kafića:', err)
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

.cafe-card {
  width: 300px;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}

.cafe-card:hover {
  transform: scale(1.04);
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
