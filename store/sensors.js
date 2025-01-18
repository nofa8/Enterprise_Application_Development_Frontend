import { defineStore } from "pinia";

export const useSensorsStore = defineStore("sensors", () => {
  const sensors = ref([]); 
  const error = ref(null); 
  const api = useRuntimeConfig().public.API_URL; 

  // Fetch all sensors
  const fetchSensors = async () => {
    error.value = null;
    try {
      const response = await $fetch(`${api}/sensors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      sensors.value = response; 
    } catch (err) {
      error.value = "Failed to fetch sensors.";
      console.error(err);
    }
  };

  const updateSensor = async (id, newValue) => {
    error.value = null;
    try {
      const response = await $fetch(`${api}/sensors/${id}`, {
        method: "POST",
        body:  newValue,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return { id: response.id, value: response.value }; 
    } catch (err) {
      error.value = `Failed to update sensor with ID ${id}.`;
      console.error(err);
    }
  };

  return {
    sensors,
    error,
    fetchSensors,
    updateSensor,
  };
});
