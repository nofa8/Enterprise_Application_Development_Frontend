<template>
    <div class="order-update max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
        <h1 class="text-center text-2xl font-bold mb-4">Update Order</h1>
        <form @submit.prevent="update" class="flex flex-col">
            <div class="mb-4">
                <label for="order-code" class="block text-sm font-medium text-gray-700 mb-1">Code:</label>
                <input v-model.trim="orderForm.code" type="number" id="order-code"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <span v-if="codeError" class="error">ERROR: {{ codeError }}</span>
            </div>
            <div class="mb-4">
                <label for="order-state" class="block text-sm font-medium text-gray-700 mb-1">State:</label>
                <select v-model="orderForm.state" id="order-state"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option disabled value="">-- Select a state --</option>
                    <option v-for="state in validStates" :key="state" :value="state">{{ state }}</option>
                </select>
                <span v-if="stateError" class="error">ERROR: {{ stateError }}</span>
            </div>
            <div class="flex space-x-4">
                <button type="reset"
                    class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">RESET</button>
                <button type="submit" :disabled="isFormInvalid"
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">UPDATE</button>
            </div>
        </form>
        <pre>{{ messages }}</pre>
    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRuntimeConfig } from '#app';

const orderForm = reactive({
    code: null,
    state: null
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

const stateError = computed(() => {
    if (orderForm.state === null) return null;
    if (!orderForm.state) return 'State is required';
    if (!validStates.includes(orderForm.state)) return `State must be one of: ${validStates.join(', ')}`;
    return null;
});

const isFormInvalid = computed(() => {
    return codeError.value || stateError.value;
});

async function update() {
    try {
        const token = localStorage.getItem('token');
        await $fetch(`${api}/orders/${orderForm.code}`, {
            method: 'PATCH',
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