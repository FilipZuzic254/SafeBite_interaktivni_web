<!-- Elena Jašarević -->
<template>
  <div class="q-pa-md">
    <h1 class="naslov">{{ kafic.Ime_objekta }}</h1>
    <p class="citat">{{ kafic.Adresa_objekta }}</p>

    <div class="q-gutter-md">
      <q-card
        v-for="stavka in stavke"
        :key="stavka.ID_stavke"
        class="my-card stavka-card"
        flat
        bordered
      >
        <q-card-section>
          <div class="row justify-between items-center">
            <div class="text-h6">{{ stavka.Naziv_stavke }}</div>
            <div class="text-subtitle1">
              {{ stavka.Cijena_stavke }} €
            </div>
          </div>

          <!-- Opis -->
          <div class="text-caption text-grey">
            {{ stavka.Sastav_stavke }}
          </div>

          <!-- Prehrambene intolerancije -->
          <div v-if="stavka.intolerancije" class="q-mt-sm">
            <q-chip
              v-for="pi in stavka.intolerancije.split(', ')"
              :key="pi"
              color="red-2"
              text-color="red-9"
              dense
              icon="warning"
            >
              {{ pi }}
            </q-chip>
          </div>

        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const objektID = route.query.objektID;

const stavke = ref([]);
const kafic = ref({});

onMounted(async () => {
  try {
    // Podaci o objektu
    const kaficRes = await axios.get("http://localhost:3000/objekti", {
      params: { objektID }
    });
    kafic.value = kaficRes.data[0];

    // Jelovnik + intolerancije
    const res = await axios.get("http://localhost:3000/jelovnik", {
      params: { objektID }
    });
    stavke.value = res.data;

  } catch (err) {
    console.error("Greška pri dohvaćanju:", err);
  }
});
</script>

<style scoped>
.naslov {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 5px;
}

.citat {
  font-size: 20px;
  color: #555;
  margin-bottom: 30px;
}

.stavka-card {
  margin-bottom: 15px;
  padding: 15px;
  transition: transform 0.2s;
}

.stavka-card:hover {
  transform: scale(1.02);
}

.text-grey {
  color: #666;
}
</style>
