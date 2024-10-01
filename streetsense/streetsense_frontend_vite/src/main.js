import { createApp } from 'vue';
import App from './App.vue';
import VueGoogleMaps from '@fawmi/vue-google-maps';

const app = createApp(App);

// app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('gmap-');


app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCQHMZcwOioIC_iF95ITHO3Uhn79aiJ2mM',  // Replace with your actual Google Maps API key
    libraries: 'places',  // This is needed if you use the Places API
  },
});

app.mount('#app');