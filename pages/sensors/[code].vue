<template>
  <div v-if="sensorData" class="sensor-container">
    <h1 class="sensor-title">Sensor Details</h1>
    <div class="sensor-info">
      <p><strong>Code:</strong> <span class="sensor-value">{{ sensorData.code }}</span></p>
      <p><strong>Sensor Type:</strong> <span class="sensor-value">{{ sensorTypeLabel }}</span></p>
      <p><strong>Value:</strong> <span class="sensor-value">{{ formattedValue }}</span></p>
      <p><strong>Last Update:</strong> <span class="sensor-value">{{ formatDate(sensorData.lastUpdate) }}</span></p>

      <div class="mt-3">
        <nuxt-link
            :to="`/sensors/${code}/log`"
            class="text-white bg-blue-600 px-4 py-2  rounded-lg transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4">
          Histórico
        </nuxt-link>
      </div>



    </div>
    <div v-if="sensorData.sensorTypeCode === 4" id="map" class="map-container"></div>
  </div>
  <div v-else class="loading">
    <p>Loading sensor data...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useAuthStore} from "~/store/auth";
import {useRoute} from "#vue-router";
import maplibregl from 'maplibre-gl';

// Set your Mapbox access token



const authStore = useAuthStore()
const route = useRoute();
const code = route.params.code;
// Define the sensor data object
const sensorData = ref<any>(null);

// Function to fetch sensor data from the API
const fetchSensorData = async (sensorId: number) => {
  const token = authStore.token ; // Replace with actual token logic
  const url = `http://localhost:8080/monitor/api/sensors/${sensorId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      sensorData.value = await response.json();
    } else {
      console.error('Failed to fetch sensor data:', response.status);
    }
  } catch (error) {
    console.error('Error fetching sensor data:', error);
  }
};

// Format timestamp to a human-readable date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Formats the date to a local string (e.g., MM/DD/YYYY, HH:mm)
};

// Computed property to return the correct sensor type label based on sensorTypeCode
const sensorTypeLabel = computed(() => {
  switch (sensorData.value?.sensorTypeCode) {
    case 1:
      return 'Temperature Sensor';
    case 2:
      return 'Atmospheric Pressure Sensor';
    case 3:
      return 'Accelerometer';
    case 4:
      return 'Global Positioning Sensor';
    case 5:
      return 'Humidity Sensor';
    case 6:
      return 'Light Sensor';
    case 7:
      return 'Infrared Sensor';
    case 8:
      return 'Ultrasonic Sensor';
    default:
      return 'Unknown Sensor Type';
  }
});

const formattedValue = computed(() => {
  const value = sensorData.value?.value;
  const sensorType = sensorData.value?.sensorTypeCode;

  switch (sensorType) {
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
      return value > 0 ? 'Detected' : 'Not Detected'; // Assuming binary detection (0 or 1)
    case 8: // Ultrasonic Sensor
      return `${value} meters`; // Assuming the value is a distance in meters
    default:
      return value; // Default case if the sensor type is not recognized
  }
});

// Fetch the sensor data when the component is mounted
onMounted( () => {
  const sensorId = code; // Use the sensor ID you want to fetch
  fetchSensorData(sensorId);
});

watchEffect(() => {
  if (sensorData.value && sensorData.value.sensorTypeCode === 4) {
    initializeMap(); // Initialize the map only if the sensor type is GPS
  }
});



const initializeMap = async () => {
  await nextTick(); // Ensure the DOM is updated and map container is available

  if (sensorData.value?.sensorTypeCode === 4) {
    const coordinates = sensorData.value?.value.split(',');
    const lat = parseFloat(coordinates[0]);
    const lon = parseFloat(coordinates[1]);

    if (!isNaN(lat) && !isNaN(lon)) {
      // Initialize MapLibre map
      const map = new maplibregl.Map({
        container: 'map', // Map container ID
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
            },
          ],
        },
        center: [lon, lat], // Center the map on the GPS coordinates
        zoom: 17, // Set zoom level
      });

      // Add a marker at the coordinates
      let marker = new maplibregl.Marker()
          .setLngLat([lon+0.002, lat+0.0012]);

      // Disable interactions to make the map fixed
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.boxZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();

      marker.addTo(map)
    } else {
      console.error('Invalid coordinates:', coordinates);
    }
    console.log('Centering map at:', [lat, lon]);

  }
};

</script>

<style scoped>


.sensor-container {
  max-width: 800px;
  margin: 20px auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.sensor-title {
  text-align: center;
  color: #4CAF50;
  font-size: 28px;
  margin-bottom: 20px;
}

.sensor-info {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 40px; /* Add some space between sensor info and map */
}

.sensor-info h2 {
  color: #333;
  font-size: 24px;
}

.sensor-info p {
  font-size: 16px;
  color: #666;
}
#map {
  height: 300px; /* Ensure the map fills the container */
  width: 100%;
}
.map-container {
  height: 100%; /* Fixed height for the map */
  width: 100%; /* Full width of the container */
  border-radius: 8px;
  margin-top: 20px;
  pointer-events: none; /* Disable interactions completely */
}
strong {
  color: #333;
}

.sensor-value {
  color: #00796B;
  font-weight: bold;
}

.log-title {
  margin-top: 20px;
  color: #4CAF50;
  font-size: 20px;
}

.log-list {
  margin-top: 10px;
  list-style-type: none;
  padding-left: 0;
}

.log-item {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
}

.no-logs {
  font-style: italic;
  color: #888;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #555;
}

/* Special Styling for Different Sensor Types */
.sensor-info p {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.sensor-info p[data-type="1"] {
  background-color: #FFEBEE; /* Light pink for temperature sensor */
  color: #D32F2F;
}

.sensor-info p[data-type="2"] {
  background-color: #E3F2FD; /* Light blue for atmospheric pressure sensor */
  color: #1976D2;
}

.sensor-info p[data-type="3"] {
  background-color: #F3E5F5; /* Light purple for accelerometer */
  color: #8E24AA;
}

.sensor-info p[data-type="4"] {
  background-color: #C8E6C9; /* Light green for GPS */
  color: #388E3C;
}

.sensor-info p[data-type="5"] {
  background-color: #FFF9C4; /* Light yellow for humidity */
  color: #FBC02D;
}

.sensor-info p[data-type="6"] {
  background-color: #FFECB3; /* Light amber for light sensor */
  color: #FF9800;
}

.sensor-info p[data-type="7"] {
  background-color: #F5F5F5; /* Light gray for infrared */
  color: #607D8B;
}

.sensor-info p[data-type="8"] {
  background-color: #FFF3E0; /* Light orange for ultrasonic */
  color: #FF5722;
}
</style>