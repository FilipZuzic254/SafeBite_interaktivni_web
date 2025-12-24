<!-- Elena Jašarević -->
<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-parallax
        src="src/assets/rijeka.jpg"
        :height="550"
      />
    </q-card>
  </div>

  <div class="q-pa-md text-center naslov-container">
    <h1 class="naslov">Grad Rijeka</h1>
    <p class="citat">
      Rijeka je živahan hrvatski grad prepun šarmantnih kafića u kojima se uvijek može uživati u opuštenoj atmosferi i dobrom društvu.
    </p>
  </div>

  <!-- Kartice -->
  <div class="q-pa-md row justify-center items-start q-gutter-lg">

    <!-- KARTICA 1 -->
    <q-card class="my-card cafe-card" flat bordered>
      <q-img src="src/assets/kafic1.jpg" class="card-img" />

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Caffe Bar Nad Urom</div>
          <div class="col-auto text-grey text-caption">
            Korzo 10
          </div>
        </div>
        <q-rating :model-value="5" :max="5" size="22px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey">
          Popularno mjesto u centru grada za ispijanje kave i druženje.
        </div>
      </q-card-section>
    </q-card>

    <!-- KARTICA 2 -->
    <q-card class="my-card cafe-card" flat bordered>
      <q-img src="src/assets/kafic2.jpg" class="card-img" />

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Caffe Bar Fiume</div>
          <div class="col-auto text-grey text-caption">
            Riva 8
          </div>
        </div>
        <q-rating :model-value="4" :max="5" size="22px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey">
          Pogled na more i opuštena atmosfera u blizini luke.
        </div>
      </q-card-section>
    </q-card>

    <!-- KARTICA 3 -->
    <q-card class="my-card cafe-card" flat bordered>
      <q-img src="src/assets/kafic3.jpg" class="card-img" />

      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">King's Cafe</div>
          <div class="col-auto text-grey text-caption">
            Zvonimirova 5
          </div>
        </div>
        <q-rating :model-value="4.5" :max="5" size="22px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey">
          Savršeno mjesto za dobar espresso i slatki predah.
        </div>
      </q-card-section>
    </q-card>

    <!-- KARTICA 4 -->
<q-card class="my-card cafe-card" flat bordered>
  <q-img src="src/assets/kafic4.jpg" class="card-img" />

  <q-card-section>
    <div class="row no-wrap items-center">
      <div class="col text-h6 ellipsis">Cafe Venezia</div>
      <div class="col-auto text-grey text-caption">
        Trg Ivana Koblera 3
      </div>
    </div>
    <q-rating :model-value="4" :max="5" size="22px" />
  </q-card-section>

  <q-card-section class="q-pt-none">
    <div class="text-caption text-grey">
      Ugodno mjesto s talijanskim šarmom i domaćim kolačima.
    </div>
  </q-card-section>
</q-card>

<!-- KARTICA 5 -->
<q-card class="my-card cafe-card" flat bordered>
  <q-img src="src/assets/kafic5.jpg" class="card-img" />

  <q-card-section>
    <div class="row no-wrap items-center">
      <div class="col text-h6 ellipsis">Bistro Marina</div>
      <div class="col-auto text-grey text-caption">
        Obala 12
      </div>
    </div>
    <q-rating :model-value="5" :max="5" size="22px" />
  </q-card-section>

  <q-card-section class="q-pt-none">
    <div class="text-caption text-grey">
      Idealno mjesto za jutarnju kavu s pogledom na more.
    </div>
  </q-card-section>
</q-card>

<!-- KARTICA 6 -->
<q-card class="my-card cafe-card" flat bordered>
  <q-img src="src/assets/kafic6.jpg" class="card-img" />

  <q-card-section>
    <div class="row no-wrap items-center">
      <div class="col text-h6 ellipsis">Urban Coffee Hub</div>
      <div class="col-auto text-grey text-caption">
        Splitska 7
      </div>
    </div>
    <q-rating :model-value="4.5" :max="5" size="22px" />
  </q-card-section>

  <q-card-section class="q-pt-none">
    <div class="text-caption text-grey">
      Moderni interijer i vrhunska espresso ponuda u kafiću.
    </div>
  </q-card-section>
</q-card>

  </div>
</template>

<script setup>
</script>

<style scoped>
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
}

.cafe-card:hover {
  transform: scale(1.04);
}

/* Osiguraj iste dimenzije slika */
.card-img {
  width: 100%;
  height: 200px; /* možeš prilagoditi visinu po želji */
  object-fit: cover; /* slika će popuniti prostor bez izobličenja */
}
</style>
