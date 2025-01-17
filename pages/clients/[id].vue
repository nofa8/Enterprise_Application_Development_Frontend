<template>
    <div v-if="client" class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <!-- Título -->
        <h2 class="text-3xl font-semibold mb-6 text-gray-800">Client Details - {{ client.name }}</h2>

        <!-- Detalhes do cliente -->
        <div class="space-y-6">
            <!-- Exibindo ID -->
            <div class="flex justify-between items-center">
                <span class="text-lg font-medium text-gray-700">Client ID:</span>
                <span class="text-lg text-gray-900">{{ client.id }}</span>
            </div>

            <!-- Exibindo Email -->
            <div class="flex justify-between items-center">
                <span class="text-lg font-medium text-gray-700">Email:</span>
                <span class="text-lg text-gray-900">{{ client.email }}</span>
            </div>

            <!-- Exibindo Orders -->
            <div v-if="client.ordersDTO.length" class="space-y-4 mt-4">
                <h3 class="text-xl font-semibold text-gray-800">Orders</h3>
                <div v-for="order in client.ordersDTO" :key="order.code" class="bg-gray-100 p-4 rounded-md">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-gray-700">Order Code:</span>
                        <span class="text-gray-900">{{ order.code }}</span>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="font-medium text-gray-700">Price:</span>
                        <span class="text-gray-900">{{ order.price | currency }}</span>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="font-medium text-gray-700">State:</span>
                        <span class="text-gray-900 capitalize">{{ order.state }}</span>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="font-medium text-gray-700">Purchase Date:</span>
                        <span class="text-gray-900">{{ formatDate(order.purchaseDate) }}</span>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="text-gray-500">No orders found for this client.</p>
            </div>
        </div>

        <!-- Botão de retorno -->
        <div class="mt-8">
            <nuxt-link to="/dashboard"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Return to
                Dashboard</nuxt-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#imports';
import { useAuthStore } from '~/store/auth';

const route = useRoute();
const id = route.params.id;

const config = useRuntimeConfig();
const api = config.public.API_URL;

const authStore = useAuthStore();
const client = ref(null);

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const fetchClientDetails = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found.');
        }

        const response = await fetch(`${api}/clients/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch client details.');
        }

        client.value = await response.json();
    } catch (err) {
        console.error(err.message);
    }
};

fetchClientDetails();
</script>