<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { useAuthStore } from "~/store/auth";
import { utils, writeFile } from "xlsx";
import { Line } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from "chart.js";

// Registro dos componentes do Chart.js e do Filler plugin
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const authStore = useAuthStore();
const route = useRoute();

// State variables
const sensorLog = ref<{ value: string; timestamp: string }[]>([]);
const errorMessage = ref<string | null>(null);
const code_sensor = route.params.code_sensor;
const url = `http://localhost:8080/monitor/api/sensors/${code_sensor}/log`;

// Definindo o tipo para o chartData
interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }>;
}

// Inicializando os dados do gráfico
const chartData = ref<ChartData>({
  labels: [],
  datasets: [{
    label: 'Sensor Value',
    data: [],
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    fill: true,
  }]
});

// Forçar a atualização do gráfico com uma chave única
const chartKey = ref(0); // Chave para forçar re-render

// Fetching data from the API
const fetchSensorLog = async () => {
  try {
    const token = authStore.token;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch sensor log data.");
    const data = await response.json();

    console.log("Fetched data:", data); // Debugging line to check the fetched data

    // Sort the data by timestamp (most recent first)
    sensorLog.value = data.sort((a: { timestamp: string }, b: { timestamp: string }) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error: any) {
    errorMessage.value = error.message;
  }
};

// Watcher to update chart data when sensorLog changes
watchEffect(() => {
  if (sensorLog.value.length > 0) {
    console.log("Updating chart data..."); // Debugging line to check when chart data is updated
    chartData.value.labels = sensorLog.value.map(log => log.timestamp); // Timestamps
    chartData.value.datasets[0].data = sensorLog.value.map(log => parseFloat(log.value)); // Sensor values
    chartKey.value++; // Força a re-renderização do gráfico
    console.log("Chart data:", chartData.value); // Debugging line to check chart data before rendering
  }
});

// Export data to Excel
const exportToExcel = () => {
  if (sensorLog.value.length === 0) {
    alert("No data available to export.");
    return;
  }

  const worksheet = utils.json_to_sheet(sensorLog.value);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "SensorLog");

  writeFile(workbook, `SensorLog_${code_sensor}.xlsx`);
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
    <table v-if="sensorLog.length"
      class="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-200 text-gray-700">
        <tr>
          <th class="py-3 px-4 text-left">Value</th>
          <th class="py-3 px-4 text-left">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, index) in sensorLog" :key="index" class="border-b last:border-b-0 hover:bg-gray-100">
          <td class="py-3 px-4">{{ log.value }}</td>
          <td class="py-3 px-4">{{ log.timestamp }}</td>
        </tr>
      </tbody>
    </table>

    <!-- No Data Message -->
    <p v-else class="text-gray-600">No log data available.</p>

    <!-- Buttons -->
    <div class="flex justify-between mt-8">
      <!-- Return Button -->
      <nuxt-link v-if="authStore.getUserType == 'Manager'" :to="`/sensors/${code_sensor}`"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Return
      </nuxt-link>

      <!-- Export Button -->
      <button @click="exportToExcel"
        class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
        Export to Excel
      </button>
    </div>

    <!-- Chart -->
    <div class="mt-8">
      <Line :data="chartData" :key="chartKey" /> <!-- A chave foi adicionada aqui para forçar o re-render -->
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
