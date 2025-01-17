<template>
  <div class="dashboard">
    <h1>Welcome to the Dashboard</h1>
    <button @click="logout">Logout</button>
    <button @click="goToOrders">View Orders</button>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/login');
};

const goToOrders = () => {
  router.push('/orders');
};
</script>

<style scoped>
.dashboard {
  text-align: center;
  margin: 50px auto;
}
</style>
