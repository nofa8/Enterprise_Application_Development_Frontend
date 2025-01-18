<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useAuthStore} from "~/store/auth";
const authStore = useAuthStore()

interface Sensor {
  code: number;
  type: string;
}

const sensors = ref<Sensor[]>([]);
const error = ref<string | null>(null);

const fetchSensors = async () => {
  try {
    const tokenAdmin = authStore.token; // Replace with the actual token or fetch it dynamically.
    const response = await fetch('http://localhost:8080/monitor/api/sensors', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAdmin}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    sensors.value = data;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch sensors';
  }
};

// Fetch sensors on component mount
onMounted(fetchSensors);
</script>

<template>
  <div class="container">
    <h1 class="title">Sensors</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else>
      <ul class="sensor-list">
        <li v-for="sensor in sensors" :key="sensor.id" class="sensor-card">
          <div class="sensor-info">
            <h2>{{ sensor.code }}</h2>
            <p><strong>Type:</strong> {{ sensor.type }}</p>
            <nuxt-link :to="`/sensors/${sensor.code}`" class="text-blue-500 hover:underline">Details</nuxt-link>
            </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Container and layout styles */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Title */
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #2196F3;
}

/* Error message */
.error {
  color: #d32f2f;
  background-color: #f8d7da;
  padding: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

/* Sensor list and cards */
.sensor-list {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.sensor-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.sensor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.sensor-info h2 {
  font-size: 1.5rem;
  margin: 0 0 10px;
  color: #333;
}

.sensor-info p {
  margin: 5px 0;
  color: #555;
}

.status {
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
}

.status.active {
  color: #fff;
  background-color: #4CAF50;
}

.status.inactive {
  color: #fff;
  background-color: #f44336;
}

.status.maintenance {
  color: #fff;
  background-color: #FF9800;
}
</style>
