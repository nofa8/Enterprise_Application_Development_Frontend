<template>
    <div v-if="order" class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 class="text-2xl font-bold mb-4">Details of order {{ order.code }}</h2>
        <div class="space-y-4">
            <div class="flex justify-between">
                <span class="font-semibold">Order Code:</span>
                <span>{{ order.code }}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Price:</span>
                <span>{{ order.price }}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">State:</span>
                <span>{{ order.state }}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Last Update:</span>
                <span>{{ order.lastUpdate }}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Purchase Date:</span>
                <span>{{ order.purchaseDate }}</span>
            </div>
            <div v-if="authStore.user.role === 'Manager'" class="mt-8">
                <h3 class="text-xl font-semibold mb-4">Client Information</h3>
                <div class="flex justify-between">
                    <span class="font-semibold">Client Name:</span>
                    <span>{{ order.client?.name || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-semibold">Client Email:</span>
                    <span>{{ order.client?.email || 'N/A' }}</span>
                </div>
            </div>
            <div v-if="authStore.user.role === 'Manager'" class="mt-8">
                <h3 class="text-xl font-semibold mb-4">Volumes</h3>
                <ul class="list-disc list-inside space-y-2">
                    <li v-for="volume in order.volumes" :key="volume.id" class="ml-4">
                        <div class="flex justify-between">
                            <span class="font-semibold">Volume ID:</span>
                            <span>{{ volume.id }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Volume Name:</span>
                            <span>{{ volume.name }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Volume Size:</span>
                            <span>{{ volume.size }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="mt-6">
            <nuxt-link to="/orders"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Return</nuxt-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#imports';
import { useAuthStore } from '~/store/auth';

const route = useRoute();
const code = route.params.code;

const config = useRuntimeConfig();
const api = config.public.API_URL;

const authStore = useAuthStore();
const order = ref(null);

const fetchOrderDetails = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found.');
        }

        const response = await fetch(`${api}/orders/${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order details.');
        }

        order.value = await response.json();
    } catch (err) {
        console.error(err.message);
    }
};

fetchOrderDetails();
</script>