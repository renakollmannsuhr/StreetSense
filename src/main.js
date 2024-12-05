import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVfm } from 'vue-final-modal'
import { plugin as VueTippy } from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'
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
const vfm = createVfm()

app.use(router)
app.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: 'places,visualization',
    v: 'weekly'
  },
})
app.use(VueTippy, {
  defaultProps: { 
    placement: 'top',
    animation: 'scale',
  },
})
app.use(vfm)
app.mount('#app')