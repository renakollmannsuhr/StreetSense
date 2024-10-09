<template>
  <div id="app">
    <img src="/ss_logo.jpg" alt="StreetSense Logo" class="logo" />
    <CrimeMap /> 
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

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
.logo {
  height: 50px; 
  width: auto; 
  margin: 0.2rem;
}
</style>