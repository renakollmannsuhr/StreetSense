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

      <!-- Add a marker for each item in markers -->
      <template v-for="marker in markers" :key="marker.id">
        <GMapMarker
          v-if="filterByTypes[marker.type] && isMarkerWithinTimeFilter(marker.date_reported)"
          :position="{ lat: marker.latitude, lng: marker.longitude }"
          :clickable="true"
          :icon="getMarkerIcon(marker.type, marker.date_reported)"
          @click="openInfoWindow(marker.id)"
        >
          <GMapInfoWindow 
          @closeclick="openMarker === null"
          :opened="openMarker === marker.id"
          :options=" {
              pixelOffset: {
                width: 10, height: 0
              },
              maxWidth: 200,
              maxHeight: 320,
          }"
          >
            <div class="info-window">
              <p class="info-title"><strong>{{ marker.type }}</strong> reported here</p>
              <p class="info-date">on {{ formatDate(marker.date_reported) }}</p>
              <p>Did you witness this incident?</p>

              <div class="voting-section">
                <button @click="handleVote()" class="vote-button yes">Yes</button>
                <p> {{ yesVotes }} votes</p>
              </div>
            </div>
          </GMapInfoWindow>
        </GMapMarker>
      </template>

      <GMapHeatmap 
        v-if="heatmapReady && filteredHeatmapData.length > 0"
        :data="filteredHeatmapData"
        :options="heatmapOptions" 
      />
    </GMapMap>

    <div class="button-panel">
      <div>
        
        <button class="info-button" @click="toggleInfoMenu">
          i
        </button>

        <!-- Info Menu -->
        <div v-if="showInfoMenu" class="info-menu">
          <div class="title-row">
            <h3>About StreetSense</h3>
            <a href="https://williamdw6.wixsite.com/streetsense" target="_blank" class="website-link">Product Page</a>
          </div>
          <p>StreetSense helps you stay informed about incidents in your area:</p>
          <ul>
            <li>View recent incidents on the map</li>
            <li>Report incidents using the + button</li>
            <li>Filter incident types using the filter button</li>
            <li>Marker opacity indicates incident recency</li>
            <li>Heatmap shows historical incidents</li>
            <li>Click on a marker to see more details</li>
          </ul>
          
          <div class="legend">
            <h4>Incident Types:</h4>
            <div class="legend-container">
              <div class="legend-item">
                <img src="/theft.png" alt="Theft" class="legend-icon" />
                <div class="legend-text">
                  <span class="legend-title">Theft</span>
                  <span class="legend-description"> - Stolen property or belongings</span>
                </div>
              </div>
              <div class="legend-item">
                <img src="/assault.png" alt="Assault" class="legend-icon" />
                <div class="legend-text">
                  <span class="legend-title">Assault</span>
                  <span class="legend-description"> - Physical or verbal threats</span>
                </div>
              </div>
              <div class="legend-item">
                <img src="/disturbance.png" alt="Disturbance" class="legend-icon" />
                <div class="legend-text">
                  <span class="legend-title">Disturbance</span>
                  <span class="legend-description"> - Public disorder or noise</span>
                </div>
              </div>
              <div class="legend-item">
                <img src="/damage.png" alt="Damage" class="legend-icon" />
                <div class="legend-text">
                  <span class="legend-title">Damage</span>
                  <span class="legend-description"> - Vandalism or property damage</span>
                </div>
              </div>
            </div>
            
            <div class="donate-container">
              <a href="https://williamdw6.wixsite.com/streetsense#comp-m3rnsn51" target="_blank" class="donate-button">
                Support This Project
              </a>
            </div>
          </div>
        </div>

      </div>

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
            <label>Incident Time Range</label>
            <select v-model="markerTimeFilter">
              <option value="day">Past Day</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <!-- <div class="filter-item">
            <label>Marker Fade Effect</label>
            <select v-model="markerFadeEnabled">
              <option value="on">Enabled</option>
              <option value="off">Disabled</option>
            </select>
          </div> -->

          <div class="filter-item">
            <label>Heatmap Time Filter</label>
            <select v-model="timeFilter">
              <option value="off">Heatmap Off</option>
              <option value="all">All Time</option>
              <option value="day">Past Day</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
          <div class="filter-live">
            <input type="checkbox" id="oneHourFilter" v-model="oneHourFilterEnabled">
            <label for="oneHourFilter">Time of Day +/- 1 Hour</label>
          </div>
          
        </div>
      </div>
    </div>
    <div>
      <ModalsContainer />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import 'vue-final-modal/style.css';
import { ModalsContainer, useModal } from 'vue-final-modal';
import ModalConfirmPlainCss from './ModalConfirmPlainCss.vue';

// Use relative paths when using proxy, or set base URL
//axios.defaults.baseURL = 'http://localhost:8000'; // dev mode
axios.defaults.baseURL = 'https://streetsense-ae65da49a77f.herokuapp.com'; // production mode

export default {
  name: 'CrimeMap',
  components: {
    ModalsContainer,
  },
  setup() {
    const mapCenter = ref({ lat: 48.4359, lng: -123.35155 });
    const userLocation = ref(null);
    const selectedMarker = ref(null);
    const openMarker = ref(null);
    const showMarkerMenu = ref(false);
    const markers = ref([]);
    let yesVotes = ref(0);
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
    const oneHourFilterEnabled = ref(false);
    const showInfoMenu = ref(false);
    const markerTimeFilter = ref('day');
    const markerFadeEnabled = ref('on');

    const mapOptions = {
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      keyboardShortcuts: false,
      scaleControl: false,
      rotateControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "all", 
          stylers: [{ visibility: "off" }]
        }
      ]
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

    const calculateOpacityIcon = (baseIcon, dateReported) => {
      // If fade effect is disabled or time filter is not set to 'day', return original icon
      if (markerFadeEnabled.value === 'off' || (markerTimeFilter.value !== 'day' && markerTimeFilter.value !== 'off')) {
        return baseIcon;
      }
      
      const elapsedHours = (Date.now() - new Date(dateReported).getTime()) / (1000 * 60 * 60);
      let newUrl = baseIcon;

      if (elapsedHours <= 3.43) return `${newUrl}`;
      if (elapsedHours <= 6.86) {
        newUrl = baseIcon.replace('.png', '_0.15.png');
      }
      if (elapsedHours <= 10.29) {
        newUrl = baseIcon.replace('.png', '_0.30.png');
      }
      if (elapsedHours <= 13.72) {
        newUrl = baseIcon.replace('.png', '_0.5.png');
      }
      if (elapsedHours <= 17.15) {
        newUrl = baseIcon.replace('.png', '_0.65.png');
      };
      if (elapsedHours <= 20.58) {
        newUrl = baseIcon.replace('.png', '_0.8.png');
      };
      if (elapsedHours > 20.58 && elapsedHours <= 24) {
        newUrl = baseIcon.replace('.png', '_0.95.png');
      };
      if (elapsedHours > 24) {
        newUrl = '';
      };
      return newUrl;
    };

    onMounted(async () => {
      try {
        const response = await axios.get('/api/reports/');
        markers.value = response.data;
        // Initialize filtered data
        updateHeatmap();
      
        getUserLocation();
        
        heatmapReady.value = true;
      } catch (error) {
        console.error('Error:', error);
      }
    });

    const getMarkerIcon = (type, date) => {
      const icon =  incidenceTypes[type].icon;
      const urlToChange = icon.url;
      const resultIcon = {
        url: calculateOpacityIcon(urlToChange, date),
        scaledSize: icon.scaledSize
      }
      return resultIcon;
    };

    const openInfoWindow = (marker) =>{
      openMarker.value = marker;
    }

    const handleVote = () => {
      yesVotes.value++;
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown date'; // Handle null or undefined dates
      const date = new Date(dateString); // Use `new` to create a valid Date object
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    };

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
          url: '/theft.png',
          scaledSize: { width: 30, height: 30 } // Adjust size as needed
        }
      },
      assault: {
        name: 'Assault',
        icon: {
          url: '/assault.png',
          scaledSize: { width: 30, height: 30 } // Adjust size as needed
        }
      },
      disturbance: {
        name: 'Disturbance',
        icon: {
          url: '/disturbance.png',
          scaledSize: { width: 30, height: 30 } // Adjust size as needed
        }
      },
      propertyDamage: {
        name: 'Damage',
        icon: {
          url: '/damage.png',
          scaledSize: { width: 25, height: 25 } // Adjust size as needed
        }
      },
    };

    const toggleMarkerMenu = () => {
      showMarkerMenu.value = !showMarkerMenu.value;
      showFilterMenu.value = false;
      showInfoMenu.value = false;
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
        markers.value.push(response.data); 
        open();
      } catch (error) {
        console.error('Error saving marker:', error);
      }
    };

    const { open, close } = useModal({
      component: ModalConfirmPlainCss,
      attrs: {
        title: 'Your Report Has Been Saved!',
        onConfirm() {
          close()
        },
      },
      slots: {
    default: `
      <div>
        <!-- Thank You Note -->
        <p style="font-size: 20px;">Thank you for your report! Your contribution helps make our community a safer and better place for everyone.</p>
        
        <!-- Transportation Ad -->
        <div style="padding: 20px; background-color: #53B0B2; border: 1px solid #ddd; margin-top: 20px;">
          <div style="display: flex; align-items: center;">
            <img src="../../public/car.png" alt="Safe Ride Icon" style="width: 50px; margin-right: 15px;">
            <div>
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: rgba(255, 255, 255, 0.87);">Get Home Safely!</p>
              <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.87);">Consider using a rideshare service for a safer journey home.</p>
            </div>
          </div>
        </div>
        <!-- Separator -->
        <div style="margin: 15px 0; border-top: 1px solid #ddd;"></div>
        
        <!-- VicPD Information -->
        <div style="background-color: #14243f; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <p style="color: rgba(255, 255, 255, 0.87);"><strong>Victoria Police Department</strong></p>
          <p style="color: rgba(255, 255, 255, 0.87);">For serious incidents, we encourage you to contact the <a href="https://vicpd.ca/" target="_blank" style="color: #007BFF; text-decoration: underline;">Victoria Police Department</a> directly.</p>
          <iframe 
            src="https://vicpd.ca/services/" 
            width="100%" 
            height="200px" 
            style="border: 1px solid #ccc; border-radius: 4px;"
          ></iframe>
          <p style="margin-top: 10px; font-weight: bold; color: rgba(255, 255, 255, 0.87);">For emergencies, please call 911.</p>
        </div>
      </div>
    `,
  },
    });

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
      // If timeFilter is "off", set empty array and return
      if (timeFilter.value === 'off') {
        filteredHeatmapData.value = [];
        return;
      }

      const now = new Date();

      const filtered = markers.value.filter(marker => {
        const markerDate = new Date(marker.date_reported);

        // Check if the marker falls within the selected time filter
        let isWithinTimeFilter = false;
        switch (timeFilter.value) {
          case 'day':
            isWithinTimeFilter = (now - markerDate) <= 24 * 60 * 60 * 1000;
            break;
          case 'week':
            isWithinTimeFilter = (now - markerDate) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'month':
            isWithinTimeFilter = (now - markerDate) <= 30 * 24 * 60 * 60 * 1000;
            break;
          case 'year':
            isWithinTimeFilter = (now - markerDate) <= 365 * 24 * 60 * 60 * 1000;
            break;
          default:
            isWithinTimeFilter = true;
        }

        // Apply the +/- one hour filter if enabled
        const isWithinOneHourFilter = oneHourFilterEnabled.value ? isWithinOneHour(markerDate) : true;

        // Return true if the marker is within both the time filter and the one hour filter
        return isWithinTimeFilter && isWithinOneHourFilter;
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
      showInfoMenu.value = false;
    };

    const isWithinOneHour = (markerDate) => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const markerHour = markerDate.getHours();
      const markerMinutes = markerDate.getMinutes();

      // Calculate the time difference in minutes
      const timeDifference = Math.abs((currentHour * 60 + currentMinutes) - (markerHour * 60 + markerMinutes));

      // Check if the time difference is within 60 minutes (1 hour)
      return timeDifference <= 60;
    };

    watch(oneHourFilterEnabled, () => {
      updateHeatmap();
    });

    const toggleInfoMenu = () => {
      showInfoMenu.value = !showInfoMenu.value;
      showFilterMenu.value = false;
      showMarkerMenu.value = false;
    };

    const isMarkerWithinTimeFilter = (dateReported) => {
      if (markerTimeFilter.value === 'off') return true;
      
      const now = new Date();
      const markerDate = new Date(dateReported);
      const timeDiff = now - markerDate;
      
      switch (markerTimeFilter.value) {
        case 'day':
          return timeDiff <= 24 * 60 * 60 * 1000;
        case 'week':
          return timeDiff <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return timeDiff <= 30 * 24 * 60 * 60 * 1000;
        case 'year':
          return timeDiff <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    };

    return {
      mapCenter,
      mapOptions,
      userLocation,
      userIcon,
      getUserLocation,
      selectedMarker,
      openMarker,
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
      isWithinOneHour,
      oneHourFilterEnabled,
      getMarkerIcon,
      calculateOpacityIcon,
      open,
      close,
      toggleInfoMenu,
      showInfoMenu,
      openInfoWindow,
      formatDate,
      handleVote,
      yesVotes,
      markerTimeFilter,
      markerFadeEnabled,
      isMarkerWithinTimeFilter,
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
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  padding: 10px;
  z-index: 1000;
}

.button-panel > div {
  position: relative
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
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px; /* Space between buttons */
}

.marker-icon {
  width: 30px; /* Adjust size as needed */
  height: 30px;
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
  padding: 0;
  border: none;
  border-radius: 20%;
  cursor: pointer;
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
  bottom: 60px;
  transform: translateX(-50%);
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

.filter-live {
  display: flex;
  align-items: flex-start;
  flex-direction:row;
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

.info-window {
  text-align: center;
  font-size: 16px;
  font-family: Arial, sans-serif;
}

.info-title {
  font-size: 186x;
  margin-bottom: 5px;
}

.info-date {
  color: rgb(56, 56, 62);
  font-size: 20px;
  margin-bottom: 20px;
}

.voting-section {
  margin-top: 10px;;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.vote-button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}

.vote-button.yes {
  background-color: #4CAF50; /* Green for Yes */
  color: white;
}

/* Media query for mobile devices */
@media (max-width: 768px) {
    .button-panel {
        bottom: 100px; /* Raise it higher for smaller screens */
    }
}






.info-button {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 34px;
  background-color: #007bff;
  color: #fff;
  padding: 0;
  border: none;
  border-radius: 20%;
  cursor: pointer;
  font-style: italic;
  font-family: "Times New Roman", serif;
}

.info-button:hover {
  background-color: #0056b3;
}

.info-menu {
  position: absolute;
  bottom: 60px;
  left: 75%;
  transform: translateX(-50%);
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 10px;
  font-family: Arial, sans-serif;
  width: 80vw;
  max-width: 600px;
  z-index: 1000;
  margin: 0 auto;
  box-sizing: border-box;
}

.info-menu h3 {
  margin-top: 0;
  color: #333;
}

.info-menu ul {
  padding-left: 20px;
  margin: 10px 0;
}

.legend {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.legend h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.legend-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.support-links {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.links-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.support-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 0.9em;
  transition: background-color 0.2s;
}

.support-link:hover {
  background-color: #0056b3;
}

.support-link i {
  font-size: 1.1em;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.website-link {
  color: #007bff;
  text-decoration: none;
  font-size: 1.3em;
}

.website-link:hover {
  text-decoration: underline;
}

.donate-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.donate-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.donate-button:hover {
  background-color: #0056b3;
}
</style>