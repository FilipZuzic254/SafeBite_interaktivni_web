<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card style="width: 900px">

      <!-- Naslov -->
      <q-card-section>
        <div class="text-h5">Moj profil</div>
      </q-card-section>

      <q-separator />

      <!-- Osnovni podaci -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Osnovni podaci</div>
        <div><strong>Ime:</strong> {{ vlasnik.Ime_vlasnika }}</div>
        <div><strong>Prezime:</strong> {{ vlasnik.Prezime_vlasnika }}</div>
        <div><strong>Email:</strong> {{ vlasnik.Email_vlasnika }}</div>
        <div><strong>Korisničko ime:</strong> {{ vlasnik.Korisnicko_ime }}</div>
      </q-card-section>

      <q-separator />

      <!-- Kartice objekata -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Moji objekti</div>

        <div v-if="objekti.length === 0">
          Nemate evidentiranih objekata.
        </div>

        <div class="row justify-start items-start q-gutter-lg" v-else>
          <q-card
            v-for="obj in objekti"
            :key="obj.ID_objekta"
            class="my-card cafe-card"
            flat
            bordered
          >
            <q-img :src="obj.Slika || 'src/assets/default.jpg'" class="card-img" />

            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">{{ obj.Ime_objekta }}</div>
                <div class="col-auto text-grey text-caption">{{ obj.Adresa_objekta }}</div>
              </div>

              <div class="text-caption text-grey">{{ obj.Tip_objekta }}</div>

              <q-rating
                :model-value="obj.prosjecna_ocjena || 0"
                max="5"
                size="22px"
                readonly
                class="q-mt-xs"
              />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-caption text-grey">{{ obj.Opis_objekta }}</div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const vlasnik = ref({})
const objekti = ref([])
const error = ref(null)

onMounted(async () => {
  try {
    // Dohvat tokena iz localStorage
    const token = JSON.parse(localStorage.getItem('token'))
    if (!token || !token.id) {
      error.value = 'Vlasnik nije prijavljen'
      return
    }

    const vlasnikId = token.id

    // Dohvat profila vlasnika
    const response = await axios.get(`http://localhost:3000/vlasnik/profil/${vlasnikId}`)
    vlasnik.value = response.data.vlasnik
    objekti.value = response.data.objekti
  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju profila vlasnika.'
  }
})
</script>

<style scoped>
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

.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
