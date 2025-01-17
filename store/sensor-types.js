import { defineStore } from "pinia";

export const useSensorTypesStore = defineStore("sensorTypes", () => {
  const sensorTypes = ref([]); 
  const error = ref(null); 
  const api = useRuntimeConfig().public.API_URL; 

  const fetchSensorTypes = async () => {
    error.value = null;

    try {
      const response = await $fetch(`${api}/sensors-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      sensorTypes.value = response; 
    } catch (err) {
      error.value = "Failed to fetch sensor types.";
      console.error(err);
    }
  };

  return {
    sensorTypes,
    error,
    fetchSensorTypes,
  };
});
