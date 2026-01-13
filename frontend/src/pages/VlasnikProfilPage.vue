<!-- Petra Grgić -->
<template>
  <!-- jedna stranica -->
  <!-- centriran -->
  <q-page class="q-pa-md flex flex-center">

    <!-- glavna kartica u kojoj se nalazi cijeli profil vlasnika -->
    <q-card style="width: 900px">

      <!-- naslov -->
      <q-card-section>
        <div class="text-h5">Moj profil</div>
      </q-card-section>

      <q-separator />

      <!-- podatci -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Osnovni podaci</div>

        <!-- ispis podataka o vlasniku -->
        <div><strong>Ime:</strong> {{ vlasnik.Ime_vlasnika }}</div>
        <div><strong>Prezime:</strong> {{ vlasnik.Prezime_vlasnika }}</div>
        <div><strong>Email:</strong> {{ vlasnik.Email_vlasnika }}</div>
      </q-card-section>

      <q-separator />

      <!-- gumb za unos novog objekta -->
      <q-card-section class="text-center">
        <q-btn
          color="primary"
          label="Unos novog poslovnog objekta"
          icon="add"
          rounded
          @click="dodajObjekt"
        />
        <!-- klik vodi na stranicu za unos novog objekta -->
      </q-card-section>

      <q-separator />

      <!-- popis svih objekata vlasnika -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-md">
          Svi restorani i kafići
        </div>

        <!-- ako vlasnik nema objekata -->
        <div v-if="objekti.length === 0">
          Nema evidentiranih objekata.
        </div>

        <!-- ako objekti postoje -->
        <div v-else class="row q-col-gutter-lg">

          <!-- petlja prolazi kroz sve objekte -->
          <div
            v-for="obj in objekti"
            :key="obj.ID_objekta"
            class="col-12 col-md-6"
          >

            <!-- kartica objekta koja se moze kliknuti -->
            <q-card
              class="objekt-card cursor-pointer"
              bordered
              @click="otvoriJelovnik(obj)"
            >

              <!-- slika objekta -->
              <!-- ako objekt ima sliku, koristi se backend URL -->
              <q-img
                :src="obj.Slika_objekta
                  ? 'http://localhost:3000' + obj.Slika_objekta
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

                <!-- prosjecna cijena objekta -->
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
              <q-card-section class="q-pt-none opis">
                <div class="text-caption">
                  {{ obj.Opis_objekta }}
                </div>
              </q-card-section>

              <!-- gumb za brisanje objekta -->
              <!-- .stop sprječava otvaranje jelovnika pri kliku -->
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
import { ref, onMounted } from 'vue'       // reaktivne varijable i lifecycle hook
import { useRouter } from 'vue-router'     // navigacija između stranica
import { Notify, useQuasar } from 'quasar' // dijalozi i notifikacije
import axios from 'axios'                  // HTTP zahtjevi prema backendu

const $q = useQuasar()
const router = useRouter()

// reaktivne varijable
const vlasnik = ref({})   // podaci o vlasniku
const objekti = ref([])   // niz objekata vlasnika
const error = ref(null)   // poruke o grešci

onMounted(async () => {
  try {
    // dohvat tokena iz localStorage-a
    const token = JSON.parse(localStorage.getItem('token'))

    // provjera je li vlasnik prijavljen
    if (!token || !token.id) {
      error.value = 'Vlasnik nije prijavljen'
      return
    }

    const vlasnikId = token.id

    // API poziv za dohvat profila vlasnika i njegovih objekata
    const response = await axios.get(
      `http://localhost:3000/vlasnik/profil/${vlasnikId}`
    )

    // spremanje podataka u reaktivne varijable
    vlasnik.value = response.data.vlasnik
    objekti.value = response.data.objekti

  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju profila vlasnika.'
  }
})

// otvaranje stranice za dodavanje objekta
function dodajObjekt() {
  router.push('/unosObjekta')
}

// otvaranje stranice sa jelovnicima za vlasnika
function otvoriJelovnik(obj) {
  router.push({
    path: '/jelovnikModificiraj',
    query: {
      objektID: obj.ID_objekta
    }
  })
}

// prozot za potvrdu brisanja objekta koja nakon potvrde pokrece funkciju za brisanje
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
    // API poziv za brisanje objekta
    await axios.delete(`http://localhost:3000/objekti/${id}`)

    // uklanjanje objekta iz liste bez ponovnog učitavanja
    objekti.value = objekti.value.filter(
      obj => obj.ID_objekta !== id
    )

    // obavijest o uspjesnom brisanju
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
.objekt-card {
  height: 100%;
  display: flex;
  flex-direction: column;
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

.opis {
  flex-grow: 1;
}
</style>
