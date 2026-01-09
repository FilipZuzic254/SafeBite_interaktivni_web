<template>
  <q-page class=" flex-center">
    <img
      alt="pocetna"
      src="~assets/pocetna.png"
      style="width: 100%; height:100vh"
      class="q-mb-sm"
    />
  </q-page>

 <q-page class="q-pa-md bg-grey-1">

    <div class="flex-container">

      <!-- RESTORAN -->
      <div class="flex-item" @click="goToSection('restorani')">
        <img :src="restoranImg" alt="Restoran" />
        <div class="overlay">
          <h2>Restorani</h2>
        </div>
      </div>

      <!-- KAFIĆ -->
      <div class="flex-item" @click="goToSection('kafici')">
        <img :src="kaficImg" alt="Kafić" />
        <div class="overlay">
          <h2>Kafići</h2>
        </div>
      </div>

    </div>



  </q-page>

</template>

<script setup>
import { useRouter } from 'vue-router'

// import slika iz assets
import restoranImg from 'src/assets/rijekarestoran.jpg'
import kaficImg from 'src/assets/kaficrijeka.jpg'

const router = useRouter()

function goToSection(section) {
  router.push(`/${section}`)
}
</script>

<style scoped>
.flex-container {
  display: flex;
  gap: 16px; /* razmak između kartica */
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap; /* da bude responsive na manjim ekranima */
}

.flex-item {
  position: relative;
  width: 45%;  /* svaka kartica zauzima skoro pola ekrana */
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.flex-item:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.flex-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.overlay {
  position: absolute;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  width: 100%;
  text-align: center;
  padding: 10px;
}

.overlay h2 {
  color: white;
  margin: 0;
}
</style>
