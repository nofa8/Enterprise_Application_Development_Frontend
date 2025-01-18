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
    <div  v-if="authStore.getUserType === 'Manager'" class="mt-10">
      <h3 class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
        Client Information
      </h3>
      <div @click="getClientDetails(order?.client.code)" class="hover:bg-gray-100 cursor-pointer p-4 bg-gray-50 rounded-lg shadow-sm">
        <div class="grid grid-cols-2 gap-x-4">
          <span class="font-semibold">Client Name:</span>
          <span>{{ order.client?.name || "N/A" }}</span>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <span class="font-semibold">Client Email:</span>
          <span>{{ order.client?.email || "N/A" }}</span>
        </div>
      </div>
    </div>

    <!-- Volumes -->
    <div class="mt-10">
      <h3 class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
        Volumes
      </h3>
      <ul class="space-y-4">
        <li v-for="volume in order.volumes" :key="volume.id"
          class=" hover:bg-gray-100 cursor-pointer p-4 bg-gray-50 rounded-lg shadow-sm"
          @click="getVolumeDetails(volume)" :value="volume">
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

    <!-- Buttons -->
    <div class="mt-8 flex justify-between">
      <nuxt-link to="/orders"
        class="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
        Return
      </nuxt-link>

      <button @click="generateInvoice"
        class="inline-block px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
        Download Invoice
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useRuntimeConfig } from "#imports";
import { useAuthStore } from "~/store/auth";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";


const route = useRoute();
const code = route.params.code;
const router = useRouter();
const config = useRuntimeConfig();
const api = config.public.API_URL;

const getClientDetails = (clientCode) =>{
  router.push(`/clients/${clientCode}`);
}

const authStore = useAuthStore();
const order = ref(null);

const getVolumeDetails = (volume) => {
  router.push(`${code}/volumes/${volume.code}`);
};

const fetchOrderDetails = async () => {
  try {
    const token = authStore.token;
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

  } catch (err) {
    console.error(err.message);
  }
};

fetchOrderDetails();


const generateInvoice = async () => {
  const doc = new jsPDF();
  const url = `${api}/orders/${code}`;  // Example URL for the order

  // Generate the QR code and draw it on the PDF
  try {
    const qrCodeDataUrl = await QRCode.toDataURL("http://localhost:3000/orders/"+ code);

    // Draw the QR code image
    doc.addImage(qrCodeDataUrl, 'PNG', 160, 50, 40, 40);

    // Add the rest of the order details to the PDF
    doc.text(`Order Code: ${order.value.code}`, 20, 30);
    doc.text(`Price: ${order.value.price}`, 20, 40);
    doc.text(`State: ${order.value.state}`, 20, 50);
    doc.text(`Purchase Date: ${order.value.purchaseDate}`, 20, 60);

    // Add client information
    doc.text(`Client Name: ${ authStore.getUserType=='Client' ? authStore.getUserName  : order.value.client?.name || "N/A"}`, 20, 70);
    doc.text(`Client Email: ${ authStore.getUserType=='Client' ? authStore.getUserEmail : order.value.client?.email || "N/A"}`, 20, 80);

    // Add volumes info
    doc.text("Volumes:", 20, 100);
    order.value.volumes.forEach((volume, index) => {
      doc.text(`Volume ID: ${volume.code}`, 20, 110 + index * 10);
      doc.text(`Volume State: ${volume.state}`, 20, 120 + index * 10);
      doc.text(`Volume Size: ${volume.products.length}`, 20, 130 + index * 10);
    });

    // Download the PDF
    const fileName = `invoice_order_${code}.pdf`;

    doc.save(fileName);
  } catch (err) {
    console.error("Error generating QR Code:", err);
  }
};

</script>
