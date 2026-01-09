<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card style="width: 700px">

      <!-- Naslov -->
      <q-card-section>
        <div class="text-h5">Moj profil</div>
      </q-card-section>

      <q-separator />

      <!-- Osnovni podaci -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Osnovni podaci</div>

        <div><strong>Ime:</strong> {{ korisnik.Ime_korisnika }}</div>
        <div><strong>Prezime:</strong> {{ korisnik.Prezime_korisnika }}</div>
        <div><strong>Email:</strong> {{ korisnik.Email_korisnika }}</div>
        <div><strong>Korisničko ime:</strong> {{ korisnik.Korisnicko_ime }}</div>
      </q-card-section>

      <q-separator />

      <!-- Prehrambene intolerancije -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Prehrambene intolerancije</div>

        <div v-if="intolerancije.length === 0">
          Korisnik nema evidentiranih intolerancija.
        </div>

        <q-chip
          v-for="(pi, index) in intolerancije"
          :key="index"
          color="primary"
          text-color="white"
          class="q-mr-sm q-mb-sm"
        >
          {{ pi.Naziv_pi || pi }} <!-- podrška za niz stringova ili objekata -->
        </q-chip>
      </q-card-section>

      <q-separator />

      <!-- Komentari -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Moji komentari</div>

        <div v-if="komentari.length === 0">
          Korisnik nema komentara.
        </div>

        <q-list bordered separator v-else>
          <q-item v-for="kom in komentari" :key="kom.ID_komentara">
            <q-item-section>
              <div class="text-weight-medium">
                {{ kom.Ime_objekta }}
              </div>

              <div class="q-mt-xs">
                {{ kom.Sadrzaj_komentara }}
              </div>

              <q-rating
                v-model="kom.Ocjena"
                max="5"
                size="18px"
                color="amber"
                readonly
                class="q-mt-xs"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// reaktivni podaci
const korisnik = ref({})
const intolerancije = ref([])
const komentari = ref([])
const error = ref(null)

onMounted(async () => {
  try {
    // Dohvat tokena iz localStorage
    const token = JSON.parse(localStorage.getItem('token'))
    if (!token || !token.id) {
      error.value = 'Korisnik nije prijavljen'
      return
    }

    const userId = token.id

    // Dohvat profila korisnika
    const response = await axios.get(
      `http://localhost:3000/korisnik/profil/${userId}`
    )

    korisnik.value = response.data.korisnik
    intolerancije.value = response.data.intolerancije
    komentari.value = response.data.komentari

  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju profila.'
  }
})
</script>

<style scoped>
.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
