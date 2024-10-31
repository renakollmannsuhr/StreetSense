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

      <!-- Add selected marker -->
      <GMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :position="{ lat: marker.latitude, lng: marker.longitude }"
        :icon="icons[marker.type]"
      ></GMapMarker>
    </GMapMap>

    <!-- Button to request user location -->
    <button class="location-button" @click="getUserLocation">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-navigation">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
    </button>

    <!-- Plus button to choose marker -->
    <button class="plus-button" @click="toggleMarkerMenu">
      +
    </button>

    <!-- Marker selection menu -->
    <div v-if="showMarkerMenu" class="marker-menu">
      <button @click="selectMarker('theft')">Theft</button>
      <button @click="selectMarker('assault')">Assault</button>
      <button @click="selectMarker('disturbance')">Disturbance</button>
      <button @click="selectMarker('propertyDamage')">Property Damage</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Use relative paths when using proxy, or set base URL
//axios.defaults.baseURL = 'http://localhost:8000'; // dev mode
axios.defaults.baseURL = 'https://streetsense-ae65da49a77f.herokuapp.com'; // production mode


export default {
  name: 'CrimeMap',
  setup() {
    const mapCenter = ref({ lat: 48.4359, lng: -123.35155 });
    const userLocation = ref(null);
    const selectedMarker = ref(null);
    const showMarkerMenu = ref(false);
    const markers = ref([]);

    const mapOptions = {
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      keyboardShortcuts: false,
      scaleControl: false,
      rotateControl: false,
    };

    onMounted(async () => {
      try {
        console.log('Fetching markers...');
        const response = await axios.get('/api/reports/');
        markers.value = response.data;
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    });


    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation.value = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
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

    const userIcon = {
      url: '/user_icon.png',
      scaledSize: { width: 60, height: 60 },
    };

    const icons = {
      theft: {
        url: '/theft_icon.png',
        scaledSize: { width: 30, height: 30 } // Adjust size as needed
      },
      assault: {
        url: '/fight_icon.png',
        scaledSize: { width: 30, height: 30 } // Adjust size as needed
      },
      disturbance: {
        url: '/disturbance_icon.png',
        scaledSize: { width: 30, height: 30 } // Adjust size as needed
      },
      propertyDamage: {
        url: '/vandalism_icon.png',
        scaledSize: { width: 30, height: 30 } // Adjust size as needed
      },
    };

    const toggleMarkerMenu = () => {
      showMarkerMenu.value = !showMarkerMenu.value;
    };

    const selectMarker = (type) => {
      selectedMarker.value = icons[type];
      showMarkerMenu.value = false;

      // Capture marker details
      const markerDetails = {
        title: type,
        type: type,
        latitude: userLocation.value.lat,
        longitude: userLocation.value.lng,
        description: `${type} reported at this location.`
      };

      // Send marker details to backend
      submitMarker(markerDetails);
    };

    const submitMarker = async (markerDetails) => {
      try {
        const response = await axios.post('/api/reports/', markerDetails);
        markers.value.push(response.data); // Add the new marker to the list
        alert('Marker saved successfully!');
      } catch (error) {
        console.error('Error saving marker:', error);
      }
    };

    return {
      mapCenter,
      mapOptions,
      userLocation,
      userIcon,
      getUserLocation,
      selectedMarker,
      showMarkerMenu,
      toggleMarkerMenu,
      selectMarker,
      submitMarker,
      markers,
      onMounted,
      icons,
    };
  },
};
</script>

<style scoped>
.map-container {
  width: 102vw; /* Slightly larger than the viewport */
  height: 102vh; /* Slightly larger than the viewport */
  margin: 0;
  padding: 0;
  touch-action: none; /* Prevent dragging */
  position: relative; /* Ensure it stays within the parent container */
  left: -1vw; /* Center the map by shifting it left */
  top: 0vh; /* Center the map by shifting it up */
}

.location-button {
  position: absolute;
  top: 50%; /* Position halfway down the screen */
  right: 20px; /* Position on the right side */
  transform: translateY(-50%); /* Center the button vertically */
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px; /* Rounded edges */
  cursor: pointer;
  z-index: 1000;
}

.location-button:hover {
  background-color: #0056b3;
}

.plus-button {
  position: absolute;
  bottom: 10%; /* Position 1/4 up from the bottom */
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Adjust for the button's width */
  width: 70px; /* Increase width */
  height: 70px; /* Increase height */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px; /* Increase font size for the plus icon */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%; /* Ensure it's a circle */
  cursor: pointer;
  z-index: 1000;
}

.plus-button:hover {
  background-color: #0056b3;
}

.marker-menu {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.marker-menu button {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.marker-menu button:hover {
  background-color: #f0f0f0;
}
</style>

