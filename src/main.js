import { createApp } from 'vue';
import App from './App.vue';
import VueGoogleMaps from '@fawmi/vue-google-maps';

const app = createApp(App);

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCQHMZcwOioIC_iF95ITHO3Uhn79aiJ2mM',  
    libraries: 'places',  
  },
});

app.mount('#app');