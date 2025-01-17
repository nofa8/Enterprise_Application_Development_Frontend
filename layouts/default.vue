<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <header class="bg-green-600 text-white shadow-md">
      <div
        class="container mx-auto max-w-screen-lg px-4 py-3 flex justify-between items-center"
      >
        <!-- Logo -->
        <div class="text-xl font-bold">
          <NuxtLink to="/dashboard" class="hover:underline">Shoppein</NuxtLink>
          <!-- Shopee + Shein -->
        </div>
        <!-- Hamburger Menu -->
        <button
          @click="toggleMenu"
          class="md:hidden text-white focus:outline-none focus:ring focus:ring-green-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <!-- Navigation -->
        <nav
          :class="{ hidden: !isMenuOpen }"
          class="absolute md:static top-16 left-0 w-full bg-green-600 md:w-auto md:bg-transparent md:flex md:items-center"
        >
          <ul
            class="flex flex-col md:flex-row md:space-x-6 items-center p-4 md:p-0"
          >
            <li>
              <h1 v-if="authStore.isLoggedIn" class="hover:underline">
                {{ authStore.user?.name }}
              </h1>
            </li>
            <li>
              <NuxtLink to="/dashboard" class="hover:underline"
                >Dashboard</NuxtLink
              >
            </li>
            <!-- Conditional Login/Logout -->
            <li v-if="authStore.isLoggedIn">
              <button
                @click="authStore.logout"
                class="px-4 py-2 bg-red-500 rounded text-white hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              >
                Logout
              </button>
            </li>
            <li v-else>
              <NuxtLink
                to="/auth/login"
                class="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Login
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow bg-gray-100">
      <div class="container mx-auto max-w-screen-lg px-4 py-6">
        <NuxtPage />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white">
      <div class="container mx-auto max-w-screen-lg px-4 py-3 text-center">
        © 2025 Shoppein. All rights not reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>