<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawer = true" />
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

        <!-- Kafići – svi -->
        <q-item v-if="token && (token.uloga === 'korisnik' || token.uloga === 'admin')" clickable v-ripple to="/kafici">
          <q-item-section>Kafići</q-item-section>
        </q-item>

        <!--
        <q-item v-if="token && token.uloga === 'korisnik'" clickable v-ripple to="/unosKomentara">
          <q-item-section>Unos komentara</q-item-section>
        </q-item>
        -->
        <q-item v-if="token && token.uloga === 'korisnik'" clickable v-ripple to="/unosKomentara">
          <q-item-section>Unos komentara</q-item-section>
        </q-item>

        <!-- Unos jela – vlasnik i admin -->
        <q-item v-if="token && token.uloga === 'vlasnik'" clickable v-ripple to="/unosJela">
          <q-item-section>Unos jela</q-item-section>
        </q-item>

        <!-- Unos prehrambene intolerancije – admin -->
        <q-item v-if="token && token.uloga === 'admin'" clickable v-ripple to="/unosPI">
          <q-item-section>Unos prehrambene intolerancije</q-item-section>
        </q-item>


        <!--
        Brisanje komentara – samo admin
        <q-item v-if="token && token.uloga === 'admin'" clickable v-ripple to="/brisanjeKomentara">
          <q-item-section>Brisanje komentara</q-item-section>
        </q-item>
        -->


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

        <!-- Profil -->
        <q-item v-if="token" clickable v-ripple to="/profil">Profil</q-item>
        <q-item clickable v-ripple to="/profilKorisnik">
          <q-item-section>Profil Korisnik</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/profilVlasnik">
          <q-item-section>Profil Vlasnik</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/profilAdmin">
          <q-item-section>Profil Admin</q-item-section>
        </q-item>
        <!-- Logout – ako je prijavljen -->
        <q-item v-if="token" clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Odjava</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <!-- PRAVI FOOTER KOJI SE VIDI TEK KAD SE SKROLLA DO DNA -->
  <footer class="page-footer text-white">
    <div class="footer-content text-center">
      SafeBite
    </div>
  </footer>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const leftDrawer = ref(false)
const router = useRouter()

// Token koji prati localStorage
const token = ref(JSON.parse(localStorage.getItem('token')) || null)

// Event koji dolazi nakon login-a
window.addEventListener('prijava', (event) => {
  token.value = event.detail
})

// Sinkronizacija s localStorage
watchEffect(() => {
  const t = JSON.parse(localStorage.getItem('token'))
  token.value = t
})

// Logout funkcija
function logout() {
  localStorage.removeItem('token')
  token.value = null
  router.push('/')
}
</script>

<style lang="scss">
.top-drawer {
  position: absolute;
  top: 0;
  height: auto;
  max-height: none;
  border-radius: 0 0 12px 0;
}

.page-footer {
  background-color: $primary; // tvoja zelena #088e35
  padding: 16px 0;
  width: 100%;
}
</style>
