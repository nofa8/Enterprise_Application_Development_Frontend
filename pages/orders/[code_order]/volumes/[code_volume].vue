<template>
    <div v-if="volume" class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 class="text-2xl font-bold mb-6 text-center sm:text-3xl">
        Details of Volume <span class="text-blue-500">{{ volume.code }}</span>
      </h2>
  
      <!-- Volume Details -->
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-x-4">
          <span class="font-semibold">Volume Code:</span>
          <span>{{ volume.code }}</span>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <span class="font-semibold">State:</span>
          <span>{{ volume.state }}</span>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <span class="font-semibold">Package Type:</span>
          <span>{{ volume.packageTypeCode }}</span>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <span class="font-semibold">Last Update:</span>
          <span>{{ formatDate(volume.lastUpdate) }}</span>
        </div>
      </div>
  
      <!-- Sensors -->
      <div class="mt-10">
        <h3 class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Sensors</h3>
        <ul v-if="volume.sensors.length" class="space-y-4">
          <li
            v-for="sensor in volume.sensors"
            :key="sensor.code"
            class="p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <div class="grid grid-cols-2 gap-x-4">
              <span class="font-semibold">Sensor Code:</span>
              <span>{{ sensor.code }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-4">
              <span class="font-semibold">Value:</span>
              <span>{{ sensor.value }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-4">
              <span class="font-semibold">Last Update:</span>
              <span> {{ formatDate(sensor.lastUpdate) }}</span>
            </div>
          </li>
        </ul>
        <p v-else class="text-gray-500">No sensors available.</p>
      </div>
  
      <!-- Products -->
      <div class="mt-10">
        <h3 class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Products</h3>
        <ul v-if="volume.products.length" class="space-y-4">
          <li
            v-for="product in volume.products"
            :key="product.code"
            class="p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <div class="grid grid-cols-2 gap-x-4">
              <span class="font-semibold">Name:</span>
              <span>{{ product.name }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-4">
              <span class="font-semibold">Brand:</span>
              <span>{{ product.brand }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-4">
              <span class="font-semibold">Description:</span>
              <span>{{ product.description }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-4">
              <span class="font-semibold">Amount:</span>
              <span>{{ product.amount }}</span>
            </div>
          </li>
        </ul>
        <p v-else class="text-gray-500">No products available.</p>
      </div>
  
      <!-- Return Button -->
      <div class="mt-8 text-center">
        <nuxt-link
          :to="`/orders/${codeOrder}`"
          class="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Return
        </nuxt-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRoute } from "vue-router";
  import { useRuntimeConfig } from "#imports";
  import { useAuthStore } from "~/store/auth";
  
  const route = useRoute();
  const codeOrder = route.params.code_order;
  const codeVolume = route.params.code_volume;
  
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  
  const authStore = useAuthStore();
  const volume = ref(null);
  
  const fetchVolumeDetails = async () => {
    try {
      const token = authStore.token;
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      const response = await fetch(
        `${api}/orders/${codeOrder}/volumes/${codeVolume}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch volume details.");
      }
  
      volume.value = await response.json();
      // console.log(volume.value);
    } catch (err) {
      console.error(err.message);
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };
  
  fetchVolumeDetails();
  </script>
  