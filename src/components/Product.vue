<template>
  <div class="product">
    <div class="logo-container">
      <img src="/StreetSenseLogo.png" alt="StreetSense Logo" class="logo" />
    </div>
    <p>Fostering a sense of community for commuters and university students by offering real-time, community-reported crime alerts, empowering you to navigate your city confidently and make it home safely.</p>
    <div class="screenshot-container">
      <img src="/appview.png" alt="App View" class="screenshot" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductPage',
}
</script>

<style scoped>
.product {
  padding: 20px;
}

.logo-container, .screenshot-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.logo {
  height: 100px;
  width: auto;
  margin: 1rem;
}

.screenshot {
  height: 450px;
  width: auto;
}
</style>
