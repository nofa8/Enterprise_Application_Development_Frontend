<template>
  <div class="orders">
    <h1>Orders</h1>
    <button @click="fetchOrders">Fetch Orders</button>

    <div v-if="loading" class="loading">Loading...</div>

    <table v-if="orders.length" class="orders-table">
      <thead>
      <tr>
        <th>Code</th>
        <th>Price</th>
        <th>State</th>
        <th>Last Update</th>
        <th>Purchase Date</th>
        <th v-if="authStore.user.role == 'Manager'">Client Name</th> <!-- Show client name for Managers -->
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.code">
        <td>{{ order.code }}</td>
        <td>{{ order.price }}</td>
        <td>{{ order.state }}</td>
        <td>{{ order.lastUpdate }}</td>
        <td>{{ order.purchaseDate }}</td>
        <!-- Display client name only if user is Manager -->
        <td v-if="authStore.user.role == 'Manager'">{{ order.client?.name || 'N/A' }}</td>
        <td>
          <button @click="goToOrderInfo(order.code)">View Details</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="!orders.length && !loading" class="no-data">
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
    const token = localStorage.getItem('authToken');
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

const goToOrderInfo = (orderCode) => {
  router.push({ name: 'OrderInfo', params: { orderCode } });
};
</script>

<style scoped>
.orders {
  text-align: center;
  margin: 20px auto;
}

.loading {
  font-size: 18px;
  color: blue;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto;
}

.orders-table th, .orders-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.orders-table th {
  background-color: #f4f4f4;
}

.no-data {
  color: red;
  font-size: 16px;
}
</style>
