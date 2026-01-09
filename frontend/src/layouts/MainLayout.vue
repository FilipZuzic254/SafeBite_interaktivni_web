<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawer = true" />
        <q-space />
        <!-- Ime prijavljenog korisnika -->
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
      behavior="mobile"
      :width="250"
      breakpoint="9999"
      class="top-drawer"
    >
      <q-list>
        <!-- Početna -->
        <q-item clickable v-ripple to="/">
          <q-item-section>Početna</q-item-section>
        </q-item>

        <!-- Restorani -->
        <q-item clickable v-ripple to="/restorani">
          <q-item-section>Restorani</q-item-section>
        </q-item>

        <!-- Kafići -->
        <q-item clickable v-ripple to="/kafici">
          <q-item-section>Kafići</q-item-section>
        </q-item>

        <!-- Unos jela – admin + vlasnik -->
        <q-item
          v-if="token && (token.uloga === 'admin' || token.uloga === 'vlasnik')"
          clickable
          v-ripple
          to="/unosJela"
        >
          <q-item-section>Unos jela</q-item-section>
        </q-item>

        <!-- Unos prehrambene intolerancije -->
        <q-item clickable v-ripple to="/unosPI">
          <q-item-section>Unos prehrambene intolerancije</q-item-section>
        </q-item>

        <!-- Prijava dropdown -->
        <q-expansion-item v-if="!token" icon="login" label="Prijava" expand-separator>
          <q-list>
            <q-item clickable v-ripple to="/prijava/korisnik">Korisnik</q-item>
            <q-item clickable v-ripple to="/prijava/administrator">Administrator</q-item>
            <q-item clickable v-ripple to="/prijava/vlasnik">Vlasnik objekta</q-item>
          </q-list>
        </q-expansion-item>

        <!-- Registracija dropdown -->
        <q-expansion-item v-if="!token" icon="person_add" label="Registracija" expand-separator>
          <q-list>
            <q-item clickable v-ripple to="/registracija/korisnik">Korisnik</q-item>
            <q-item clickable v-ripple to="/registracija/administrator">Administrator</q-item>
            <q-item clickable v-ripple to="/registracija/vlasnik">Vlasnik objekta</q-item>
          </q-list>
        </q-expansion-item>

        <!-- Profil -->
        <q-item v-if="token" clickable v-ripple to="/profil">Profil</q-item>
      </q-list>
    </q-drawer>

    <!-- CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const leftDrawer = ref(false)
const router = useRouter()

// reactive token koji prati localStorage
const token = ref(JSON.parse(localStorage.getItem('token')) || null)
window.addEventListener('prijavaAdmin', (event) => {
  token.value = event.detail
})


console.log(token)
// watchEffect prati promjene u localStorage
watchEffect(() => {
  const t = JSON.parse(localStorage.getItem('token'))
  token.value = t
  console.log(token.value)
})

// logout
function logout() {
  localStorage.removeItem('token')
  token.value = null
  router.push('/')
}
</script>

<style>
.top-drawer {
  position: absolute;
  top: 0;
  height: auto;
  max-height: none;
  border-radius: 0 0 12px 0;
}
</style>
