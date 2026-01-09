<template>
  <q-page class="home-page">

    <!-- SPLIT SCREEN -->
    <section class="hero row no-wrap">

      <!-- LIJEVO – LOGO -->
      <div class="col-12 col-md-6 flex flex-center left-side">
        <q-img
          src="src/assets/SafeBite.png"
          fit="contain"
          class="logo-img"
        />
      </div>

      <!-- DESNO – TEKST -->
      <div class="col-12 col-md-6 flex items-center right-side">
        <div class="text-container">
          <p class="description">
           Ne morate više pogađati što smijete jesti. <br> <br>

          SafeBite vam omogućuje da pronađete ugostiteljske objekte prilagođene vašim prehrambenim intolerancijama i osobnim preferencijama.

          <br><br> <b> Jednostavno. Sigurno. Bez stresa. </b>
          </p>

          <q-btn
            label="Saznaj više"
            unelevated
            size="lg"
            class="q-mt-lg button"
            @click="scrollToInfo"
          />
        </div>
      </div>

    </section>

   <!-- DRUGI DIO STRANICE -->
<section ref="infoSection" class="info-section">
  <div class="content">
    <h2>Vaš sljedeći siguran izbor</h2>
    <p>
      Istražite ugostiteljske objekte koji razumiju vaše potrebe. <br> <br>
      Odaberite restorane ili kafiće i pronađite mjesta u kojima možete uživati bez brige.
    </p>
  </div>

  <!-- KARTICE -->
  <div class="row justify-center q-mt-xl q-col-gutter-xl cards-wrapper">

    <!-- RESTORANI -->
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
          <div class="choice-overlay">
            <div class="choice-title">Restorani</div>
          </div>
        </q-img>
      </q-card>
    </div>

    <!-- KAFIĆI -->
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
          <div class="choice-overlay">
            <div class="choice-title">Kafići</div>
          </div>
        </q-img>
      </q-card>
    </div>

  </div>
</section>


  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const infoSection = ref(null)

const scrollToInfo = () => {
  infoSection.value?.scrollIntoView({
    behavior: 'smooth'
  })
}
</script>

<style lang="scss" scoped>
/* FULL SCREEN */
.home-page {
  min-height: 100vh;
}

/* HERO */
.hero {
  width: 100%;
  height: 100vh;
}

/* LIJEVA STRANA */
.left-side {
  background-color: #ffffff;
}

/* LOGO */
.logo-img {
  width: 75%;
  max-width: 800px;
  min-width: 200px;
}

/* DESNA STRANA */
.right-side {
  background-color: $primary;
  padding: 80px;
  color: white;
}

.button {
  color: $primary;
  background-color: #ffffff;
}

/* TEKST */
.text-container {
  max-width: 500px;
  text-align: left;
}

.description {
  font-size: 22px;
  line-height: 1.7;
}

/* DRUGI DIO */
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

/* RESPONSIVE */
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

/* KARTICA */
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

/* SLIKA */
.choice-img {
  height: 320px;
}

/* OVERLAY */
.choice-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* NASLOV */
.choice-title {
  color: white;
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 1px;
}

</style>
