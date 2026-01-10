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
        <div><strong>Korisničko ime:</strong> {{ vlasnik.Korisnicko_ime }}</div>
      </q-card-section>

      <q-separator />

      <!-- Kartice poslovnih objekata -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Moji objekti</div>

        <!-- ako nema objekte -->
        <div v-if="objekti.length === 0">
          Nemate evidentiranih objekata.
        </div>

        <div class="row q-gutter-lg kartice">
          <q-card
            v-for="obj in objekti" 
            :key="obj.ID_objekta"
            class="my-card cafe-card-half"
            flat
            bordered
          > <!-- v-for je petlja koja prolazi kroz sve objekte vlasnika a key zahtjeva da je id isti kao id vlasnika-->
            
            <!-- prikazuje sliku objekta koja se povlaci iz baze podataka -->
            <q-img
              :src="obj.Slika_objekta
              ? 'http://localhost:3000' + obj.Slika_objekta
              : '/images/default.jpg'"
              class="card-img"
            />

            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6">{{ obj.Ime_objekta }}</div> <!-- naziv objekta-->
                <div class="col-auto text-grey text-caption">{{ obj.Adresa_objekta }}</div> <!-- adresa objekta -->
              </div>

              <div class="text-caption text-grey">{{ obj.Tip_objekta }}</div> <!-- tip objekta -->
              
              <!-- prosjecna ocjena objekta -->
              <q-rating
                :model-value="obj.prosjecna_ocjena || 0"
                max="5"
                size="22px"
                readonly
                class="q-mt-xs"
              />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-caption text-grey">{{ obj.Opis_objekta }}</div> <!-- opis objekta -->
            </q-card-section>
          </q-card>
        </div>

        <!-- Gumb za unos novog objekta -->
        <div class="q-mt-md flex justify-center"> <!-- srednje margine, centar -->
          <q-btn
            color="primary"
            label="Unos novog poslovnog objekta"
            icon="add"
            @click="dodajObjekt"
            rounded
          /> <!-- na klik poziva funkciju koja otvara stranicu za dodavanje novog objekta-->
        </div>

      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue' //reaktivna varijabla, izvrsavanje funkcije nakon montiranja komponente
import { useRouter } from 'vue-router'
import axios from 'axios' //za http zahtjeve prema backendu

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

</script>

<style scoped>
.cafe-card-half {
  width: calc(45%); /* dvije kartice jedna pored druge*/
  transition: transform 0.2s ease-in-out; /* tranzicija kada se prelazi preko kartice*/
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.cafe-card-half:hover {
  transform: scale(1.03); /* povecanje kartice kada se prede preko nje*/
}

.card-img {
  width: 100%;
  height: 300px;
  object-fit: cover; /* slika se prilagodava velicini kartice*/
}

.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.kartice {
    justify-content: space-around; /* jednaki raznaci izmedu kartica */
}
</style>
