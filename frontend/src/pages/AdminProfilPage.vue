<!-- Petra Grgić -->
<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card style="width: 1100px"> <!-- galvni dio stranice -->

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
          /> <!-- klikom se poziva metoda koja otvara stranicu za dodavanje objekta-->
    
      </q-card-section>

      <q-separator />

      <!-- SVI OBJEKTI -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-md">Svi restorani i kafići</div>

        <div v-if="objekti.length === 0">
          Nema evidentiranih objekata.
        </div>

        <div
          v-else
          class="row q-col-gutter-lg"
        >
          <div
            v-for="obj in objekti"
            :key="obj.ID_objekta"
            class="col-12 col-md-6"
          >
            <q-card class="objekt-card" bordered>

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
             <div class="row justify-center q-mt-md q-mb-md">
  <q-btn
    color="negative"
    label="Izbriši objekt"
    rounded
    @click.stop="confirmDelete(obj)"
  />
</div>
            </q-card>
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
import {Notify, useQuasar} from 'quasar'

const $q = useQuasar()

const router = useRouter() //za navigaciju
const admin = ref({})
const objekti = ref([])
const error = ref(null)

onMounted(async () => {
  try {
    // ID admina iz tokena
    const token = JSON.parse(localStorage.getItem('token'))
    const adminId = token?.id

    if (!adminId) {
      error.value = 'Admin nije prijavljen' //ako token ne postoji
      return
    }

    const response = await axios.get(
      `http://localhost:3000/admin/profil/${adminId}` //dohvat podataka iz api-ja
    )

    admin.value = response.data.admin //spreljeni podatci o adminu
    objekti.value = response.data.objekti //spremljeni podatci o objektima

  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju admin profila.'
  }
})

// 🔹 OTVARANJE STRANICE ZA MODIFICIRANJE JELOVNIKA
function otvoriJelovnik(obj) {
  router.push({
    path: '/jelovnikModificiraj',
    query: {
      objektID: obj.ID_objekta
    }
  })
}

 // funkcija za otvaranje stranice za unos novog objekta
function dodajObjekt() {
  router.push('/unosObjekta')
}

// funkcija za poruku o brisanju
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


 //funkcija za brisanje objekta iz baze
const deleteObjekt = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/objekti/${id}`)

    // ukloni objekt iz liste bez reloadanja
    objekti.value = objekti.value.filter(
      obj => obj.ID_objekta !== id
    )

    Notify.create({
      type: 'positive',
      message: 'Poslovni objekt je uspješno obrisan'
    })

  } catch (err) {
    console.error(err)

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


