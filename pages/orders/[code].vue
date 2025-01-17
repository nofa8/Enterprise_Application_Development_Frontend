<template>
  <div v-if="order" class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-bold mb-6 text-center sm:text-3xl">
      Details of Order <span class="text-blue-500">{{ order.code }}</span>
    </h2>

    <!-- Order Details -->
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-x-4">
        <span class="font-semibold">Order Code:</span>
        <span>{{ order.code }}</span>
      </div>
      <div class="grid grid-cols-2 gap-x-4">
        <span class="font-semibold">Price:</span>
        <span>{{ order.price }}</span>
      </div>
      <div class="grid grid-cols-2 gap-x-4">
        <span class="font-semibold">State:</span>
        <span>{{ order.state }}</span>
      </div>
      <div class="grid grid-cols-2 gap-x-4">
        <span class="font-semibold">Last Update:</span>
        <span>{{ order.lastUpdate }}</span>
      </div>
      <div class="grid grid-cols-2 gap-x-4">
        <span class="font-semibold">Purchase Date:</span>
        <span>{{ order.purchaseDate }}</span>
      </div>
    </div>

    <!-- Client Information -->
    <div v-if="authStore.getUserType === 'Manager'" class="mt-10">
      <h3 class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
        Client Information
      </h3>
      <div class="grid grid-cols-2 gap-x-4">
        <span class="font-semibold">Client Name:</span>
        <span>{{ order.client?.name || "N/A" }}</span>
      </div>
      <div class="grid grid-cols-2 gap-x-4">
        <span class="font-semibold">Client Email:</span>
        <span>{{ order.client?.email || "N/A" }}</span>
      </div>
    </div>

    <!-- Volumes -->
    <div v-if="authStore.getUserType === 'Manager'" class="mt-10">
      <h3 class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
        Volumes
      </h3>
      <ul class="space-y-4">
        <li
          v-for="volume in order.volumes"
          :key="volume.id"
          class="p-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <div class="grid grid-cols-2 gap-x-4">
            <span class="font-semibold">Volume ID:</span>
            <span>{{ volume.code }}</span>
          </div>
          <div class="grid grid-cols-2 gap-x-4">
            <span class="font-semibold">Volume State:</span>
            <span>{{ volume.state }}</span>
          </div>
          <div class="grid grid-cols-2 gap-x-4">
            <span class="font-semibold">Volume Size:</span>
            <span>{{ volume.products.length }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Return Button -->
    <div class="mt-8 text-center">
      <nuxt-link
        to="/orders"
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
const code = route.params.code;

const config = useRuntimeConfig();
const api = config.public.API_URL;

const authStore = useAuthStore();
const order = ref(null);

const fetchOrderDetails = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await fetch(`${api}/orders/${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order details.");
    }

    order.value = await response.json();
    console.log(order.value.volumes);
  } catch (err) {
    console.error(err.message);
  }
};

fetchOrderDetails();
</script>
