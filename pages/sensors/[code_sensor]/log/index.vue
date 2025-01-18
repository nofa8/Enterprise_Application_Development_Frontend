<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth";
const authStore = useAuthStore();
const route = useRoute();

// State variables
const sensorLog = ref<{ value: string; timestamp: string }[]>([]);
const errorMessage = ref<string | null>(null);
const code_sensor = route.params.code_sensor;
const url = `http://localhost:8080/monitor/api/sensors/${code_sensor}/log`;

// Fetching data
const fetchSensorLog = async () => {
  try {
    const token = authStore.token;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Replace with actual tokenAdmin variable
      },
    });
    if (!response.ok) throw new Error("Failed to fetch sensor log data.");
    const data = await response.json();

    // Sort the data by timestamp (most recent first)
    sensorLog.value = data.sort((a: { timestamp: string }, b: { timestamp: string }) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error: any) {
    errorMessage.value = error.message;
  }
};

// Lifecycle hook to fetch data on component mount
onMounted(() => {
  fetchSensorLog();
});
</script>

<template>
  <div class="container mx-auto p-6">
    <!-- Title -->
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Sensor Log</h1>

    <!-- Error Message -->
    <div v-if="errorMessage" class="text-red-600 mb-4">
      {{ errorMessage }}
    </div>

    <!-- Table -->
    <table v-if="sensorLog.length" class="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-200 text-gray-700">
      <tr>
        <th class="py-3 px-4 text-left">Value</th>
        <th class="py-3 px-4 text-left">Timestamp</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(log, index) in sensorLog"
          :key="index"
          class="border-b last:border-b-0 hover:bg-gray-100"
      >
        <td class="py-3 px-4">{{ log.value }}</td>
        <td class="py-3 px-4">{{ log.timestamp }}</td>
      </tr>
      </tbody>
    </table>

    <div v-if="authStore.getUserType == 'Manager' " class="mt-8">
      <nuxt-link :to="`/sensors/${code_sensor}`"
                 class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Return</nuxt-link>
    </div>
    <!-- No Data Message -->
    <p v-else class="text-gray-600">No log data available.</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
