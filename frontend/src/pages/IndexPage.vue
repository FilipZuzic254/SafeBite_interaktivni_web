<!-- Petra Grgić, Matea Lesica -->
<template>
  <!-- glavna stranica -->
  <q-page class="home-page">

    <!-- split screen -->
    <section class="hero row no-wrap">

      <!-- lijevo ide logo-->
      <!-- col-12 na mobitelu, col-md-6 na vecim ekranima -->
      <div class="col-12 col-md-6 flex flex-center left-side">
        <q-img
          src="src/assets/SafeBite.png"
          fit="contain"
          class="logo-img"
        />
      </div>

      <!-- desno idu opis i gumb -->
      <div class="col-12 col-md-6 flex items-center right-side">
        <div class="text-container">

          <!-- opis aplikacije -->
          <p class="description">
            Ne morate više pogađati što smijete jesti. <br><br>
            SafeBite vam omogućuje da pronađete ugostiteljske objekte prilagođene vašim prehrambenim intolerancijama i osobnim preferencijama.
            <br><br>
            <b>Jednostavno. Sigurno. Bez stresa.</b>
          </p>

          <!-- gumb koji scrolla na donju sekciju -->
          <q-btn
            label="Saznaj više"
            unelevated
            size="lg"
            class="q-mt-lg button"
            rounded
            @click="scrollToInfo"
          />
        </div>
      </div>
    </section>

    <!-- ref koristimo kako bismo mogli scrollati do ove sekcije -->
    <section ref="infoSection" class="info-section">

      <!-- Ttekst -->
      <div class="content">
        <h2>Vaš sljedeći siguran izbor</h2>
        <p>
          Istražite ugostiteljske objekte koji razumiju vaše potrebe. <br><br>
          Odaberite restorane ili kafiće i pronađite mjesta u kojima možete uživati bez brige.
        </p>
      </div>

      <!-- kartice sa restoranima i kaficima -->
      <div class="row justify-center q-mt-xl q-col-gutter-xl cards-wrapper">

        <!-- kartica restorani -->
        <div class="col-12 col-md-5">
          <q-card
            class="choice-card"
            clickable
            @click="$router.push('/restorani')"
          >
            <q-img
              src="src/assets/rijekarestoran.jpg"
              class="choice-img"
            >
              <!-- overlay s naslovom -->
              <div class="choice-overlay">
                <div class="choice-title">Restorani</div>
              </div>
            </q-img>
          </q-card>
        </div>

        <!-- kartica kafici -->
        <div class="col-12 col-md-5">
          <q-card
            class="choice-card"
            clickable
            @click="$router.push('/kafici')"
          >
            <q-img
              src="src/assets/kaficrijeka.jpg"
              class="choice-img"
            >
              <!-- overlay s naslovom -->
              <div class="choice-overlay">
                <div class="choice-title">Kafići</div>
              </div>
            </q-img>
          </q-card>
        </div>

      </div>
      
      <div class="spacing"></div>

      <!--NAŠE PREPORUKE ESTORANI/KAFIĆI-->
      <div class="content">
      <h4>Naše preporuke:</h4>
      <div class="q-pa-md">
        <q-carousel 
          v-model="slide"
          vertical
          transition-prev="slide-down"
          transition-next="slide-up"
          swipeable
          animated
          control-color="white"
          navigation-icon="radio_button_unchecked"
          navigation
          padding
          arrows
          class="bg-primary text-white rounded-borders show-arrows"
        >
        
          <q-carousel-slide
            v-for="r in restorani"
            :key="r.ID_objekta"
            :name="r.ID_objekta"
            class="column no-wrap flex-center"
          >
            <div class=" text-center">
              <h3 class="q-mt-sm">{{ r.naziv }}</h3>
              <p>{{ r.adresa }}</p>
              <p>{{ r.opis }}</p> <!-- tvoji komentari/restoran opisi -->
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      </div>

    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// reaktivne varijable
const restorani = ref([])
const infoSection = ref(null)

// funkcija za scroll do donjeg dijela stranica
const scrollToInfo = () => {
  infoSection.value?.scrollIntoView({
    behavior: 'smooth'
  })
}

const slide = ref(null)

// ID-evi restorana koje želiš prikazati
const trazeniID = [1, 3, 5, 6]

const api_url=import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    const res = await axios.get(`${api_url}/objekti`)

    // filtriramo samo odabrane i dodajemo opis fallback
    restorani.value = res.data
      .filter(r => trazeniID.includes(r.ID_objekta))
      .map(r => ({
        ...r,
        naziv: r.Ime_objekta || '',
        adresa: r.Adresa_objekta || '',
        opis: r.Opis_objekta || ''
      }))


    console.log(restorani.value)
    if (restorani.value.length > 0) slide.value = restorani.value[0].ID_objekta
  } catch (err) {
    console.error('Greška pri dohvaćanju restorana:', err)
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
}

.hero {
  width: 100%;
  height: 100vh;
}

// lijeva strana
.left-side {
  background-color: #ffffff;
}

// logo
.logo-img {
  width: 75%;
  max-width: 800px;
  min-width: 200px;
}

// desna strana
.right-side {
  background-color: $primary; //zadan u main layoutu
  padding: 80px;
  color: white;
}

.button {
  color: $primary;
  background-color: #ffffff;
}

.text-container {
  max-width: 500px;
  text-align: left;
}

.description {
  font-size: 22px;
  line-height: 1.7;
}

.info-section {
  min-height: 100vh;
  padding: 80px 20px;
  background-color: #ffffff;
}

.content {
  max-width: 900px;
  margin: auto;
  text-align: center;
}

.content h2 {
  font-size: 36px;
  margin-bottom: 20px;
}

h4 {
  text-align: center;
  
}

/*RESPONSIVE*/
@media (max-width: 768px) {
  .hero {
    flex-wrap: wrap;
  }

  .right-side {
    padding: 40px 20px;
  }

  .description {
    font-size: 18px;
  }
}

.cards-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/*KARTICA*/
.choice-card {
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.choice-card:hover {
  transform: scale(1.03);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

/*SLIKA*/
.choice-img {
  height: 320px;
}

/*OVERLAY*/
.choice-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

/*NASLOV*/
.choice-title {
  color: white;
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 1px;
}

.spacing {
  margin-bottom: 150px;
}

.show-arrows .q-carousel__control {
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: all !important;
}
</style>
