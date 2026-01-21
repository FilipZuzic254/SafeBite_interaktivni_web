<!-- Elena Jašarević-->
<template>
  <div class="q-pa-md"> <!--quasar klasa za "padding medium"-->
    <!--slika na vrhu stranice -->
    <q-card flat class="my-card">     <!--kartica nema sjenu -->
      <q-img src="src/assets/Kafici.png" :height="400" /> 
    </q-card>

    <!-- Naslov i citat -->
    <div class="q-pa-md text-center naslov-container">
      <p class="citat">
        “Kava je ritual, a kafić je mjesto gdje počinje dan s osmijehom.”     <!--citat na vrhu stranice -->
      </p>
    </div>

    <!-- Kartice kafića -->
    <div class="q-pa-md row justify-center items-start q-gutter-lg">
      <!-- koristi jedinstveni id objekta
       click preusmjerava korisnika na /jelovnik--> 
      <q-card
        v-for="kafic in kafici"   
        :key="kafic.ID_objekta"
        class="my-card cafe-card"
        flat
        bordered
        @click="$router.push({ path: '/jelovnik', query: { objektID: kafic.ID_objekta } })"
        style="cursor: pointer"
      >
      <!--ako kafic nema sliku koristi se '/images/default.jpg'--> 
        <q-img
          :src="kafic.Slika_objekta ? api_url + kafic.Slika_objekta : '/images/default.jpg'"
          class="card-img"
        />

      
        <q-card-section> <!--imena kafića i adresa kafića u jednom redu, neće se prelomiti, adresa kafića-->
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ kafic.Ime_objekta }}</div>        <!--ellipsis sprječava preljevanje teksta--> 
            <div class="col-auto text-grey text-caption">{{ kafic.Adresa_objekta }}</div>
          </div>
          
          <!--ZVJEZDICE OCJENE--> 
          <!--q-rating prikazuje prosječnu ocjenu--> 
          <!--|| 0 sprječava prikaz undefined--> 
          <q-rating :model-value="kafic.prosjecna_ocjena || 0" :max="5" size="22px" readonly />
        </q-card-section>

          <!--prikazuje opis kafića--> 
          <!--q-pt-none uklanja padding na vrhu sekcije -->
        <q-card-section class="q-pt-none">
          <div class="text-caption text-grey">{{ kafic.Opis_objekta }}</div> 
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

//ref inicijalizira prazan niz kafica
const kafici = ref([])


const api_url=import.meta.env.VITE_API_URL


//onMounted dohvaća podatke kada se komponenta učita
onMounted(async () => {
  try {
    const res = await axios.get(`${api_url}/objekti`, { //poziva se api /objekti
      params: { tip: 'Kafić' } //prikazuju se samo kafići na ovoj stranici, a on u apiju povlači sve objekte, ako zelimo sve samo maknemo skroz ljubicaste zagrade
    })
    kafici.value = res.data
  } catch (err) {
    console.error('Greška pri dohvaćanju kafića:', err)
  }
})
</script>


<style scoped>
/**scoped znači da se stilovi odnose samao na ovu komponentu */
.naslov-container {
  width: 100%;
  text-align: center;
  margin-top: 40px;
}

.naslov {
  font-size: 60px;
  font-family: "Georgia", serif;
  font-weight: bold;
  color: black;
  margin-bottom: 15px;
}

.citat {
  font-size: 22px;
  font-style: italic;
  color: #333;
  max-width: 900px;
  margin: 25px auto;
}

.cafe-card {
  width: 300px;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

/**povećava sliku kada se prijeđe preko nje*/
.cafe-card:hover {
  transform: scale(1.04);
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover; /**da se slika pravilno uklapa u karticu*/
}
</style>
