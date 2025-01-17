<template>
  <div class="orders text-center my-8">
    <h1 class="text-3xl font-bold mb-6">Orders</h1>
    <button @click="fetchOrders" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Fetch
      Orders</button>

    <div v-if="loading" class="loading text-lg text-blue-500 mt-4">Loading...</div>

    <table v-if="orders.length" class="orders-table w-full border-collapse mt-6">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">Code</th>
          <th class="border px-4 py-2">Price</th>
          <th class="border px-4 py-2">State</th>
          <th class="border px-4 py-2">Last Update</th>
          <th class="border px-4 py-2">Purchase Date</th>
          <th v-if="authStore.getUserType == 'Manager'" class="border px-4 py-2">Client Name</th>
          <th class="border px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.code" class="hover:bg-gray-50">
          <td class="border px-4 py-2">{{ order.code }}</td>
          <td class="border px-4 py-2">{{ order.price }}</td>
          <td class="border px-4 py-2">{{ order.state }}</td>
          <td class="border px-4 py-2">{{ order.lastUpdate }}</td>
          <td class="border px-4 py-2">{{ order.purchaseDate }}</td>
          <td v-if="authStore.getUserType == 'Manager'" class="border px-4 py-2">{{ order.client?.name || 'N/A' }}</td>
          <td class="border px-4 py-2">
            <nuxt-link :to="`/orders/${order.code}`" class="text-blue-500 hover:underline">Details</nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!orders.length && !loading" class="no-data text-red-500 text-lg mt-4">
      No orders found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/store/auth';


const authStore = useAuthStore();

const orders = ref([]);
const loading = ref(false);
const router = useRouter();

onMounted(() => {
  if (process.client) {
    fetchOrders(); // Call fetchOrders automatically when the component is mounted
  }
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const token = authStore.token;
    if (!token) {
      throw new Error('No authentication token found.');
    }

    // Make the GET request
    const response = await fetch('http://localhost:8080/monitor/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error('Failed to fetch orders.');
    }

    // Parse the response JSON
    const data = await response.json();

    // Check if the response contains an array and update orders
    if (Array.isArray(data) && data.length > 0) {
      orders.value = data; // Populate the orders array
    } else {
      orders.value = [];
    }

  } catch (error) {
    console.error('Error fetching orders:', error);
    alert('Failed to fetch orders. Please check the console for details.');
  } finally {
    loading.value = false;
  }
};
</script>