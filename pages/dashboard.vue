<template>
  <div class="dashboard my-12 px-4 sm:px-6 lg:px-8">
    <!-- Welcome Header -->
    <h1 class="text-3xl font-semibold text-gray-800 mb-8 text-center">
      Dashboard
    </h1>

    <!-- Main Dashboard Content -->
    <div class="max-w-3xl mx-auto">
      <div v-if="authStore.isLoggedIn">
        <!-- Client Actions -->
        <div v-if="authStore.getUserType === 'Client'" class="flex flex-col space-y-4">
          <nuxt-link
            to="/orders"
            class="block px-4 py-3 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            View Orders
          </nuxt-link>
        </div>

        <!-- Logistic Actions -->
        <div v-if="authStore.getUserType === 'Logistic'" class="flex flex-col space-y-4">
          <nuxt-link
            to="/orders/create"
            class="block px-4 py-3 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Insert Orders
          </nuxt-link>
          <nuxt-link
            to="/orders/update"
            class="block px-4 py-3 text-center bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Update Orders
          </nuxt-link>
          <nuxt-link
            to="/volumes/create"
            class="block px-4 py-3 text-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Insert Volumes
          </nuxt-link>
          <nuxt-link
            to="/volumes/update"
            class="block px-4 py-3 text-center bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Update Volumes
          </nuxt-link>
        </div>

        <!-- Admin Actions -->
        <div v-if="authStore.getUserType === 'Manager'" class="flex flex-col space-y-4">
          <nuxt-link
            to="/clients"
            class="block px-4 py-3 text-center bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 transition"
          >
            View Clients
          </nuxt-link>
          <nuxt-link
            to="/sensors"
            class="block px-4 py-3 text-center bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 transition"
          >
            View Sensors
          </nuxt-link>
          <nuxt-link
            to="/orders"
            class="block px-4 py-3 text-center bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 transition"
          >
            View Orders
          </nuxt-link>
        </div>
      </div>

      <!-- Shared Action: Insert Sensor Values -->
      <div class="mt-6">
        <nuxt-link
          to="/sensors/create"
          class="block px-4 py-3 text-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Insert Sensor Values (Only for Test purposes)
        </nuxt-link>
      </div>
    </div>
  </div>
</template>



<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
const router = useRouter();


const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/auth/login');
};
</script>