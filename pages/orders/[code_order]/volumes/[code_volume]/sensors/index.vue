<template>
  <div class="container">
    <h1 class="title">Sensor Data</h1>

    <div class="filter-container bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Filter by Sensor Type</h2>

      <div class="mb-6">
        <label for="sensorType" class="block text-gray-700 font-medium mb-2">Select Sensor Type</label>
        <select id="sensorType" v-model="sensorTypeFilter" @change="fetchSensorData" class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All</option>
          <option v-for="sensorType in uniqueSensorTypes" :key="sensorType.name" :value="sensorType.name">
            {{ sensorType.name }}
          </option>
        </select>
      </div>
      <div class="text-center mt-8">
        <nuxt-link
            :to="`/orders/${codeOrder}/volumes/${codeVolume}`"
            class="inline-block px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out">
          Return to Order Volume
        </nuxt-link>
      </div>
    </div>

    <div v-if="loading" class="message loading">Loading...</div>
    <div v-else-if="error" class="message error">{{ error }}</div>

    <div v-else>
      <!-- Display "No sensors found" message if no sensors match the filter -->
      <div v-if="filteredSensors.length === 0" class="message not-found">
        No sensors found for the selected filter.
      </div>

      <div v-for="sensor in filteredSensors" :key="sensor.code" class="sensor-card">
        <h2 class="sensor-title">{{ sensorTypeLabel(sensor.sensorTypeCode) }} (Code: {{ sensor.code }})</h2>
        <ul class="sensor-log">
          <li v-for="log in sortedLogs(sensor.log)" :key="log.timestamp" class="log-item">
            <span class="log-timestamp">{{ log.timestamp }}</span>
            <span class="log-value">{{ formattedValue(sensor.value, sensor.sensorTypeCode) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from "~/store/auth";
import { useSensorTypesStore } from "~/store/sensor-types";

const route = useRoute();

const codeOrder = route.params.code_order;
const codeVolume = route.params.code_volume;

const sensors = ref([]);
const loading = ref(true);
const error = ref(null);
const sensorTypeFilter = ref("");

const sensorTypesStore = useSensorTypesStore();

// Fetch sensor data and sensor types on mount
onMounted(async () => {
  await sensorTypesStore.fetchSensorTypes();
  fetchSensorData();
});

const fetchSensorData = async () => {
  const authStore = useAuthStore();
  const token = authStore.token;

  let apiUrl = `http://localhost:8080/monitor/api/orders/${codeOrder}/volumes/${codeVolume}/sensors`;

  if (sensorTypeFilter.value) {
    apiUrl += `?sensorType=${sensorTypeFilter.value}`;
  }

  try {
    loading.value = true;
    error.value = null;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'No sensors found for the selected filter.';
        return;
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    sensors.value = await response.json();
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};

// Sort the logs by timestamp in descending order
const sortedLogs = (logs) => {
  return [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Get unique sensor types
const uniqueSensorTypes = computed(() => {
  return sensorTypesStore.sensorTypes;
});

// Filter sensors based on the selected type
const filteredSensors = computed(() => {
  if (!sensorTypeFilter.value) return sensors.value;

  const selectedSensorType = sensorTypesStore.sensorTypes.find(
      (sensorType) => sensorType.name === sensorTypeFilter.value
  );

  if (selectedSensorType) {
    return sensors.value.filter(
        (sensor) => sensor.sensorTypeCode === selectedSensorType.code
    );
  }

  return [];
});

// Get sensor type label based on sensorTypeCode
const sensorTypeLabel = (sensorTypeCode) => {
  switch (sensorTypeCode) {
    case 1:
      return "Temperature Sensor";
    case 2:
      return "Atmospheric Pressure Sensor";
    case 3:
      return "Accelerometer";
    case 4:
      return "Global Positioning Sensor";
    case 5:
      return "Humidity Sensor";
    case 6:
      return "Light Sensor";
    case 7:
      return "Infrared Sensor";
    case 8:
      return "Ultrasonic Sensor";
    default:
      return "Unknown Sensor Type";
  }
};

// Format the value based on sensor type
const formattedValue = (value, sensorTypeCode) => {
  switch (sensorTypeCode) {
    case 1: // Temperature Sensor
      return `${value} °C`; // Assuming the value is in Celsius
    case 2: // Atmospheric Pressure Sensor
      return `${value} hPa`; // Assuming the value is in hPa (hectopascals)
    case 3: // Accelerometer
      return `${value} m/s²`; // Assuming the value is in meters per second squared
    case 4: // GPS
      return `Latitude/Longitude: ${value}`; // Assuming the value represents coordinates
    case 5: // Humidity Sensor
      return `${value} % RH`; // Assuming the value is in percentage relative humidity
    case 6: // Light Sensor
      return `${value} lux`; // Assuming the value is in lux
    case 7: // Infrared Sensor
      return value > 0 ? "Detected" : "Not Detected"; // Assuming binary detection (0 or 1)
    case 8: // Ultrasonic Sensor
      return `${value} meters`; // Assuming the value is a distance in meters
    default:
      return value; // Default case if the sensor type is not recognized
  }
};
</script>


<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.message {
  text-align: center;
  font-size: 1.2rem;
  margin: 10px 0;
}

.loading {
  color: #007bff;
}

.error {
  color: #dc3545;
}

.sensor-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sensor-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.sensor-log {
  list-style: none;
  padding: 0;
}

.log-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
}

.log-item:last-child {
  border-bottom: none;
}

.log-timestamp {
  color: #555;
}

.log-value {
  font-weight: bold;
  color: #333;
}

.filter-container {
  margin: 20px 0;
  text-align: center;
}

.filter-container label {
  font-size: 1rem;
  margin-right: 10px;
}

.filter-container select {
  padding: 5px 10px;
  font-size: 1rem;
}

.text-center {
  text-align: center;
}

.mt-8 {
  margin-top: 2rem;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}

.focus\:outline-none:focus {
  outline: none;
}

.focus\:ring-2:focus {
  ring-width: 2px;
}

.focus\:ring-blue-300:focus {
  ring-color: #93c5fd;
}

.transition-all {
  transition: all 0.3s ease-in-out;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-in-out {
  transition-timing-function: ease-in-out;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.rounded-lg {
  border-radius: 8px;
}
</style>
