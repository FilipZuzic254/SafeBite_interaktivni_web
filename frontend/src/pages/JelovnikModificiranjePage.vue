<!-- Petra Grgić, Elena Jašarević -->
<template>
  <!-- glavni wrapper stranice -->
  <div class="q-pa-md menu-wrapper">

    <!-- naziv i adresa objekta -->
    <!-- Podaci se dohvaćaju s backenda i spremaju u objekt "objekt" -->
    <h1 class="naslov">{{ objekt.Ime_objekta }}</h1>
    <p class="citat">{{ objekt.Adresa_objekta }}</p>

    <!--gumb za dodavanje nove stavke jelovnika -->
    <div class="q-mb-md text-center">
      <q-btn
        color="primary"
        text-color="white"
        label="Dodaj novu stavku jelovnika"
        rounded
        class="q-mb-md"
        @click="dodajNovuStavku"
      />
    </div>

    <!-- jelovnik -->
    <div class="q-gutter-md">

      <!-- petlja prolazi kroz sve stavke jelovnika -->
      <q-card
        v-for="stavka in stavke"
        :key="stavka.ID_stavke"
        class="stavka-card"
        flat
        bordered
      >
        <q-card-section>

          <!-- naziv i cijena stavke -->
          <div class="stavka-header">
            <div class="stavka-naziv">
              {{ stavka.Naziv_stavke }}
            </div>
            <div class="stavka-cijena">
              {{ stavka.Cijena_stavke }} €
            </div>
          </div>

          <!-- Opis / sastav stavke -->
          <div class="stavka-opis">
            {{ stavka.Sastav_stavke }}
          </div>

          <!-- prehrambene intolerancije u stavci jelovnika -->
          <!-- ako postoje, string se dijeli po ", " -->
          <div v-if="stavka.intolerancije" class="intolerancije-wrapper">
            <span
              v-for="pi in stavka.intolerancije.split(', ')"
              :key="pi"
              class="intolerancija-badge"
            >
              {{ pi }}
            </span>
          </div>

          <!-- gumbi uredi i izbrisi -->
          <div class="q-mt-md q-gutter-sm button-wrapper flex flex-center">
            <!-- uredi stavku otvara stranicu sa popunjenim obrascem za uredivanje-->
            <q-btn
              color="primary"
              text-color="white"
              label="Uredi"
              rounded
              @click="urediStavku(stavka)"
            />

            <!-- izbrisi stavku -->
            <q-btn
              color="negative"
              text-color="white"
              label="Izbriši"
              rounded
              @click="confirmDelete(stavka)"
            />
          </div>

        </q-card-section>
      </q-card>
    </div>

    <!-- komentari korisnika -->
    <div class="svi-komentari q-mt-lg">
      <h3 class="komentar-naslov">Komentari korisnika</h3>

      <!-- prikaz svih komentara -->
      <q-card
        v-for="kom in komentari"
        :key="kom.ID_komentara"
        class="komentar-item"
        flat
        bordered
      >
        <q-card-section>

          <!-- ime korisnika i ocjena -->
          <div class="komentar-user">
            {{ kom.Ime_korisnika }} {{ kom.Prezime_korisnika }}
            <span class="komentar-ocjena">
              ({{ kom.Ocjena }}/5)
            </span>
          </div>

          <!-- sadrzaj komentara -->
          <div class="komentar-text">
            {{ kom.Sadrzaj_komentara }}
          </div>

          <!-- brisanje komentara SAMO ADMIN -->
          <!-- gumb se prikazuje samo ako je isAdmin = true -->
          <div v-if="isAdmin" class="q-mt-md text-center">
            <q-btn
              color="negative"
              text-color="white"
              label="Izbriši komentar"
              rounded
              @click="confirmDeleteKomentar(kom)"
            />
          </div>

        </q-card-section>
      </q-card>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Notify, useQuasar } from "quasar"
import axios from "axios"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

// id objekta iz urla
// primjer URL-a: /jelovnikModificiraj?objektID=5 
const objektID = Number(route.query.objektID)

// reaktivne varijable
const stavke = ref([])       // stavke jelovnika
const objekt = ref({})        // podaci o objektu
const komentari = ref([])    // komentari korisnika
const isAdmin = ref(false)   // kontrola admin funkcija

// provjera je li prijavljen admin 
const provjeriAdmin = () => {
  const tokenStr = localStorage.getItem("token")
  if (!tokenStr) return

  try {
    const token = JSON.parse(tokenStr)
    if (token.uloga === "admin") {
      isAdmin.value = true
    }
  } catch (err) {
    console.error("Neispravan token", err)
  }
}

// provjera admina odmah pri učitavanju
provjeriAdmin()

// dohvati objektab i jelovnika
const loadPodaci = async () => {
  try {
    // dohvat podataka o objektu
    const objektRes = await axios.get("http://localhost:3000/objekti", {
      params: { objektID }
    })
    objekt.value = objektRes.data[0]

    // dohvat stavki jelovnika
    const res = await axios.get("http://localhost:3000/jelovnik", {
      params: { objektID }
    })
    stavke.value = res.data

    // dohvat komentara
    await loadKomentari()
  } catch (err) {
    console.error(err)
  }
}

// dohvat komentara
const loadKomentari = async () => {
  try {
    const res = await axios.get("http://localhost:3000/komentari", {
      params: { ID_objekta: objektID }
    })
    komentari.value = res.data
  } catch (err) {
    console.error("Greška pri dohvatu komentara:", err)
  }
}

/* pokretanje dohvata nakon ucitavanja komponente */
onMounted(() => {
  loadPodaci()
})

// otvaranje stranice za uredivanje stavke jelovnika
function urediStavku(stavka) {
  router.push({
    path: "/uredivanjeJela",
    query: { ID_stavke: stavka.ID_stavke }
  })
}

// prozor za povrdu brisanja stavke koji kada se potvrdi pokrece funkciju za brisanj
function confirmDelete(stavka) {
  $q.dialog({
    title: "Potvrda brisanja",
    message: `Jeste li sigurni da želite izbrisati stavku "${stavka.Naziv_stavke}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => deleteStavku(stavka.ID_stavke))
}

// drisanje stavke jelovnika iz baze podataka
const deleteStavku = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/jelovnici/${id}`)

    // uklanjanje iz liste bez ponovnog ucitavanja
    stavke.value = stavke.value.filter(st => st.ID_stavke !== id)

    Notify.create({
      type: "positive",
      message: "Stavka jelovnika je uspješno obrisana"
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: "negative",
      message: "Greška pri brisanju stavke"
    })
  }
}


// SAMO ADMIN
// prozor za potvrdu brisanja komentara koji kada se potvrdi pokrece funkciju za brisanje komentara
function confirmDeleteKomentar(kom) {
  $q.dialog({
    title: "Potvrda brisanja",
    message: `Jeste li sigurni da želite izbrisati komentar od "${kom.Ime_korisnika}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => deleteKomentar(kom.ID_komentara))
}

// brisanje komentara
const deleteKomentar = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/komentari/${id}`)

    komentari.value = komentari.value.filter(
      k => k.ID_komentara !== id
    )

    Notify.create({
      type: "positive",
      message: "Komentar je uspješno obrisan"
    })
  } catch (err) {
    console.error(err)
    Notify.create({
      type: "negative",
      message: "Greška pri brisanju komentara"
    })
  }
}

// dodavanje nove stavke
function dodajNovuStavku() {
  router.push({
    path: "/unosJela",
    query: { objektID }
  })
}
</script>

<style scoped>
.menu-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.naslov {
  text-align: center;
  font-size: 46px;
  font-weight: 700;
  margin-bottom: 6px;
}

.citat {
  text-align: center;
  color: #777;
  margin-bottom: 40px;
}

.stavka-card {
  max-width: 600px;
  margin: 0 auto 20px auto;
  border-radius: 20px;
  padding: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stavka-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.stavka-header {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 6px;
}

.stavka-naziv {
  font-size: 22px;
  font-weight: 600;
}

.stavka-cijena {
  font-size: 20px;
  font-weight: 600;
  color: #2e7d32;
}

.stavka-opis {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.intolerancije-wrapper {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.intolerancija-badge {
  background: #2e7d32;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.svi-komentari {
  margin-top: 60px;
}

.komentar-naslov {
  text-align: center;
  font-size: 26px;
  margin-bottom: 20px;
  font-weight: 500;
}

.komentar-item {
  margin-bottom: 12px;
  border-radius: 12px;
  padding: 10px;
}

.komentar-user {
  font-weight: 600;
  margin-bottom: 6px;
}

.komentar-ocjena {
  font-weight: 400;
  color: #2e7d32;
}

.komentar-text {
  color: #555;
}
</style>
