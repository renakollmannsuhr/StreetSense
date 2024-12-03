<template>
  <div id="app">
    <router-view>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
<style>
.tippy-box[data-theme~='theme'] {
  background-color: #1e3e80;
  color: white;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}
.tippy-box[data-theme~='theme'][data-placement^='top'] > .tippy-arrow::before {
  border-top-color: #1e3e80;
}
</style>