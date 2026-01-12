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
          <div class="stavka-header">
            <div class="stavka-naziv">{{ stavka.Naziv_stavke }}</div>
            <div class="stavka-cijena">{{ stavka.Cijena_stavke }} €</div>
          </div>

          <div class="stavka-opis">
            {{ stavka.Sastav_stavke }}
          </div>

          <div v-if="stavka.intolerancije" class="intolerancije-wrapper">
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

    <!-- KOMENTARI -->
    <div class="komentar-wrapper">
      <h2 class="komentar-naslov">Ostavite komentar</h2>

      <q-card class="komentar-card" flat bordered>
        <q-card-section>
          <q-input
            v-model="noviKomentar.sadrzaj"
            type="textarea"
            label="Vaš komentar"
            outlined
            autogrow
          />

          <q-select
            v-model="noviKomentar.ocjena"
            :options="[1,2,3,4,5]"
            label="Ocjena"
            outlined
            class="q-mt-md"
          />

          <q-btn
            label="Pošalji komentar"
            color="green"
            class="q-mt-lg full-width"
            @click="posaljiKomentar"
          />
        </q-card-section>
      </q-card>

      <!-- Prikaz svih komentara -->
      <div class="svi-komentari q-mt-lg">
        <h3 class="komentar-naslov">Komentari korisnika</h3>
        <q-card
          v-for="kom in komentari"
          :key="kom.ID_komentara"
          class="komentar-item"
          flat
          bordered
        >
          <q-card-section>
            <div class="komentar-user">
              {{ kom.Ime_korisnika }} {{ kom.Prezime_korisnika }}
              <span class="komentar-ocjena">({{ kom.Ocjena }}/5)</span>
            </div>
            <div class="komentar-text">{{ kom.Sadrzaj_komentara }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const objektID = Number(route.query.objektID);

const stavke = ref([]);
const kafic = ref({});

// Komentari
const komentari = ref([]);

const noviKomentar = ref({
  sadrzaj: "",
  ocjena: null
});

// ----------------------
// Čitanje korisnika iz localStorage
// ----------------------
const korisnikID = ref(null);
onMounted(() => {
  const storedUser = localStorage.getItem("userID"); // mora odgovarati ključu iz login-a
  if (storedUser) {
    korisnikID.value = Number(storedUser);
  }
});

// ----------------------
// Dohvat jelovnika i objekta
// ----------------------
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

    // Dohvat komentara
    await loadKomentari();

  } catch (err) {
    console.error(err);
  }
});

// ----------------------
// Funkcija za dohvat komentara
// ----------------------
const loadKomentari = async () => {
  try {
    const res = await axios.get("http://localhost:3000/komentari", {
      params: { ID_objekta: objektID }
    });
    komentari.value = res.data;
  } catch (err) {
    console.error("Greška pri dohvatu komentara:", err);
  }
};

// ----------------------
// Slanje komentara
// ----------------------
const posaljiKomentar = async () => {
  if (!korisnikID.value) {
    alert("Morate biti prijavljeni da biste ostavili komentar.");
    return;
  }

  if (!noviKomentar.value.sadrzaj || !noviKomentar.value.ocjena) {
    alert("Molimo unesite komentar i ocjenu.");
    return;
  }

  try {
    await axios.post("http://localhost:3000/komentari", {
      Sadrzaj_komentara: noviKomentar.value.sadrzaj,
      Ocjena: noviKomentar.value.ocjena,
      ID_korisnika: korisnikID.value,
      ID_objekta: objektID
    });

    // Očisti formu
    noviKomentar.value.sadrzaj = "";
    noviKomentar.value.ocjena = null;

    alert("Komentar uspješno spremljen!");

    // Ponovno učitaj komentare
    await loadKomentari();
  } catch (err) {
    console.error("Greška backend:", err.response?.data || err.message);
    alert("Greška pri slanju komentara.");
  }
};
</script>

<style scoped>
.menu-wrapper { max-width: 800px; margin: 0 auto; }

.naslov { text-align: center; font-size: 46px; font-weight: 700; margin-bottom: 6px; }
.citat { text-align: center; color: #777; margin-bottom: 40px; }

.stavka-card { max-width: 600px; margin: 0 auto 20px auto; border-radius: 20px; padding: 18px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.stavka-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }

.stavka-header { display: flex; justify-content: center; gap: 16px; margin-bottom: 6px; }
.stavka-naziv { font-size: 22px; font-weight: 600; }
.stavka-cijena { font-size: 20px; font-weight: 600; color: #2e7d32; }

.stavka-opis { text-align: center; font-size: 14px; color: #666; margin-bottom: 12px; }

.intolerancije-wrapper { display: flex; justify-content: center; gap: 8px; margin-top: 10px; }
.intolerancija-badge { background: #2e7d32; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; }

.komentar-wrapper { margin-top: 60px; }
.komentar-naslov { text-align: center; font-size: 26px; margin-bottom: 20px; }
.komentar-card { max-width: 600px; margin: 0 auto; border-radius: 20px; }

.komentar-item { margin-bottom: 12px; border-radius: 12px; padding: 10px; }
.komentar-user { font-weight: 600; margin-bottom: 6px; }
.komentar-ocjena { font-weight: 400; color: #2e7d32; }
.komentar-text { color: #555; }
</style>
