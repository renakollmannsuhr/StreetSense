<template>
  <div id="app">
    <div class="map-wrapper">
      <CrimeMap /> 
      <div class="logo-bar">
        <img src="/ss_logo.jpg" alt="StreetSense Logo" class="logo" />
      </div>
    </div>
  </div>
</template>

<script>
import CrimeMap from './components/CrimeMap.vue'  

export default {
  name: 'App',
  components: {
    CrimeMap,  // Register the component
  },
}
</script>

<style scoped>

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.map-wrapper {
  position: relative;
}

.logo-bar {
  position: absolute;
  top: 0;
  width: 100%;
  background-color: rgb(244, 244, 244, 0);
  display: flex;
  align-items: center;
  padding: 0.5rem;
  z-index: 1000; /* Ensure the logo bar appears above the map */
}

.logo {
  height: 50px; 
  width: auto; 
  margin-left: 0.5rem;
}
</style>