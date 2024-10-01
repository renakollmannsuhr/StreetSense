<template>
  <div id="app">
    <h1>StreetSense Crime Reporting Map</h1>
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
#app {
  text-align: center;
}
</style>