<!--Matea Lesica-->
<template>
  <!-- razmak od vrha stranice -->
  <div class="q-pa-xl" style="padding-top: 30px;"></div>

  <!-- slika Rijeke -->
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-parallax src="src/assets/rijeka.jpg" :height="450" />
    </q-card>
  </div>

  <!-- naslov i citat -->
  <div class="q-pa-md text-center naslov-container">
    <h1 class="naslov">Grad Rijeka</h1>
    <p class="citat">
     “Mjesta gdje razgovori traju dulje od obroka.”
    </p>
  </div>

  <!-- razmak između sekcija -->
  <div class="custom-space"></div>

  <!-- kartice restorana -->
  <div class="q-pa-md row justify-center items-start q-gutter-lg">

    <!-- Destino -->
    <q-card class="cafe-card" flat bordered>
      <q-img src="src/assets/destino.jpg" height="180px" />
      <q-card-section>
        <q-btn fab color="primary" icon="place" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);" />
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Destino</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" /> 250 ft
          </div>
        </div>
        <q-rating v-model="stars" :max="5" size="22px" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">$ ・ Italian, Cafe</div>
        <div class="text-caption text-grey">
          Small plates, salads & sandwiches.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat color="primary">Reserve</q-btn>
      </q-card-actions>
    </q-card>

    <!-- Cafe Basilico -->
    <q-card class="cafe-card" flat bordered>
      <q-img src="src/assets/san.jpg" height="180px" />
      <q-card-section>
        <q-btn fab color="primary" icon="place" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);" />
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">San Servolo</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" /> 300 ft
          </div>
        </div>
        <q-rating v-model="stars" :max="5" size="22px" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">$ ・ Italian, Cafe</div>
        <div class="text-caption text-grey">
          Classic Italian dishes in a cozy environment.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat color="primary">Reserve</q-btn>
      </q-card-actions>
    </q-card>

    <!-- El Rio -->
    <q-card class="cafe-card" flat bordered>
      <q-img src="src/assets/el_rio.jpeg" height="180px" />
      <q-card-section>
        <q-btn fab color="primary" icon="place" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);" />
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">El Rio</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" /> 200 ft
          </div>
        </div>
        <q-rating v-model="stars" :max="5" size="22px" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">$$ ・ Spanish, Cafe</div>
        <div class="text-caption text-grey">
          Tapas and drinks with riverside view.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat color="primary">Reserve</q-btn>
      </q-card-actions>
    </q-card>

    <!-- Pampas -->
    <q-card class="cafe-card" flat bordered>
      <q-img src="src/assets/pampas.png" height="180px" />
      <q-card-section>
        <q-btn fab color="primary" icon="place" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);" />
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Pampas</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" /> 150 ft
          </div>
        </div>
        <q-rating v-model="stars" :max="5" size="22px" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">$$ ・ Steakhouse</div>
        <div class="text-caption text-grey">
          Premium steaks and local wines.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat color="primary">Reserve</q-btn>
      </q-card-actions>
    </q-card>

    <!-- Capote Ole -->
    <q-card class="cafe-card" flat bordered>
      <q-img src="src/assets/capote.jpg" height="180px" />
      <q-card-section>
        <q-btn fab color="primary" icon="place" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);" />
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Capote Ole</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" /> 180 ft
          </div>
        </div>
        <q-rating v-model="stars" :max="5" size="22px" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">$ ・ Cafe</div>
        <div class="text-caption text-grey">
          Light bites and artisanal coffee.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat color="primary">Reserve</q-btn>
      </q-card-actions>
    </q-card>

    <!-- Bunker -->
    <q-card class="cafe-card" flat bordered>
      <q-img src="src/assets/bunker.jpg" height="180px" />
      <q-card-section>
        <q-btn fab color="primary" icon="place" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);" />
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Pampas</div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" /> 150 ft
          </div>
        </div>
        <q-rating v-model="stars" :max="5" size="22px" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">$$ ・ Steakhouse</div>
        <div class="text-caption text-grey">
          Premium steaks and local wines.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat color="primary">Reserve</q-btn>
      </q-card-actions>
    </q-card>

  </div>
</template>

<script setup>
import { ref } from "vue";

const stars = ref(4);
</script>

<style scoped>
/* razmak između sekcija */
.custom-space {
  height: 80px;
}

/* naslov i citat */
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
  font-family: "Trebuchet MS", sans-serif;
  max-width: 900px;
  margin: 25px auto;
  line-height: 1.6;
}

/* kartice restorana */
.cafe-card {
  width: 300px;
  transition: transform 0.2s ease-in-out;
  margin-bottom: 20px;
}

.cafe-card:hover {
  transform: scale(1.04);
}
</style>


