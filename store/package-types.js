import { defineStore } from "pinia";

export const usePackageTypesStore = defineStore("packageTypes", () => {
  const packageTypes = ref([]); 
  const error = ref(null); 
  const api = useRuntimeConfig().public.API_URL; 
  

  const fetchPackageTypes = async () => {
    error.value = null;

    try {
      const response = await $fetch(`${api}/package-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      packageTypes.value = response; 
    } catch (err) {
      error.value = "Failed to fetch package types.";
      console.error(err);
    }
  };

  return {
    packageTypes,
    error,
    fetchPackageTypes,
  };
});
