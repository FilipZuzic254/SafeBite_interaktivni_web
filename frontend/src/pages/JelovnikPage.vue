<!-- Elena Jašarević-->
<template>
  <div class="q-pa-md menu-wrapper"> <!--quasar klasa za medium padding, menu wrapper je klasa za centralizaciju sadržaja-->
    <!-- Naziv i adresa objekta -->
    <h1 class="naslov">{{ kafic.Ime_objekta }}</h1> <!--dohvaća naziv iz kafica objekta-->
    <p class="citat">{{ kafic.Adresa_objekta }}</p> <!--prikazuje adresu objekta-->

    <!-- Jelovnik -->
    <!--q-gutter-md dodaje srednji razmak između karica
    v-for="stavka in stavke", iteracija kroz niz stavke (jelovnik kafića)
    :key="stavka.ID_stavke", jedinstveni ključ za svaku stavku 
    klasa za css uredivanje
    flat kartica bez sjene
    bordered znači da kartica ima rub-->
    <div class="q-gutter-md">
      <q-card
        v-for="stavka in stavke"
        :key="stavka.ID_stavke"
        class="stavka-card"
        flat
        bordered
      >
        <q-card-section> <!--sadržaj kartice-->
          <div class="stavka-header"> <!--naziv i cijena u jednom retku-->
            <div class="stavka-naziv">{{ stavka.Naziv_stavke }}</div> <!--naziv jela-->
            <div class="stavka-cijena">{{ stavka.Cijena_stavke }} €</div><!--cijena jela-->
          </div>

          <!--prikazuje opis stavke-->
          <div class="stavka-opis">{{ stavka.Sastav_stavke }}</div>

          <!--v-if prikazuje samo ako postoje intolerancije za tu stavku
          stavka.intolerancije.split(', ') pretvara string s listom intolerancija u niz
          intolerancija-badge je oznaka sa zelenom pozadinom i bijelim tekstom gdje je tekst intolerancije-->
          <div v-if="stavka.intolerancije" class="intolerancije-wrapper">
            
            <!--span je za inline sadržaj, unutar koda neka riječ npr.
            span prikazuje jednu intoleranciju-->
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
    <div class="komentar-wrapper"> <!--wrapper je za sekciju komentara-->
      <h2 class="komentar-naslov">Ostavite komentar</h2> <!--naslov-->


      <!--UNOS NOVOG KOMENTARA
      kartica za unos novog komentara
      q-card-section, unutrašnjost kartice, gdje stavljamo sadržaj
      q-input je textarea za unos teksta
      v-model="noviKomentar.sadrzaj" veže tekst koji korisnik napiše u našu varijablu noviKOmentar.sadrzaj
      kada korisnik upiše tekst automatski se sprema u tu varijablu
      type="textarea" veliko polje za tekst ne samo jedna linija
      outlined, polje ima obrub
      autogrow je da polje "raste" dok korisnik piše tekst-->
      <q-card class="komentar-card" flat bordered>
        <q-card-section>
          <q-input
            v-model="noviKomentar.sadrzaj"
            type="textarea"
            label="Vaš komentar"
            outlined
            autogrow
          />

          <!--ODABIR OCJENE 
          q-select je dropdown meni
          v-model="noviKomentar.ocjena" veže odabranu ocjenu od 1-5 u objekt noviKomentar
          :options="[1,2,3,4,5]", opcije za ocjenu
          label="Ocjena" prikazuje label iznad opcije za dropdown
          class="q-mt-md", razmak iznad (margin top)-->
          <q-select
            v-model="noviKomentar.ocjena"
            :options="[1,2,3,4,5]"
            label="Ocjena"
            outlined
            class="q-mt-md"
          />

          <!--GUMB ZA SLANJE KOMENTARA
          q-btn je quasar gumb
          label="Pošalji komentar", tekst na gumbu
          color green je da je gumb zelen
          class="q-mt-lg full-width", razmak iznad i da gumb puni cijelu širinu kartice
          @click je da kada se klikne pokrece se funckija posaljiKomentar-->
          <q-btn
            label="Pošalji komentar"
            color="green"
            class="q-mt-lg full-width"
            rounded
            @click="posaljiKomentar"
          />
        </q-card-section>
      </q-card>

      <!-- PRIKAZ SVIH KOMENTARA
        <div class="svi-komentari q-mt-lg">, odlomak gdje su svi komentari
          q-mt-lg je razmak od vrha
          h3 naslov sekcije-->
      <div class="svi-komentari q-mt-lg">
        <h3 class="komentar-naslov">Komentari korisnika</h3>

        <!--JEDAN KOMENTAR IZGLED
        v-for="kom in komentari", prolazi kroz sve komentare koje imamo u nizu komentari
        :key="kom.ID_komentara", Vue treba jedinstveni ključ za svaki element u listi
        komentar-item, stil kartice 
        komentar-user, prikazuje ime, prezime i ocjenu korisnika
        komentar-text, tekst samog komentara-->
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
import { ref, onMounted } from "vue"; //ref stvara reaktivne varijable, kada se promjene vue automatski ažurira stranicu, onMOunted se pokreće kada se komponenta učita
import { useRoute } from "vue-router"; //useRoute služi da dobijemo parametre iz URL
import axios from "axios"; //axios je alat za slanje zahtjeva serveru

const route = useRoute();
const objektID = Number(route.query.objektID); //dohvaća ID kafica iz URL-a, Number pretvara iz stringa u broj

const stavke = ref([]); //niz svih svaki jelovnika 
const kafic = ref({}); //sve informacije o kafiću
const komentari = ref([]); //niz svih komentara za taj kafić

//varijabla u koju spremamo tekst i ocjenu koju korisnik upisuje
const noviKomentar = ref({
  sadrzaj: "",
  ocjena: null
});

// Čitanje korisnika iz localStorage
const korisnikID = ref(null);
const korisnikIme = ref("");


onMounted(() => { //dohvaca id i ime korisnika, ako je prijavljen:
  const storedUserID = localStorage.getItem("userID");// localstorage je mjesto gdje browser cuva podatke, npr. kad se korisnik prijavio
  const storedUserName = localStorage.getItem("userName");

  //korisnikID.value i korisnikIme.value su reaktivne vrijenosti koje vue prati
  if (storedUserID) korisnikID.value = Number(storedUserID);
  if (storedUserName) korisnikIme.value = storedUserName;
});

// DOHVAT PODATAKA KAFIĆA I JELOVNIKA
//prvo dohvaca informacije o kaficu, onda jelovnik
const loadPodaci = async () => {
  try {
    const kaficRes = await axios.get("http://localhost:3000/objekti", {//salje serveru da dobije podatke
      params: { objektID }
    });
    kafic.value = kaficRes.data[0];

    const res = await axios.get("http://localhost:3000/jelovnik", {
      params: { objektID }
    });
    stavke.value = res.data;

    //dohvaca i komentare
    await loadKomentari();
  } catch (err) {
    console.error(err);
  }
};

onMounted(loadPodaci);

//FUNKCIJA ZA DOHVAT KOMENTARA
//poziv servera da dobije sve komentare za ovaj kafic 
//spremaju se u komentari.value
//vue automatski prikazuju listu komentara
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


//FUNKCIJA ZA SLANJE KOMENTARA

const posaljiKomentar = async () => {
  
  //dohvaca token iz localstorega, token sadrzi ID korisnika
  const token = JSON.parse(localStorage.getItem('token'))
  
  const userId = token.id
  if (!userId) { //ako korisnik nije prijavljen ne može ostaviti komentar
    alert("Morate biti prijavljeni da biste ostavili komentar.");
    return;
  }

  //provjerava je li korisnik unesao tekst i ocjenu
  //ako nije javlja grešku
  if (!noviKomentar.value.sadrzaj || !noviKomentar.value.ocjena) {
    alert("Molimo unesite komentar i ocjenu.");
    return;
  }

  //ako je sve uredu šalje se post zahtjev serveru da spremi komentar
  //nakon uspjeha: prazni polja za komentar i ocjenu i prikazuje alert da je uspješno
  //ponovno dohvaca komentare da se novi odmah prikazu
  try {
    await axios.post("http://localhost:3000/komentari", {
      Sadrzaj_komentara: noviKomentar.value.sadrzaj, //dohvaca sadrzaj novog komentara
      Ocjena: noviKomentar.value.ocjena, //dohvaca sadrzaj ocjene
      ID_korisnika: userId,  
      ID_objekta: objektID
    });

    noviKomentar.value.sadrzaj = "";
    noviKomentar.value.ocjena = null;

    alert("Komentar uspješno spremljen!"); //potvrdni alert da je komentar uspjesno unesen
    await loadKomentari();
  } catch (err) {
    console.error("Greška backend:", err.response?.data || err.message);
    alert("Greška pri slanju komentara.");
  }
};
</script>

<style scoped>
.menu-wrapper {
   max-width: 800px; 
   margin: 0 auto; 
  }

.naslov { 
  text-align: center; 
  font-size: 46px; 
  font-weight: 700; 
  margin-bottom: 6px; 
}

.citat { 
  text-align: center; 
  color: #777; 
  margin-bottom: 40px; 
}

.stavka-card { 
  max-width: 600px; 
  margin: 0 auto 20px auto; 
  border-radius: 20px; 
  padding: 18px; 
  transition: transform 0.2s ease, box-shadow 0.2s ease; 
}


.stavka-card:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 12px 30px rgba(0,0,0,0.08); 
}

.stavka-header { 
  display: flex; 
  justify-content: center; 
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

.stavka-opis { 
  text-align: center; 
  font-size: 14px; 
  color: #666; 
  margin-bottom: 12px; 
}

.intolerancije-wrapper { 
  display: flex; 
  justify-content: center; 
  gap: 8px; 
  margin-top: 10px; 
}

.intolerancija-badge { 
  background: #2e7d32; 
  color: white; 
  padding: 6px 14px; 
  border-radius: 20px; 
  font-size: 12px; 
  font-weight: 500; 
}

.komentar-wrapper { 
  margin-top: 60px; 
}

.komentar-naslov { 
  text-align: center; 
  font-size: 26px; 
  margin-bottom: 20px; 
  font-weight: 500; 
}

.komentar-card { 
  max-width: 600px; 
  margin: 0 auto; 
  border-radius: 20px; 
  margin-bottom: 80px;
}

.komentar-item { 
  margin-bottom: 12px; 
  border-radius: 12px; 
  padding: 10px; 
}

.komentar-user { 
  font-weight: 600; 
  margin-bottom: 6px; 
}

.komentar-ocjena { 
  font-weight: 400; 
  color: #2e7d32; 
}

.komentar-text { 
  color: #555; 
}

</style>
