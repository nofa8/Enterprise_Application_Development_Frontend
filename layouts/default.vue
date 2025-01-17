<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <header class="bg-green-600 text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Logo -->
        <div class="text-xl font-bold">
          <NuxtLink to="/" class="hover:underline">Shoppein</NuxtLink> <!-- Shopee + Shein -->
        </div>
        <!-- Navigation -->
        <nav>
          <ul class="flex space-x-6 items-center">
            <li>
              <!-- Link para o perfil usando o email -->
              <NuxtLink :to="`/clients/${authStore.user?.id}`" class="hover:underline" v-if="authStore.isLoggedIn">
                {{ authStore.user?.name }}
              </NuxtLink>
            </li>


            <li>
              <NuxtLink to="/dashboard" class="hover:underline">Dashboard</NuxtLink>
            </li>
            <!-- Conditional Login/Logout -->
            <li v-if="authStore.isLoggedIn">
              <button @click="authStore.logout"
                class="px-4 py-2 bg-red-500 rounded text-white hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
                Logout
              </button>
            </li>
            <li v-else>
              <NuxtLink to="/login"
                class="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                Login
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow bg-gray-100">
      <div class="container mx-auto px-4 py-6">
        <NuxtPage />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-3 text-center">
        © 2025 My App. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
</script>