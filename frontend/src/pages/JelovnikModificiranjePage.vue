<template>
  <div class="q-pa-md menu-wrapper">
    <!-- Naziv i adresa objekta -->
    <h1 class="naslov">{{ kafic.Ime_objekta }}</h1>
    <p class="citat">{{ kafic.Adresa_objekta }}</p>

    <!-- Gumb za dodavanje nove stavke jelovnika -->
    <div class="q-mb-md text-center">
      <q-btn
        color="primary"
        text-color="white"
        label="Dodaj novu stavku jelovnika"
        rounded
        @click="dodajNovuStavku"
      />
    </div>

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

          <div class="stavka-opis">{{ stavka.Sastav_stavke }}</div>

          <div v-if="stavka.intolerancije" class="intolerancije-wrapper">
            <span
              v-for="pi in stavka.intolerancije.split(', ')"
              :key="pi"
              class="intolerancija-badge"
            >
              {{ pi }}
            </span>
          </div>

          <!-- Gumbi Uredi i Izbriši -->
          <div class="q-mt-md q-gutter-sm button-wrapper">
            <q-btn
              color="primary"
              text-color="white"
              label="Uredi"
              rounded
              @click="urediStavku(stavka)"
            />
            <q-btn
              color="negative"
              text-color="white"
              label="Izbriši"
              rounded
              @click="confirmDelete(stavka)"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notify, useQuasar } from "quasar";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const objektID = Number(route.query.objektID);
const stavke = ref([]);
const kafic = ref({});
const komentari = ref([]);

// ----------------------
// Dohvat podataka korisnika
// ----------------------
const korisnikID = ref(null);
const korisnikIme = ref("");

onMounted(() => {
  const storedUserID = localStorage.getItem("userID");
  const storedUserName = localStorage.getItem("userName");

  if (storedUserID) korisnikID.value = Number(storedUserID);
  if (storedUserName) korisnikIme.value = storedUserName;
});

// ----------------------
// Dohvat objekta, jelovnika i komentara
// ----------------------
const loadPodaci = async () => {
  try {
    const kaficRes = await axios.get("http://localhost:3000/objekti", {
      params: { objektID }
    });
    kafic.value = kaficRes.data[0];

    const res = await axios.get("http://localhost:3000/jelovnik", {
      params: { objektID }
    });
    stavke.value = res.data;

    await loadKomentari();
  } catch (err) {
    console.error(err);
  }
};

onMounted(loadPodaci);

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
// Funkcija za Uredi
// ----------------------
function urediStavku(stavka) {
  router.push({
    path: "/uredivanjeJela",
    query: { ID_stavke: stavka.ID_stavke }
  });
}

// ----------------------
// Funkcija za potvrdu brisanja
// ----------------------
function confirmDelete(stavka) {
  $q.dialog({
    title: "Potvrda brisanja",
    message: `Jeste li sigurni da želite izbrisati stavku "${stavka.Naziv_stavke}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteStavku(stavka.ID_stavke);
  });
}

// ----------------------
// Funkcija za brisanje stavke iz baze
// ----------------------
const deleteStavku = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/jelovnici/${id}`);
    stavke.value = stavke.value.filter(st => st.ID_stavke !== id);

    Notify.create({
      type: "positive",
      message: "Stavka jelovnika je uspješno obrisana"
    });
  } catch (err) {
    console.error(err);
    Notify.create({
      type: "negative",
      message: "Greška pri brisanju stavke"
    });
  }
};

// ----------------------
// Funkcija za dodavanje nove stavke
// ----------------------
function dodajNovuStavku() {
  router.push({
    path: "/unosJela",
    query: { objektID } // šaljemo ID objekta da se zna gdje dodati
  });
}
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

.button-wrapper { display: flex; justify-content: center; gap: 12px; margin-top: 10px; }

.svi-komentari { margin-top: 60px; }
.komentar-naslov { text-align: center; font-size: 26px; margin-bottom: 20px; font-weight: 500; }
.komentar-item { margin-bottom: 12px; border-radius: 12px; padding: 10px; }
.komentar-user { font-weight: 600; margin-bottom: 6px; }
.komentar-ocjena { font-weight: 400; color: #2e7d32; }
.komentar-text { color: #555; }
</style>
