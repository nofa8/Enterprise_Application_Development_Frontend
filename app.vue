<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const api = config.public.API_URL;

// Define default headers
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};


// Provide these values globally
provide("api", api);
provide("headers", headers);
</script>
