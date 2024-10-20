<!--HTML-->

<template>
  <div class="map-container">
    <GMapMap
      :center="mapCenter"
      :zoom="16"
      :options="mapOptions"
      style="width: 100%; height: 100vh;"
    >
       <!-- Add user location marker -->
       <GMapMarker
        v-if="userLocation"
        :position="userLocation"
        :icon="userIcon"
      ></GMapMarker>
    </GMapMap>

    <!-- Button to request user location -->
    <button class="location-button" @click="getUserLocation">
      Show My Location
    </button>
  </div>
</template>

<script>


// JAVASCRIPT

import { ref, onMounted } from 'vue';
import axios from 'axios';

// Use relative paths when using proxy, or set base URL
axios.defaults.baseURL = 'http://localhost:8000';

export default {
  name: 'CrimeMap',
  setup() {
    const mapCenter = ref({ lat: 48.4359, lng: -123.35155 }); // Victoria, B.C
    const userLocation = ref(null); // To store the user's location

    const mapOptions = {
      disableDefaultUI: true,       // Enable default UI controls
      zoomControl: false,            // Remove zoom control (+/- buttons)
      streetViewControl: false,      // Remove Street View pegman
      mapTypeControl: false,         // Remove map/satellite toggle
      fullscreenControl: false,      // Remove fullscreen button
      keyboardShortcuts: false,      // Disable keyboard shortcuts
      scaleControl: false,           // Remove scale control
      rotateControl: false,          // Remove rotate control
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation.value = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            // Optionally, center the map on the user's location
            mapCenter.value = userLocation.value;
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    // onMounted(() => {

    // });



    const userIcon = {
      url: '/user_icon.png', // Replace with the path to your custom user icon
      scaledSize: { width: 60, height: 60 }, // Adjust size as needed
    };


    // Define icons for different disturbance types
    const icons = {
      Theft: '/theft_icon.png',
      Assault: '/fight_icon.png',
      Disturbance:'/disturbance_icon.png',
      'Property Damage': '/vandalism_icon.png',
    };

    
    return {
      mapCenter,
      mapOptions,
      userLocation,
      userIcon,
      getUserLocation
    };
  },
};
</script>

<style scoped>
/* CSS */

.container {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  width: 100%;
}

/* Map container styles */
.map-container {
  width: 100%;
  height: 100vh;
}


.location-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 12px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000; /* Ensure the button appears above the map */
}

.location-button:hover {
  background-color: #0056b3;
}
</style>