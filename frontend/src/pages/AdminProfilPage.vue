<!-- Petra Grgić -->
<template>
  <!-- q-page predstavlja jednu stranicu -->
  <!-- srednji padding, centriranje -->
  <q-page class="q-pa-md flex flex-center">

    <!-- glavna kartica koja sadrži cijeli sadržaj profila -->
    <q-card style="width: 1100px">

      <!-- naslov -->
      <q-card-section>
        <div class="text-h5">Moj profil</div>
      </q-card-section>

      <!-- linija koja razdvaja -->
      <q-separator />

      <!-- podatci -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Osnovni podaci</div>

        <!-- ispis podataka dohvacenih iz baze -->
        <div><strong>Ime:</strong> {{ admin.ime }}</div>
        <div><strong>Prezime:</strong> {{ admin.prezime }}</div>
        <div><strong>Korisničko ime:</strong> {{ admin.Ime_admina }}</div>
      </q-card-section>

      <q-separator />

      <!-- gumb za dodati novi objekt -->
      <q-card-section class="text-center">
        <q-btn
          color="primary"
          label="Unos novog poslovnog objekta"
          icon="add"
          rounded
          @click="dodajObjekt"
        />
        <!-- dlikom na gumb poziva se funkcija -->
      </q-card-section>

      <q-separator />

      <!-- prikaz svih objekata-->
      <q-card-section>
        <div class="text-subtitle1 q-mb-md">
          Svi restorani i kafići
        </div>

        <!-- ako nema objekata -->
        <div v-if="objekti.length === 0">
          Nema evidentiranih objekata.
        </div>

        <!-- ako objekti postoje -->
        <div v-else class="row q-col-gutter-lg">

          <!-- petlja koja prolazi kroz sve objekte -->
          <div
            v-for="obj in objekti"
            :key="obj.ID_objekta"
            class="col-12 col-md-6"
          >
            <!-- kartica jednog objekta -->
            <q-card
              class="objekt-card cursor-pointer"
              bordered
              @click="otvoriJelovnik(obj)"
            >
              <!-- slika objekta -->
              <!-- ako objekt ima sliku, koristi se slika s backenda -->
              <q-img
                :src="obj.Slika_objekta
                  ? api_url + obj.Slika_objekta
                  : '/images/default.jpg'"
                class="card-img"
              />

              <!-- osnovni podaci o objektu -->
              <q-card-section>
                <div class="row items-center justify-between">
                  <div class="text-h6">
                    {{ obj.Ime_objekta }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ obj.Tip_objekta }}
                  </div>
                </div>

                <div class="text-caption text-grey q-mt-xs">
                  {{ obj.Adresa_objekta }}
                </div>

                <!-- prosjecna ocjena objekta -->
                <q-rating
                  :model-value="obj.prosjecna_ocjena"
                  max="5"
                  readonly
                  size="20px"
                  color="amber"
                  class="q-mt-sm"
                />
              </q-card-section>

              <!-- opis objekta -->
              <q-card-section class="q-pt-none">
                <div class="text-caption">
                  {{ obj.Opis_objekta }}
                </div>
              </q-card-section>

              <!-- gumb za brisanje objekta -->
              <!-- .stop da klik na gumb ne otvori jelovnik -->
              <div class="row justify-center q-mt-md q-mb-md">
                <q-btn
                  color="negative"
                  label="Izbriši objekt"
                  rounded
                  @click.stop="confirmDelete(obj)"
                />
              </div>

            </q-card>
          </div>
        </div>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Notify, useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

// reaktivne varijable
const admin = ref({})       // podaci o adminu
const objekti = ref([])     // lista objekata
const error = ref(null)     // poruke o grešci


const api_url=import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    // dohvat tokena iz localStorage-a
    const token = JSON.parse(localStorage.getItem('token'))
    const adminId = token?.id

    // ako admin nije prijavljen
    if (!adminId) {
      error.value = 'Admin nije prijavljen'
      return
    }

    // API poziv za dohvat admin profila i objekata
    const response = await axios.get(
      `${api_url}/admin/profil/${adminId}`
    )

    // spremanje podataka u varijable
    admin.value = response.data.admin
    objekti.value = response.data.objekti

  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju admin profila.'
  }
})

// otvaranje stranice sa jelovnicima za admina
function otvoriJelovnik(obj) {
  router.push({
    path: '/jelovnikModificiraj',
    query: {
      objektID: obj.ID_objekta
    }
  })
}

// otvaranje stranice za dodavanje objekta
function dodajObjekt() {
  router.push('/unosObjekta')
}

// prozor za potvdu brisanja objekta koja na potvdu pokreće funkciju za brisanje objekta
const confirmDelete = (obj) => {
  $q.dialog({
    title: 'Potvrda brisanja',
    message: `Jeste li sigurni da želite izbrisati objekt "${obj.Ime_objekta}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteObjekt(obj.ID_objekta)
  })
}

// brisanje objekta iz baze podataka
const deleteObjekt = async (id) => {
  try {
    // API poziv za brisanje
    await axios.delete(`${api_url}/objekti/${id}`)

    // uklanjanje objekta iz liste bez ponovnog ucitavanja stranice
    objekti.value = objekti.value.filter(
      obj => obj.ID_objekta !== id
    )

    // obavijest o uspjehu
    Notify.create({
      type: 'positive',
      message: 'Poslovni objekt je uspješno obrisan'
    })

  } catch (err) {
    console.error(err)

    // obavijest o gresci
    Notify.create({
      type: 'negative',
      message: 'Greška pri brisanju poslovnog objekta'
    })
  }
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.objekt-card {
  transition: transform 0.2s ease-in-out;
}

.objekt-card:hover {
  transform: scale(1.03);
}

.card-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</style>
