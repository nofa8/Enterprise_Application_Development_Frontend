<template>
    <div class="clients text-center my-8">
      <h1 class="text-3xl font-bold mb-6">Clients</h1>
      
      <!-- Search Section -->
      <div class="flex justify-center items-center mb-6 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email"
          class="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="searchClients"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
  
      <div v-if="loading" class="loading text-lg text-blue-500 mt-4">Loading...</div>
  
      <!-- Clients Table -->
      <table v-if="clients.length" class="clients-table w-full border-collapse mt-6">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-4 py-2">Email</th>
            <th class="border px-4 py-2">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in filteredClients"
            :key="client.email"
            class="hover:bg-gray-50 cursor-pointer"
            @click="
              $router.push({
                path: 'clients/'+client.id,
              })
            "
          >
            <td class="border px-4 py-2">{{ client.email }}</td>
            <td class="border px-4 py-2">{{ client.name }}</td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="!clients.length && !loading" class="no-data text-red-500 text-lg mt-4">
        No clients found.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from '~/store/auth';
  
  const authStore = useAuthStore();
  
  const clients = ref([]); // Holds the client data
  const searchQuery = ref(""); // Holds the search input
  const loading = ref(false); // Loading state
  const api = inject('api');
  const filteredClients = computed(() => {
    return clients.value.filter(client =>
      `${client.name} ${client.email}`
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  });
  
  const fetchClients = async () => {
    loading.value = true;
    try {
      const token = authStore.token;
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      const response = await fetch(api+"/clients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Failed to fetch clients.");
      }
  
      // Parse the response JSON
      const data = await response.json();
  
      // Check if the response contains an array
      if (Array.isArray(data) && data.length > 0) {
        clients.value = data; // Populate the clients array
      } else {
        clients.value = [];
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert("Failed to fetch clients. Please check the console for details.");
    } finally {
      loading.value = false;
    }
  };
  
  // Search functionality (this works reactively with the computed property)
  const searchClients = () => {
    console.log("Searching for:", searchQuery.value);
  };
  
  onMounted(() => {
    if (process.client) {
      fetchClients(); // Fetch clients automatically when the component is mounted
    }
  });
  </script>
  
  <style>
  </style>
  