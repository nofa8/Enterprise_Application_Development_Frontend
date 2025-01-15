<template>
  <div class="dashboard">
    <h1>Welcome to the Dashboard</h1>
    <button @click="logout">Logout</button>
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

<style scoped>
.dashboard {
  text-align: center;
  margin: 50px auto;
}
</style>
