<template>
  <div class="dashboard text-center my-12">
    <h1 class="text-4xl font-bold mb-8">Welcome to the Dashboard</h1>
    <nuxt-link to="/orders" class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">View Orders</nuxt-link>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/login');
};
</script>