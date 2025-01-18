<template>
  <div class="volume-update max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
    <h1 class="text-center text-2xl font-bold mb-4">Update Volume</h1>
    <form @submit.prevent="update" class="flex flex-col">
      <div class="mb-4">
        <label for="order-code" class="block text-sm font-medium text-gray-700 mb-1">Order Code:</label>
        <input v-model.trim="codeOrder" type="number" id="order-code"
          class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <span v-if="orderCodeError" class="error">ERROR: {{ codeError }}</span>
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
          <option disabled value="">-- Select a state --</option>
          <option v-for="state in validStates" :key="state" :value="state">{{ state }}</option>
        </select>
        <span v-if="stateError" class="error">ERROR: {{ stateError }}</span>
      </div>
      <div class="flex space-x-4">
        <button type="reset" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">RESET</button>
        <button type="submit" :disabled="isFormInvalid"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">UPDATE</button>
      </div>
    </form>
    <div v-if="showMessage" :class="messageClass" class="mt-4 p-4 border rounded">
      {{ messages }}
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRoute } from '#app';
import { useAuthStore } from '~/store/auth';

const route = useRoute();
const authStore = useAuthStore();
const codeOrder = ref(null);

const showMessage = ref(false);
const isError = ref(false);

const volumeForm = reactive({
  code: null,
  state: null,
});
const messages = ref('');
const api = inject('api');

const validStates = ['PACKED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'];

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

const isFormInvalid = computed(() => {
  return codeError.value || stateError.value || orderCodeError.value;
});

async function update() {
  try {
    messages.value = '';
    showMessage.value = false;
    isError.value = false;
    const token = authStore.token;
    await $fetch(`${api}/orders/${codeOrder.value}/volumes/${volumeForm.code}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(volumeForm.state),
      onResponse({ request, response, options }) {
        if (response.ok) {
          messages.value = 'Volume updated successfully!';
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