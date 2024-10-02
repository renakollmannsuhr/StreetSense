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
      />
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

    const fetchCrimeReports = async () => {
      try {
        const response = await axios.get('/api/reports/');
        crimeReports.value = response.data;
      } catch (error) {
        console.error('Error fetching crime reports:', error);
      }
    };

    const addMarker = (event) => {
      newMarker.value = {
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      };
    };

    const submitReport = async () => {
      try {
        const reportData = {
          title: form.value.title,
          description: form.value.description,
          latitude: newMarker.value.position.lat,
          longitude: newMarker.value.position.lng,
        };
        await axios.post('/api/reports/', reportData);
        form.value.title = '';
        form.value.description = '';
        newMarker.value = null;
        fetchCrimeReports();
      } catch (error) {
        console.error('Error submitting crime report:', error);
      }
    };

    const cancelReport = () => {
      newMarker.value = null;
      form.value.title = '';
      form.value.description = '';
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
    };
  },
};
</script>

<style scoped>
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



