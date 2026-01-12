<!-- Petra Grgić -->
<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card style="width: 1100px"> <!-- glavni dio stranice -->

      <!-- NASLOV -->
      <q-card-section>
        <div class="text-h5">Moj profil</div>
      </q-card-section>

      <q-separator />

      <!-- OSNOVNI PODACI -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Osnovni podaci</div>

        <div><strong>Ime:</strong> {{ admin.ime }}</div>
        <div><strong>Prezime:</strong> {{ admin.prezime }}</div>
        <div><strong>Korisničko ime:</strong> {{ admin.Ime_admina }}</div>
      </q-card-section>

      <q-separator />

      <!-- GUMB ZA DODAVANJE OBJEKTA -->
      <q-card-section class="text-center">
        <q-btn
          color="primary"
          label="Unos novog poslovnog objekta"
          icon="add"
          @click="dodajObjekt"
          rounded
        />
      </q-card-section>

      <q-separator />

      <!-- SVI OBJEKTI -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-md">Svi restorani i kafići</div>

        <div v-if="objekti.length === 0">
          Nema evidentiranih objekata.
        </div>

        <div v-else class="row q-col-gutter-lg">
          <div
            v-for="obj in objekti"
            :key="obj.ID_objekta"
            class="col-12 col-md-6"
          >
            <!-- KLIKABILNA KARTICA -->
            <q-card
              class="objekt-card cursor-pointer"
              bordered
              @click="otvoriJelovnik(obj)"
            >
              <q-img
                :src="obj.Slika_objekta
                  ? 'http://localhost:3000' + obj.Slika_objekta
                  : '/images/default.jpg'"
                class="card-img"
              />

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

                <q-rating
                  :model-value="obj.prosjecna_ocjena"
                  max="5"
                  readonly
                  size="20px"
                  color="amber"
                  class="q-mt-sm"
                />
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-caption">
                  {{ obj.Opis_objekta }}
                </div>
              </q-card-section>

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

const router = useRouter() // navigacija
const admin = ref({})
const objekti = ref([])
const error = ref(null)

onMounted(async () => {
  try {
    // ID admina iz tokena
    const token = JSON.parse(localStorage.getItem('token'))
    const adminId = token?.id

    if (!adminId) {
      error.value = 'Admin nije prijavljen'
      return
    }

    const response = await axios.get(
      `http://localhost:3000/admin/profil/${adminId}`
    )

    admin.value = response.data.admin
    objekti.value = response.data.objekti

  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju admin profila.'
  }
})

// otvara stranicu za unos novog objekta
function dodajObjekt() {
  router.push('/unosObjekta')
}

// 🔹 OTVARANJE STRANICE ZA MODIFICIRANJE JELOVNIKA
function otvoriJelovnik(obj) {
  router.push({
    path: '/jelovnikModificiraj',
    query: {
      objektID: obj.ID_objekta
    }
  })
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

.cursor-pointer {
  cursor: pointer;
}
</style>
