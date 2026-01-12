<!-- Elena Jašarević -->
<template>
  <div class="q-pa-md menu-wrapper">
    <!-- Naziv i adresa objekta -->
    <h1 class="naslov">{{ kafic.Ime_objekta }}</h1>
    <p class="citat">{{ kafic.Adresa_objekta }}</p>

    <!-- Jelovnik -->
    <div class="q-gutter-md">
      <q-card
        v-for="stavka in stavke"
        :key="stavka.ID_stavke"
        class="stavka-card"
        flat
        bordered
      >
        <q-card-section>
          <!-- Naziv + cijena -->
          <div class="stavka-header">
            <div class="stavka-naziv">{{ stavka.Naziv_stavke }}</div>
            <div class="stavka-cijena">
              {{ stavka.Cijena_stavke }} €
            </div>
          </div>

          <!-- Opis -->
          <div class="stavka-opis">
            {{ stavka.Sastav_stavke }}
          </div>

          <!-- Prehrambene intolerancije -->
          <div
            v-if="stavka.intolerancije"
            class="intolerancije-wrapper"
          >
            <span
              v-for="pi in stavka.intolerancije.split(', ')"
              :key="pi"
              class="intolerancija-badge"
            >
              {{ pi }}
            </span>
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
/* Wrapper */
.menu-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* Naslov */
.naslov {
  font-size: 46px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 6px;
}

/* Adresa */
.citat {
  font-size: 18px;
  color: #777;
  text-align: center;
  margin-bottom: 40px;
}

/* Kartica stavke */
.stavka-card {
  max-width: 600px;
  margin: 0 auto 20px auto;
  padding: 18px;
  border-radius: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stavka-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

/* Header stavke */
.stavka-header {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 6px;
}

.stavka-naziv {
  font-size: 22px;
  font-weight: 600;
}

.stavka-cijena {
  font-size: 20px;
  font-weight: 600;
  color: #2e7d32;
}

/* Opis */
.stavka-opis {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

/* Intolerancije */
.intolerancije-wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.intolerancija-badge {
  background-color: #2e7d32;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
}
</style>
