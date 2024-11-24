<!--HTML-->

<template>
  <div class="map-container">
    <GMapMap
      :center="mapCenter"
      :zoom="14"
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

      <GMapHeatmap 
        v-if="heatmapReady && filteredHeatmapData.length > 0"
        :data="filteredHeatmapData"
        :options="heatmapOptions" 
      />
    </GMapMap>

    <div class="button-panel">
      <!-- Button to request user location -->
      <button class="location-button" @click="getUserLocation">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-navigation">
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
      </button>

      <div>
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
      </div>

      <div>
        <!-- Filter button -->
        <button class="filter-button" @click="toggleFilterMenu">
          <img src="/filter.png" alt="Filter" class="filter-icon" />
        </button>

        <!-- Filter options -->
        <div v-if="showFilterMenu" class="filter-options">
          <div class="filter-icon-item" v-for="(incidenceType, type) in incidenceTypes" :key="type">
            <input type="checkbox"
              :name="'enable_' + type"
              :checked="filterByTypes[type]"
              @change="event => filterByTypes[type] = event.target.checked"
            >
            <label :for="'enable_' + type">
              <img :src="incidenceType.icon.url" :alt="incidenceType.name" class="filter-type-icon" />
              {{incidenceType.name}}
            </label>
          </div>
          <div class="filter-item">
            <label>Heatmap Time Filter</label>
            <select v-model="timeFilter">
              <option value="all">All Time</option>
              <option value="day">Past Day</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Add user controls -->
    <!-- <div class="heatmap-controls">
      <label>Heatmap Time Filter</label>
      <select v-model="timeFilter">
        <option value="all">All Time</option>
        <option value="week">Past Week</option>
        <option value="month">Past Month</option>
        <option value="year">Past Year</option>
      </select> -->
      
      <!-- <div class="opacity-control">
        <label>Heatmap Intensity</label>
        <input 
          type="range" 
          v-model.number="heatmapOptions.opacity" 
          min="0" 
          max="1" 
          step="0.1"
        />
      </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
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
    const heatmapData = ref([]);
    const heatmapReady = ref(false);
    const timeFilter = ref('all');
    const filteredHeatmapData = ref([]);

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


    const heatmapOptions = {
      radius: 85,
      opacity: 0.5,
      dissipating: true,
      maxIntensity: 10,
      gradient: [
        'rgba(255, 255, 0, 0)',   // Transparent yellow
        'rgba(255, 255, 0, 1)',   // Yellow
        'rgba(255, 165, 0, 1)',   // Orange
        'rgba(255, 0, 0, 1)'      // Red
      ]
    };


    onMounted(async () => {
      try {
        console.log('Fetching markers...');
        const response = await axios.get('/api/reports/');
        markers.value = response.data;
        // Initialize filtered data
        updateHeatmap();
        
        heatmapReady.value = true;
      } catch (error) {
        console.error('Error:', error);
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
      showFilterMenu.value = false;
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

    const calculateWeight = (marker) => {
      // Example weighting factors:
      let weight = 1;
      
      // Time-based weighting (more recent = higher weight)
      const daysSinceReport = (new Date() - new Date(marker.timestamp)) / (1000 * 60 * 60 * 24);
      if (daysSinceReport < 7) weight *= 1.5;
      if (daysSinceReport < 30) weight *= 1.2;
      
      // Severity-based weighting (if you have a severity field)
      if (marker.severity === 'high') weight *= 1.5;
      
      return weight;
    };

    // Add data clustering for large datasets
    const clusterData = (markers, radius = 100) => {
      const clusters = {};
      
      markers.forEach(marker => {
        const key = Math.floor(marker.latitude/radius) + ',' + 
                    Math.floor(marker.longitude/radius);
        
        if (!clusters[key]) {
          clusters[key] = {
            lat: 0,
            lng: 0,
            count: 0,
            weight: 0
          };
        }
        
        clusters[key].lat += marker.latitude;
        clusters[key].lng += marker.longitude;
        clusters[key].count++;
        clusters[key].weight += calculateWeight(marker);
      });
      
      return Object.values(clusters).map(cluster => ({
        location: new google.maps.LatLng(
          cluster.lat/cluster.count, 
          cluster.lng/cluster.count
        ),
        weight: cluster.weight
      }));
    };

    const updateHeatmap = () => {
      // Filter data based on selected time period
      const now = new Date();
      const filtered = markers.value.filter(marker => {
        const markerDate = new Date(marker.date_reported);
        switch (timeFilter.value) {
          case 'day':
            return (now - markerDate) <= 24 * 60 * 60 * 1000;
          case 'week':
            return (now - markerDate) <= 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return (now - markerDate) <= 30 * 24 * 60 * 60 * 1000;
          case 'year':
            return (now - markerDate) <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });


      // Update heatmap data with filtered results
      filteredHeatmapData.value = filtered.map(marker => ({
        location: new google.maps.LatLng(marker.latitude, marker.longitude),
        weight: 1,
      }));
    };

    // Watch for changes in the time filter
    watch(timeFilter, () => {
      updateHeatmap();
    });

    // Watch for changes in the opacity slider
    watch(() => heatmapOptions.opacity, (newOpacity) => {
      console.log('Opacity changed:', newOpacity);
    }, { deep: true });

    const toggleFilterMenu = () => {
      showFilterMenu.value = !showFilterMenu.value;
      showMarkerMenu.value = false;
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
      heatmapData,
      heatmapOptions,
      heatmapReady,
      calculateWeight,
      clusterData,
      timeFilter,
      filteredHeatmapData,
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

.button-panel {
  position: absolute;
  top: 50%; /* Position halfway down the screen */
  right: 20px; /* Position on the right side */
  transform: translateY(-50%); /* Center the button vertically */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  user-select: none;
  z-index: 1000;
}

.button-panel > div {
  position: relative
}

.location-button {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 20%; /* Rounded edges */
  cursor: pointer;
}

.location-button:hover {
  background-color: #0056b3;
}

.plus-button {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  background-color: #007bff;
  color: #fff;
  padding-top: 0;
  border: none;
  border-radius: 20%;
  cursor: pointer;
}

.plus-button:hover {
  background-color: #0056b3;
}

.marker-buttons {
  position: absolute;
  top: 30px;
  right: 80px;
  transform: translateY(-50%);
  display: flex;
  gap: 10px; /* Space between buttons */
}

.marker-icon {
  width: 30px; /* Adjust size as needed */
  height: 30px;
}

.filter-button {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  background-color: #007bff;
  color: #fff;
  padding: 0;
  border: none;
  border-radius: 20%;
  cursor: pointer;
}

.filter-button:hover {
  background-color: #0056b3;
}

.filter-options {
  position: absolute;
  top: 30px;
  right: 80px;
  transform: translateY(-50%);
  background-color: #fff;
  box-shadow: 0 0 4px #0005;
  padding: 10px;
  border-radius: 10px;
  font-family: Arial, Helvetica, sans-serif;
  white-space: nowrap;
}

.filter-item {
  display: flex;
  align-items: flex-start;
  flex-direction:column;
  margin-top: 2rem; /* Adds space below each item */
}

.filter-icon-item {
  display: flex;
  align-items: flex-start;
  flex-direction:row;
  /* margin-bottom: 0.5rem; */
}

.filter-options label {
  margin-left: 4px;
}

.filter-icon {
  width: 30px; /* Adjust size as needed */
  height: 30px;
}

.filter-type-icon {
  width: 20px; /* Adjust size as needed */
  height: 20px;
}


.heatmap-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 1000;
}

.opacity-control {
  margin-top: 10px;
}

select, input[type="range"] {
  width: 100%;
  margin: 5px 0;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.filter-item {
  margin-bottom: 10px;
}
</style>