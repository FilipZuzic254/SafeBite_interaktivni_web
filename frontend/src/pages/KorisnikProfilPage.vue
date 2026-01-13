<!-- Petra Grgić -->
<template>
  <!-- q-page predstavlja jednu stranicu aplikacije -->
  <!-- centriranje sadržaja -->
  <q-page class="q-pa-md flex flex-center">

    <!-- Glavna kartica profila korisnika -->
    <q-card style="width: 700px">

      <!-- naslov -->
      <q-card-section>
        <div class="text-h5">Moj profil</div>
      </q-card-section>

      <q-separator />

      <!-- podatci -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Osnovni podaci</div>

        <!-- ispis podataka korisnika dohvaćenih s backenda -->
        <div><strong>Ime:</strong> {{ korisnik.Ime_korisnika }}</div>
        <div><strong>Prezime:</strong> {{ korisnik.Prezime_korisnika }}</div>
        <div><strong>Email:</strong> {{ korisnik.Email_korisnika }}</div>
        <div><strong>Korisničko ime:</strong> {{ korisnik.Korisnicko_ime }}</div>
      </q-card-section>

      <q-separator />

      <!-- prehrambene intolerancije korisnika -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">
          Prehrambene intolerancije
        </div>

        <!-- ako korisnik nema intolerancija -->
        <div v-if="intolerancije.length === 0">
          Korisnik nema evidentiranih intolerancija.
        </div>

        <!-- prikaz intolerancija pomocu chipova -->
        <q-chip
          v-for="(pi, index) in intolerancije"
          :key="index"
          color="primary"
          text-color="white"
          class="q-mr-sm q-mb-sm"
        >
          <!-- podrzava i niz stringova i niz objekata -->
          {{ pi.Naziv_pi || pi }}
        </q-chip>

        <!-- gumb za dodavanje nove intolerancije -->
        <div class="q-mt-md flex justify-center">
          <q-btn
            color="primary"
            label="Unos svojih prehrambenih intolerancija"
            icon="add"
            rounded
            @click="dodajIntoleranciju"
          />
          <!-- klik vodi na stranicu za unos intolerancija -->
        </div>
      </q-card-section>

      <q-separator />

      <!-- komentari korisnika -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Moji komentari</div>

        <!-- ako korisnik nema komentara -->
        <div v-if="komentari.length === 0">
          Korisnik nema komentara.
        </div>

        <!-- lista komentara -->
        <q-list bordered separator v-else>
          <q-item
            v-for="kom in komentari"
            :key="kom.ID_komentara"
          >
            <q-item-section>

              <!-- naziv objekta na koji se komentar odnosi -->
              <div class="text-weight-medium">
                {{ kom.Ime_objekta }}
              </div>

              <!-- sadrzaj komentara -->
              <div class="q-mt-xs">
                {{ kom.Sadrzaj_komentara }}
              </div>

              <!-- ocjena komentara -->
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
import { useRouter } from 'vue-router'
import axios from 'axios'

// reaktivne varijable
const router = useRouter()
const korisnik = ref({})         // podaci o korisniku
const intolerancije = ref([])   // lista intolerancija
const komentari = ref([])       // lista komentara
const error = ref(null)         // poruke o grešci


onMounted(async () => {
  try {
    // dohvat tokena iz localStorage-a
    const token = JSON.parse(localStorage.getItem('token'))

    // provjera je li korisnik prijavljen
    if (!token || !token.id) {
      error.value = 'Korisnik nije prijavljen'
      return
    }

    const userId = token.id

    // API poziv za dohvat profila korisnika
    const response = await axios.get(
      `http://localhost:3000/korisnik/profil/${userId}`
    )

    // spremanje podataka u reaktivne varijable
    korisnik.value = response.data.korisnik
    intolerancije.value = response.data.intolerancije
    komentari.value = response.data.komentari

  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju profila.'
  }
})

// otvaranje stranice za unos intolerancija
function dodajIntoleranciju() {
  router.push('/unosKorisnikPI')
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
