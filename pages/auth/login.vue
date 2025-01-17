<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="mb-6 text-2xl font-bold text-center text-gray-700">Login</h1>
      <form @submit.prevent="loginUser" class="space-y-4">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input
            v-model="email"
            type="email"
            id="email"
            required
            class="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input
            v-model="password"
            type="password"
            id="password"
            required
            class="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Login
        </button>
      </form>

      <!-- Error Message -->
      <p v-if="error" class="mt-4 text-sm font-medium text-center text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/store/auth';


const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref(null);

const loginUser = async () => {
  try {
    await authStore.handleLogin(email.value, password.value);
  } catch (err) {
    error.value = err.message; 
  }
};
</script>
