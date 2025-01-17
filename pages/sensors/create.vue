<template>
  <div
    class="sensor-update max-w-md mx-auto p-6 border border-gray-300 rounded-lg"
  >
    <h1 class="text-center text-2xl font-bold mb-4">Update Sensor Value</h1>
    <form @submit.prevent="updateSensor" class="flex flex-col">
      <div class="mb-4">
        <label
          for="sensor-id"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Sensor ID:</label
        >
        <select
        v-model="sensorId"
        id="sensor-select"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      >
        <option disabled value="">-- Select a sensor --</option>
        <option v-for="sensor in sensorsStore.sensors" :key="sensor.code" :value="sensor.code">
          {{ sensor.code }}
        </option>
      </select>
      </div>
      <div class="mb-4">
        <label
          for="sensor-value"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Sensor Value:</label
        >
        <input
          type="text"
          v-model="sensorValue"
          id="sensor-value"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      >
        Update
      </button>
    </form>
    <pre>{{ messages }}</pre>
  </div>
</template>

<script setup>
import { useSensorsStore } from '~/store/sensors';


const sensorsStore = useSensorsStore();


const messages = ref()
const api = inject('api')
const sensorId = ref('');
const sensorValue = ref('');
async function updateSensor() {
    await sensorsStore.updateSensor(sensorId.value, sensorValue.value);
    if (sensorsStore.error) {
      messages.value = sensorsStore.error;
    } else {
      messages.value = 'Sensor value updated successfully';
    }
};
onMounted(() => {
  sensorsStore.fetchSensors(); 
});
</script>
