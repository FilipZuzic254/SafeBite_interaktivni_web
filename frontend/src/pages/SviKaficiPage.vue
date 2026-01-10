<!-- Elena Jašarević-->
<template>
  <div class="q-pa-md">
    <!-- Parallax slika grada -->
    <q-card class="my-card">
      <q-parallax src="src/assets/rijeka.jpg" :height="550" />
    </q-card>

    <!-- Naslov i citat -->
    <div class="q-pa-md text-center naslov-container">
      <h1 class="naslov">Grad Rijeka</h1>
      <p class="citat">
        Rijeka je živahan hrvatski grad prepun šarmantnih kafića u kojima se uvijek može uživati u opuštenoj atmosferi i dobrom društvu.
      </p>
    </div>

    <!-- Kartice kafića -->
    <div class="q-pa-md row justify-center items-start q-gutter-lg">
      <q-card
        v-for="kafic in kafici"
        :key="kafic.ID_objekta"
        class="my-card cafe-card"
        flat
        bordered
        @click="$router.push({ path: '/jelovnik', query: { objektID: kafic.ID_objekta } })"
        style="cursor: pointer"
      >
        <q-img
          :src="kafic.Slika_objekta ? 'http://localhost:3000' + kafic.Slika_objekta : '/images/default.jpg'"
          class="card-img"
        />
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ kafic.Ime_objekta }}</div>
            <div class="col-auto text-grey text-caption">{{ kafic.Adresa_objekta }}</div>
          </div>

          <q-rating :model-value="kafic.prosjecna_ocjena || 0" :max="5" size="22px" readonly />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-caption text-grey">{{ kafic.Opis_objekta }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const kafici = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/objekti', {
      params: { tip: 'Kafić' }
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
  cursor: pointer;
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
