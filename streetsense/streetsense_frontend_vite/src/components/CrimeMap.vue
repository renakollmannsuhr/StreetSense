<template>
  <div>
    <GMapMap
      :center="mapCenter"
      :zoom="12"
      style="width: 100%; height: 500px"
      @click="addMarker"
    >
      <!-- Existing crime reports -->
      <GMapMarker
        v-for="(report, index) in crimeReports"
        :key="index"
        :position="{ lat: report.latitude, lng: report.longitude }"
        @click="showInfoWindow(index)"
      >
        <GMapInfoWindow
          :options="{ maxWidth: 300 }"
          :opened="openedInfoWindowIndex === index"
          @closeclick="openedInfoWindowIndex = null"
        >
          <div>
            <h3>{{ report.title }}</h3>
            <p><strong>Type:</strong> {{ report.type }}</p>
            <p><strong>Description:</strong> {{ report.description }}</p>
            <p><strong>Date Reported:</strong> {{ new Date(report.date_reported).toLocaleString() }}</p>
            <p><strong>Date Occurred:</strong> {{
              report.date_occurred
                ? new Date(report.date_occurred).toLocaleString()
                : '–'
            }}</p>
          </div>
        </GMapInfoWindow>
      </GMapMarker>

      <!-- New marker added by the user -->
      <GMapMarker
        v-if="newMarker"
        :position="newMarker.position"
      />
    </GMapMap>

    <!-- Form to submit a new crime report -->
    <div v-if="newMarker" class="report-form">
      <h3>Report a Crime</h3>
      <form @submit.prevent="submitReport">
        <label>
          Title:
          <input v-model="form.title" required />
        </label>
        <label>
          Date:
          <input v-model="form.date" type="datetime-local"/>
        </label>
        <label>
          Type:
          <select v-model="form.type">
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Disturbance">Disturbance</option>
            <option value="Property Damage">Property Damage</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Description:
          <textarea v-model="form.description" required></textarea>
        </label>
        <button type="submit">Submit Report</button>
        <button type="button" @click="cancelReport">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Use relative paths when using proxy, or set base URL
axios.defaults.baseURL = 'http://localhost:8000';

export default {
  name: 'CrimeMap',
  setup() {
    const mapCenter = ref({ lat: 48.4359, lng: -123.35155 }); // Victoria, B.C
    const crimeReports = ref([]);
    const newMarker = ref(null);
    const form = ref({
      title: '',
      description: '',
    });
    const openedInfoWindowIndex = ref(null);

    const fetchCrimeReports = async () => {
      try {
        const response = await axios.get('/api/reports/');
        crimeReports.value = response.data;
      } catch (error) {
        console.error('Error fetching crime reports:', error);
      }
    };

    const addMarker = (event) => {

      if (openedInfoWindowIndex.value !== null || newMarker.value) {
        // Close the info window if open
        openedInfoWindowIndex.value = null;
        return;
      }


      newMarker.value = {
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      };
    };


    const onMarkerClick = (index, event) => {
      // Prevent the map's click handler from being triggered
      if (event.domEvent && event.domEvent.stopPropagation) {
        event.domEvent.stopPropagation();
      }

      openedInfoWindowIndex.value = index;
    };


    const onInfoWindowClose = () => {
      openedInfoWindowIndex.value = null;
    };


    const submitReport = async () => {
      const utcDate = form.value.date && (new Date(form.value.date)).toISOString()
      try {
        const reportData = {
          title: form.value.title,
          date_occurred: utcDate,
          type: form.value.type,
          description: form.value.description,
          latitude: newMarker.value.position.lat,
          longitude: newMarker.value.position.lng,
        };
        await axios.post('/api/reports/', reportData);
        // Reset the form
        form.value.title = '';
        form.value.type = '';
        form.value.description = '';
        newMarker.value = null;
        // Fetch updated crime reports
        await fetchCrimeReports();
      } catch (error) {
        console.error('Error submitting crime report:', error);
      }
    };

    const cancelReport = () => {
      newMarker.value = null;
      form.value.title = '';
      form.value.type = '';
      form.value.description = '';
    };

    const showInfoWindow = (index) => {
      openedInfoWindowIndex.value = index;
    };

    onMounted(() => {
      fetchCrimeReports();
    });

    return {
      mapCenter,
      crimeReports,
      newMarker,
      form,
      addMarker,
      submitReport,
      cancelReport,
      openedInfoWindowIndex,
      onMarkerClick,
      onInfoWindowClose,
      showInfoWindow,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
.report-form {
  margin-top: 20px;
}
.report-form label {
  display: block;
  margin-bottom: 10px;
}
.report-form input,
.report-form textarea {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  box-sizing: border-box;
}
.report-form button {
  margin-right: 10px;
}
</style>