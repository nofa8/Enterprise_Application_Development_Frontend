<template>
    <div class="volume-create max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
      <h1 class="text-center text-2xl font-bold mb-4">Create Volume</h1>
      <form @submit.prevent="create" class="flex flex-col">
        <div class="mb-4">
          <label for="volume-code" class="block text-sm font-medium text-gray-700 mb-1">Code:</label>
          <input v-model.trim="volumeForm.code" type="number" id="volume-code" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
          <span v-if="codeError" class="error">ERROR: {{ codeError }}</span>
        </div>
        <div class="mb-4">
          <label for="volume-state" class="block text-sm font-medium text-gray-700 mb-1">State:</label>
          <select v-model="volumeForm.state" id="volume-state" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option disabled value="">-- Select a state --</option>
            <option v-for="state in validStates" :key="state" :value="state">{{ state }}</option>
          </select>
          <span v-if="stateError" class="error">ERROR: {{ stateError }}</span>
        </div>
        <div class="mb-4">
          <label for="package-type" class="block text-sm font-medium text-gray-700 mb-1">Package Type:</label>
          <input v-model.trim="volumeForm.packageType" type="number" id="package-type" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
          <span v-if="packageTypeError" class="error">ERROR: {{ packageTypeError }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sensors:</label>
          <div v-for="(sensor, index) in volumeForm.sensors" :key="index" class="mb-2">
            <input v-model.trim="sensor.code" type="number" placeholder="Sensor Code" class="w-full px-3 py-2 border border-gray-300 rounded-md mb-1" />
            <input v-model.trim="sensor.sensorType" type="text" placeholder="Sensor Type" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            <button type="button" @click="removeSensor(index)" class="text-red-500 mt-1">Remove</button>
          </div>
          <button type="button" @click="addSensor" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">Add Sensor</button>
          <span v-if="sensorsError" class="error">ERROR: {{ sensorsError }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Products:</label>
          <div v-for="(product, index) in volumeForm.products" :key="index" class="mb-2">
            <input v-model.trim="product.code" type="number" placeholder="Product Code" class="w-full px-3 py-2 border border-gray-300 rounded-md mb-1" />
            <input v-model.trim="product.amount" type="number" placeholder="Product Amount" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            <button type="button" @click="removeProduct(index)" class="text-red-500 mt-1">Remove</button>
          </div>
          <button type="button" @click="addProduct" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">Add Product</button>
          <span v-if="productsError" class="error">ERROR: {{ productsError }}</span>
        </div>
        <div class="flex space-x-4">
          <button type="reset" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">RESET</button>
          <button type="submit" :disabled="isFormInvalid" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">CREATE</button>
        </div>
      </form>
      <pre>{{ messages }}</pre>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue';
  import { useRuntimeConfig, useRoute } from '#app';
  
  const route = useRoute();
  const codeOrder = route.params.code_order;
  
  const volumeForm = reactive({
    code: null,
    state: null,
    packageType: null,
    sensors: [{ code: null, sensorType: '' }],
    products: [{ code: null, amount: null }],
  });
  const messages = ref([]);
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  
  const validStates = ['PROCESSED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'];
  
  const codeError = computed(() => {
    if (volumeForm.code === null) return null;
    if (!volumeForm.code) return 'Code is required';
    return null;
  });
  
  const stateError = computed(() => {
    if (volumeForm.state === null) return null;
    if (!volumeForm.state) return 'State is required';
    if (!validStates.includes(volumeForm.state)) return `State must be one of: ${validStates.join(', ')}`;
    return null;
  });
  
  const packageTypeError = computed(() => {
    if (volumeForm.packageType === null) return null;
    if (!volumeForm.packageType) return 'Package Type is required';
    return null;
  });
  
  const sensorsError = computed(() => {
    if (volumeForm.sensors.length === 0) return 'At least one sensor is required';
    return null;
  });
  
  const productsError = computed(() => {
    if (volumeForm.products.length === 0) return 'At least one product is required';
    return null;
  });
  
  const isFormInvalid = computed(() => {
    return codeError.value || stateError.value || packageTypeError.value || sensorsError.value || productsError.value;
  });
  
  function addSensor() {
    volumeForm.sensors.push({ code: null, sensorType: '' });
  }
  
  function removeSensor(index) {
    volumeForm.sensors.splice(index, 1);
  }
  
  function addProduct() {
    volumeForm.products.push({ code: null, amount: null });
  }
  
  function removeProduct(index) {
    volumeForm.products.splice(index, 1);
  }
  
  async function create() {
    try {
      const token = localStorage.getItem('token');
      await $fetch(`${api}/orders/${codeOrder}/volumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(volumeForm),
        onResponse({ request, response, options }) {
          messages.value.push({
            method: options.method,
            request: request,
            status: response.status,
            statusText: response.statusText,
            payload: response._data,
          });
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>