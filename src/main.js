import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Product from './components/Product.vue'
import StreetSense from './components/StreetSense.vue'
import VueGoogleMaps from '@fawmi/vue-google-maps'

const routes = [
  {
    path: '/',
    name: 'StreetSense',
    component: StreetSense
  },
  {
    path: '/product',
    name: 'ProductPage',
    component: Product
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

app.use(router)
app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCQHMZcwOioIC_iF95ITHO3Uhn79aiJ2mM',
    libraries: 'places',
  },
})

app.mount('#app')