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
      <template v-for="marker in markers" :key="marker.id">
        <GMapMarker
          v-if="filterByTypes[marker.type]"
          :position="{ lat: marker.latitude, lng: marker.longitude }"
          :icon="incidenceTypes[marker.type].icon"
        />
      </template>
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

    <!-- Marker selection buttons -->
    <div v-if="showMarkerMenu" class="marker-buttons">
      <button v-for="(incidenceType, type) in incidenceTypes" :key="type" @click="selectMarker(type)">
        <img :src="incidenceType.icon.url" :alt="incidenceType.name" class="marker-icon" />
      </button>
    </div>

    <!-- Filter button -->
    <button class="filter-button" @click="toggleFilterMenu">
      ⚙
    </button>

    <!-- Filter options -->
    <div v-if="showFilterMenu" class="filter-options">
      <div v-for="(incidenceType, type) in incidenceTypes" :key="type">
        <input type="checkbox"
          :name="'enable_' + type"
          :checked="filterByTypes[type]"
          @change="event => filterByTypes[type] = event.target.checked"
        >
        <label :for="'enable_' + type">
          <img :src="incidenceType.icon.url" :alt="incidenceType.name" class="filter-icon" />
          {{incidenceType.name}}
        </label>
      </div>
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
    const showFilterMenu = ref(false);
    const filterByTypes = ref({
      theft: true,
      assault: true,
      disturbance: true,
      propertyDamage: true
    });

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

    const incidenceTypes = {
      theft: {
        name: 'Theft',
        icon: {
          url: '/theft_icon.png',
          scaledSize: { width: 30, height: 30 } // Adjust size as needed
        }
      },
      assault: {
        name: 'Assault',
        icon: {
          url: '/fight_icon.png',
          scaledSize: { width: 30, height: 30 } // Adjust size as needed
        }
      },
      disturbance: {
        name: 'Disturbance',
        icon: {
          url: '/disturbance_icon.png',
          scaledSize: { width: 30, height: 30 } // Adjust size as needed
        }
      },
      propertyDamage: {
        name: 'Property Damage',
        icon: {
          url: '/vandalism_icon.png',
          scaledSize: { width: 30, height: 30 } // Adjust size as needed
        }
      },
    };

    const toggleMarkerMenu = () => {
      showMarkerMenu.value = !showMarkerMenu.value;
    };

    const selectMarker = (type) => {
      selectedMarker.value = incidenceTypes[type];
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

    const toggleFilterMenu = () => {
      showFilterMenu.value = !showFilterMenu.value;
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
      showFilterMenu,
      toggleFilterMenu,
      filterByTypes,
      onMounted,
      incidenceTypes,
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
  bottom: 60px;
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

.marker-buttons {
  position: absolute;
  bottom: 150px; /* Adjust as needed to position above the plus button */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px; /* Space between buttons */
  z-index: 1000;
}

.marker-icon {
  width: 30px; /* Adjust size as needed */
  height: 30px;
}

.filter-button {
  position: absolute;
  bottom: 60px;
  left: 80px;
  transform: translateX(-50%); /* Adjust for the button's width */
  width: 70px; /* Increase width */
  height: 70px; /* Increase height */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px; /* Increase font size for the plus icon */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%; /* Ensure it's a circle */
  cursor: pointer;
  z-index: 1000;
}

.filter-button:hover {
  background-color: #0056b3;
}

.filter-options {
  position: absolute;
  bottom: 150px; /* Adjust as needed to position above the button */
  left: 40px;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  font-family: Arial, Helvetica, sans-serif;
  z-index: 1000;
}

.filter-options label {
  margin-left: 4px;
}

.filter-icon {
  width: 20px; /* Adjust size as needed */
  height: 20px;
}

</style>