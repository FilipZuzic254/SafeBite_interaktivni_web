<!-- Petra Grgić-->
<template>
  <q-page class="q-pa-md flex flex-center"> <!-- sadrzaj je uvijek centriran -->
    <q-card style="width: 900px"> <!-- kartica u kojoj se nalaze svi podatci -->

      <!--NASLOV -->
      <q-card-section>
        <div class="text-h5">Moj profil</div>
      </q-card-section>

      <q-separator /> <!-- linija koja dijeli sekcije -->

      <!-- Osnovni podaci o vlasniku -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Osnovni podaci</div>
        <div><strong>Ime:</strong> {{ vlasnik.Ime_vlasnika }}</div>
        <div><strong>Prezime:</strong> {{ vlasnik.Prezime_vlasnika }}</div>
        <div><strong>Email:</strong> {{ vlasnik.Email_vlasnika }}</div>
      </q-card-section>

      <q-separator />

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

  <q-card-section class="q-pt-none opis">
    <div class="text-caption">
      {{ obj.Opis_objekta }}
    </div>
  </q-card-section>

  <!-- GUMB NA DNU + STOP PROPAGATION -->
  <q-btn
    color="negative"
    label="Izbriši objekt"
    class="full-width q-mt-md"
    rounded
    @click.stop="confirmDelete(obj)"
  />
</q-card>
</div>
</div>
</q-card-section>
</q-card>

  </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue' //reaktivna varijabla, izvrsavanje funkcije nakon montiranja komponente
import { useRouter } from 'vue-router'
import {Notify, useQuasar} from 'quasar'
import axios from 'axios' //za http zahtjeve prema backendu

const $q = useQuasar()

const router = useRouter()
const vlasnik = ref({}) //objekt koji sadrzi podatke o vlasniku
const objekti = ref([]) //podatci o objektu (niz)
const error = ref(null) //greske

onMounted(async () => {
  try {
    const token = JSON.parse(localStorage.getItem('token')) //dohvaca tonek iz localStorage koji sadrzi ID_vlasnika
    if (!token || !token.id) {
      error.value = 'Vlasnik nije prijavljen' //ako nema tokena sa id onda se javlja greska
      return
    }

    const vlasnikId = token.id
    const response = await axios.get(`http://localhost:3000/vlasnik/profil/${vlasnikId}`) //zahtjev prema backendu za profil vlasnika i njegove objekte ovisno o id vlasnika
    vlasnik.value = response.data.vlasnik //rezultat se sprema u vlasnik
    objekti.value = response.data.objekti //rezultat se sprema u objekti
  } catch (err) {
    console.error(err)
    error.value = 'Greška pri dohvaćanju profila vlasnika.' //greska ako ne moze dohvatiti podatke
  }
})

//funkcija za otvaranje stranice za unos objekta
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

/* opis može rasti, gumb ide na dno */
.opis {
  flex-grow: 1;
}

</style>
