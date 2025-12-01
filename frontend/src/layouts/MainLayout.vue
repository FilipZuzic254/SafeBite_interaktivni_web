<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawer = true" />
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
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

        <!-- Unos jela -->
        <q-item clickable v-ripple to="/unosJela">
          <q-item-section>Unos jela</q-item-section>
        </q-item>

        <!-- Unos prehrambene intolerancije -->
        <q-item clickable v-ripple to="unosPI">
          <q-item-section>Unos prehrambene intolerancije</q-item-section>
        </q-item>

        <!-- Prijava dropdown -->
        <q-expansion-item icon="login" label="Prijava" expand-separator>
          <q-list>
            <q-item clickable v-ripple to="/prijava/korisnik">
              <q-item-section>Korisnik</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/prijava/administrator">
              <q-item-section>Administrator</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/prijava/objekt">
              <q-item-section>Poslovni objekt</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Registracija dropdown -->
        <q-expansion-item icon="person_add" label="Registracija" expand-separator>
          <q-list>
            <q-item clickable v-ripple to="/registracija/korisnik">
              <q-item-section>Korisnik</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/registracija/admin">
              <q-item-section>Administrator</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/registracija/objekt">
              <q-item-section>Poslovni objekt</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

      </q-list>
    </q-drawer>

    <!-- Page content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "TopHamburgerNav",
  data() {
    return {
      leftDrawer: false,
    };
  },
};
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