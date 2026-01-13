<!-- Ana Krišto -->
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleDrawer" />
        <q-space />

        <!-- Ime prijavljenog korisnika / vlasnika / admina -->
        <div v-if="token" class="q-mr-md text-weight-medium">
          {{ token.korIme }}
        </div>

        <!-- Logout gumb -->
        <q-btn
          v-if="token"
          flat
          dense
          icon="logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      v-model="leftDrawer"
      side="left"
      overlay
      :width="250"
      class="top-drawer"
      @click.stop
    >
      <q-list>
        <!-- Početna-->
        <q-item clickable v-ripple to="/">
          <q-item-section>Početna</q-item-section>
        </q-item>

        <!-- Profil korisnika – samo korisnik -->
        <q-item v-if="token && token.uloga === 'korisnik'" clickable v-ripple to="/profilKorisnik">
          <q-item-section>Profil</q-item-section>
        </q-item>

        <!-- Profil vlasnika – samo vlasnik -->
        <q-item v-if="token && token.uloga === 'vlasnik'" clickable v-ripple to="/profilVlasnik">
          <q-item-section>Profil</q-item-section>
        </q-item>

        <!-- Profil admina – samo admin -->
        <q-item v-if="token && token.uloga === 'admin'" clickable v-ripple to="/profilAdmin">
          <q-item-section>Profil</q-item-section>
        </q-item>

        <!-- Restorani -->
        <q-item v-if="token && (token.uloga === 'korisnik' || token.uloga === 'admin')" clickable v-ripple to="/restorani">
          <q-item-section>Restorani</q-item-section>
        </q-item>

        <!-- Kafići -->
        <q-item v-if="token && (token.uloga === 'korisnik' || token.uloga === 'admin')" clickable v-ripple to="/kafici">
          <q-item-section>Kafići</q-item-section>
        </q-item>

        <!-- Unos prehrambene intolerancije – admin -->
        <q-item v-if="token && token.uloga === 'admin'" clickable v-ripple to="/unosPI">
          <q-item-section>Unos prehrambene intolerancije</q-item-section>
        </q-item>

        <!-- Prijava dropdown – samo ako nije prijavljen -->
        <q-expansion-item v-if="!token" icon="login" label="Prijava" expand-separator>
          <q-list>
            <q-item clickable v-ripple to="/prijava/korisnik">Korisnik</q-item>
            <q-item clickable v-ripple to="/prijava/administrator">Administrator</q-item>
            <q-item clickable v-ripple to="/prijava/vlasnik">Vlasnik objekta</q-item>
          </q-list>
        </q-expansion-item>

        <!-- Registracija dropdown – samo ako nije prijavljen -->
        <q-expansion-item v-if="!token" icon="person_add" label="Registracija" expand-separator>
          <q-list>
            <q-item clickable v-ripple to="/registracija/korisnik">Korisnik</q-item>
            <q-item clickable v-ripple to="/registracija/administrator">Administrator</q-item>
            <q-item clickable v-ripple to="/registracija/vlasnik">Vlasnik objekta</q-item>
          </q-list>
        </q-expansion-item>

        <!-- Logout – ako je prijavljen -->
        <q-item v-if="token" clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Odjava</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- ZATAMNJENJE -->
    <div
      v-if="leftDrawer"
      class="overlay"
      @click="leftDrawer = false"
    ></div>

    <!-- CONTENT -->
    <q-page-container>
      <router-view />

      <!-- FOOTER -->
      <footer class="page-footer">
        <div class="footer-columns">
          <!-- Stupac 1: Kontakt -->
          <div class="footer-section">
            <strong>Kontakt</strong>
            <div>
              <q-icon name="mail" /> 
              <a href="mailto:safebite.gmail.com">safebite.gmail.com</a>
            </div>
            <div>
              <q-icon name="phone" /> 
              <span>+385 51 123 456</span>
            </div>
          </div>

          <!-- Stupac 2: Lokacija + copyright -->
          <div class="footer-section">
            <strong>Lokacija</strong>
            <div>
              <q-icon name="place" /> 
              <a href="https://www.google.com/maps/search/?api=1&query=Rijeka+Korzo+22" target="_blank">
                Rijeka, Korzo 22
              </a>
            </div>

            <!-- Licenca / copyright -->
            <div class="footer-bottom">
              © 2026 SafeBite. Sva prava pridržana.
            </div>
          </div>
        </div>
      </footer>

    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const leftDrawer = ref(false)
const router = useRouter()

const token = ref(JSON.parse(localStorage.getItem('token')) || null)

window.addEventListener('prijava', (event) => {
  token.value = event.detail
})

watchEffect(() => {
  const t = JSON.parse(localStorage.getItem('token'))
  token.value = t
})

function logout() {
  localStorage.removeItem('token')
  token.value = null
  router.push('/')
}

function toggleDrawer() {
  leftDrawer.value = !leftDrawer.value
}
</script>

<style lang="scss">
/* Sticky footer setup */
html, body, #q-app {
  height: 100%;
}

q-layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

q-page-container {
  flex: 1 0 auto; /* sadržaj raste, footer ostaje na dnu */
}

.page-footer {
  background-color: $primary; // koristi svoj $primary
  color: white;
  padding: 40px 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;

  .footer-columns {
    display: flex;
    justify-content: center; /* centriramo stupce */
    width: 100%;
    max-width: 900px;
    gap: 80px;
    flex-wrap: wrap; /* responsive */
    text-align: center;
  }

  .footer-section {
    flex: 1 1 250px; /* svaki stupac minimalno 250px */
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;

    strong {
      font-size: 1.2rem;
      margin-bottom: 8px;
    }

    a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
      &:hover {
        color: #ffeb3b;
        text-decoration: underline;
      }
    }

    q-icon {
      margin-right: 6px;
      vertical-align: middle;
    }

    .footer-bottom {
      margin-top: 16px;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.top-drawer {
  position: absolute;
  top: 0;
  height: auto;
  max-height: none;
  border-radius: 0 0 12px 0;
  z-index: 2000;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1500;
}
</style>
