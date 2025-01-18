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
        <input v-model.trim="orderForm.clientCode" type="number" id="client-code"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="clientCodeError" class="error">ERROR: {{ clientCodeError }}</span>
      </div>
      <div class="mb-4">
        <label for="order-state" class="block text-sm font-medium text-gray-700 mb-1">State:</label>
        <select v-model="orderForm.state" id="order-state" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option v-for="state in validStates" :key="state" :value="state">{{ state }}</option>
        </select>
        <span v-if="stateError" class="error">ERROR: {{ stateError }}</span>
      </div>
      <div class="mb-4">
        <label for="purchase-date" class="block text-sm font-medium text-gray-700 mb-1">Purchase Date:</label>
        <input v-model.trim="orderForm.purchaseDate" type="datetime-local" id="purchase-date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="purchaseDateError" class="error">ERROR: {{ purchaseDateError }}</span>
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
const messages = ref('');
const showMessage = ref(false);
const isError = ref(false);
const config = useRuntimeConfig();
const api = config.public.API_URL;

const validStates = ['PROCESSED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'];

const messageClass = computed(() => {
  return isError.value ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';
});

const codeError = computed(() => {
  if (orderForm.code === null) return null;
  if (!orderForm.code) return 'Code is required';
  if (orderForm.code <= 0) return 'Code must be greater than 0';
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
  if (orderForm.clientCode <= 0) return 'Client id must be greater than 0';
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
    messages.value = '';
    showMessage.value = false;
    isError.value = false;
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
        if (response.ok) {
          messages.value = 'Order created successfully!';
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