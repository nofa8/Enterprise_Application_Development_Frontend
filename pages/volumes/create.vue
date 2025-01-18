<template>
  <div class="volume-create max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
    <h1 class="text-center text-2xl font-bold mb-4">Create Volume</h1>
    <form @submit.prevent="create" class="flex flex-col">
      <div class="mb-4">
        <label for="order-code" class="block text-sm font-medium text-gray-700 mb-1">Order Code:</label>
        <input v-model.trim="codeOrder" type="number" id="order-code"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="orderCodeError" class="error">ERROR: {{ orderCodeError }}</span>
      </div>
      <div class="mb-4">
        <label for="volume-code" class="block text-sm font-medium text-gray-700 mb-1">Code:</label>
        <input v-model.trim="volumeForm.code" type="number" id="volume-code"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="codeError" class="error">ERROR: {{ codeError }}</span>
      </div>
      <div class="mb-4">
        <label for="volume-state" class="block text-sm font-medium text-gray-700 mb-1">State:</label>
        <select v-model="volumeForm.state" id="volume-state" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option v-for="state in validStates" :key="state" :value="state">{{ state }}</option>
        </select>
        <span v-if="stateError" class="error">ERROR: {{ stateError }}</span>
      </div>
      <div class="mb-4">
        <label for="package-type" class="block text-sm font-medium text-gray-700 mb-1">Package Type:</label>
        <select v-model="volumeForm.packageTypeCode" id="package-type"
          class="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option v-for="type in packageTypes" :key="type.code" :value="type.code">{{ type.name }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Sensors:</label>
        <div v-for="(sensor, index) in volumeForm.sensors" :key="index" class="mb-2">
          <input v-model.trim="sensor.code" type="number" placeholder="Sensor Code"
            class="w-full px-3 py-2 border border-gray-300 rounded-md mb-1" />
          <select v-model="sensor.sensorTypeCode" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option disabled value="">-- Select a sensor type --</option>
            <option v-for="type in sensorTypes" :key="type.code" :value="type.code">{{ type.name }}</option>
          </select>
          <button type="button" @click="removeSensor(index)" class="text-red-500 mt-1">Remove</button>
        </div>
        <button type="button" @click="addSensor"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">Add Sensor</button>
        <span v-if="sensorsError" class="error">ERROR: {{ sensorsError }}</span>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Products:</label>
        <div v-for="(product, index) in volumeForm.products" :key="index" class="mb-2">
          <input v-model.trim="product.code" type="number" placeholder="Product Code"
            class="w-full px-3 py-2 border border-gray-300 rounded-md mb-1" />
          <input v-model.trim="product.amount" type="number" placeholder="Product Amount"
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
          <button type="button" @click="removeProduct(index)" class="text-red-500 mt-1">Remove</button>
        </div>
        <button type="button" @click="addProduct"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">Add Product</button>
        <span v-if="productsError" class="error">ERROR: {{ productsError }}</span>
      </div>
      <div class="flex space-x-4">
        <button type="reset" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">RESET</button>
        <button type="submit" :disabled="isFormInvalid"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">CREATE</button>
      </div>
    </form>
    <div v-if="showMessage" :class="messageClass" class="mt-4 p-4 border rounded">
      {{ messages }}
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRuntimeConfig, useRoute } from '#app';
import { useAuthStore } from '~/store/auth';
import { useSensorTypesStore } from '~/store/sensor-types';
import { usePackageTypesStore } from '~/store/package-types';

const codeOrder = ref(null);
const authStore = useAuthStore();
const sensorTypesStore = useSensorTypesStore();
const packageTypesStore = usePackageTypesStore();

packageTypesStore.fetchPackageTypes();
sensorTypesStore.fetchSensorTypes();

const packageTypes = computed(() => packageTypesStore.packageTypes);
const sensorTypes = computed(() => sensorTypesStore.sensorTypes);

const volumeForm = reactive({
  code: null,
  state: null,
  packageTypeCode: null,
  sensors: [{ code: null, sensorTypeCode: '' }],
  products: [{ code: null, amount: null }],
});
const messages = ref('');
const showMessage = ref(false);
const isError = ref(false);

const api = inject('api');

const validStates = ['PACKED', 'IN_TRANSIT', 'SHIPPED', 'DELIVERED', 'RETURNED'];

const messageClass = computed(() => {
  return isError.value ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';
});

const codeError = computed(() => {
  if (volumeForm.code === null) return null;
  if (!volumeForm.code) return 'Code is required';
  if (volumeForm.code <= 0) return 'Order Code must be a positive number';
  return null;
});

const orderCodeError = computed(() => {
    if (codeOrder.value === null) return null;
    if (!codeOrder.value) return 'Order Code is required';
    if (codeOrder.value <= 0) return 'Order Code must be a positive number';
    return null;
  });

const stateError = computed(() => {
  if (volumeForm.state === null) return null;
  if (!volumeForm.state) return 'State is required';
  if (!validStates.includes(volumeForm.state)) return `State must be one of: ${validStates.join(', ')}`;
  return null;
});

const packageTypeError = computed(() => {
  if (volumeForm.packageTypeCode === null) return null;
  if (!volumeForm.packageTypeCode) return 'Package Type is required';
  return null;
});

const sensorsError = computed(() => {
  if (volumeForm.sensors.length === 0) return 'At least one sensor is required';
  if (volumeForm.sensors.code <= 0) return 'Sensor Code must be a positive number';
  return null;
});

const productsError = computed(() => {
  if (volumeForm.products.length === 0) return 'At least one product is required';
  if (volumeForm.products.code <= 0) return 'Product Code must be a positive number';
  if (volumeForm.products.amount <= 0) return 'Product Amount must be a positive number';
  return null;
});

const isFormInvalid = computed(() => {
  return codeError.value || stateError.value || packageTypeError.value || sensorsError.value || productsError.value || orderCodeError.value;
});

function addSensor() {
  volumeForm.sensors.push({ code: null, sensorTypeCode: '' });
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
    messages.value = '';
    showMessage.value = false;
    isError.value = false;
    const token = authStore.token;
    await $fetch(`${api}/orders/${codeOrder.value}/volumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify([volumeForm]),
      onResponse({ request, response, options }) {
        if (response.ok) {
          messages.value = 'Volume created successfully!';
        } else {
          messages.value = response._data;
          isError.value = true;
        }
        showMessage.value = true;
      },
    });
  } catch (e) {
    showMessage.value = true;
    isError.value = true;
    // console.log(e);
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>