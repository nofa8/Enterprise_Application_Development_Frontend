<template>
  <div class="order-create max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
    <h1 class="text-center text-2xl font-bold mb-4">Create Order</h1>
    <form @submit.prevent="create" class="flex flex-col">
      <div class="mb-4">
        <label for="order-code" class="block text-sm font-medium text-gray-700 mb-1">Code:</label>
        <input v-model.trim="orderForm.code" type="number" id="order-code"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="codeError" class="error">ERROR: {{ codeError }}</span>
      </div>
      <div class="mb-4">
        <label for="order-price" class="block text-sm font-medium text-gray-700 mb-1">Price:</label>
        <input v-model.trim="orderForm.price" type="number" id="order-price"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="priceError" class="error">ERROR: {{ priceError }}</span>
      </div>
      <div class="mb-4">
        <label for="client-code" class="block text-sm font-medium text-gray-700 mb-1">Client ID:</label>
        <input v-model.trim="orderForm.clientCode" type="text" id="client-code"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="clientCodeError" class="error">ERROR: {{ clientCodeError }}</span>
      </div>
      <div class="mb-4">
        <label for="order-state" class="block text-sm font-medium text-gray-700 mb-1">State:</label>
        <select v-model="orderForm.state" id="order-state" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option disabled value="">-- Select a state --</option>
          <option v-for="state in validStates" :key="state" :value="state">{{ state }}</option>
        </select>
        <span v-if="stateError" class="error">ERROR: {{ stateError }}</span>
      </div>
      <div class="mb-4">
        <label for="purchase-date" class="block text-sm font-medium text-gray-700 mb-1">Purchase Date:</label>
        <input v-model.trim="orderForm.purchaseDate" type="date" id="purchase-date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="purchaseDateError" class="error">ERROR: {{ purchaseDateError }}</span>
      </div>
      <div class="flex space-x-4">
        <button type="reset" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">RESET</button>
        <button type="submit" :disabled="isFormInvalid"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">CREATE</button>
      </div>
    </form>
    <pre>{{ messages }}</pre>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
const orderForm = reactive({
  code: null,
  price: null,
  clientCode: null,
  state: null,
  purchaseDate: null,
});
const messages = ref([]);
const config = useRuntimeConfig();
const api = config.public.API_URL;

const validStates = ['PROCESSED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'];

const codeError = computed(() => {
  if (orderForm.code === null) return null;
  if (!orderForm.code) return 'Code is required';
  return null;
});

const priceError = computed(() => {
  if (orderForm.price === null) return null;
  if (!orderForm.price) return 'Price is required';
  if (orderForm.price <= 0) return 'Price must be greater than 0';
  return null;
});

const clientCodeError = computed(() => {
  if (orderForm.clientCode === null) return null;
  if (!orderForm.clientCode) return 'Client id is required';
  return null;
});

const stateError = computed(() => {
  if (orderForm.state === null) return null;
  if (!orderForm.state) return 'State is required';
  if (!validStates.includes(orderForm.state)) return `State must be one of: ${validStates.join(', ')}`;
  return null;
});

const purchaseDateError = computed(() => {
  if (orderForm.purchaseDate === null) return null;
  if (!orderForm.purchaseDate) return 'Purchase date is required';
  return null;
});

const isFormInvalid = computed(() => {
  return codeError.value || priceError.value || clientCodeError.value || stateError.value || purchaseDateError.value;
});

async function create() {
  try {
    const token = authStore.token;
    await $fetch(`${api}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: orderForm,
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