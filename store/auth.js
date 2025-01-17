import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(null);
  const user = ref(null);
  const isLogged = ref(false);
  const isLoggedIn = computed(() => isLogged.value);
  
  
  const getUserType = computed(() => user.value.role);


  const api = useRuntimeConfig().public.API_URL;

  // Define default headers
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const router = useRouter();

  async function handleLogin(email, password) {
    try {
      const loginResponse = await $fetch(api + "/auth/login", {
        method: "POST",
        body: { email, password },
        headers: headers,
      });
      
      if (!loginResponse) {
        throw new Error("Token not found in the response.");
      }

      const combinedHeaders = {
        ...headers,
        Authorization: `Bearer ${loginResponse}`,
      };

      const userInfo = await $fetch(api + "/auth/user", {
        method: "GET",
        headers: combinedHeaders,
      });
      
      login(userInfo, loginResponse);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      throw new Error("Invalid email or password.");
    }
  }

  function login(userData, userToken) {
    user.value = userData;
    token.value = userToken;
    isLogged.value = true;

    localStorage.setItem('authToken', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function logout() {
    token.value = null;
    user.value = null;
    isLogged.value = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  }

  async function restoreSession() {
    try {
      const combinedHeaders = {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      };
  
      const userInfo = await $fetch(api + "/auth/user", {
        method: "GET",
        headers: combinedHeaders,
      });
      if (!userInfo) {
        return;
      }
      const storedToken = localStorage.getItem('authToken');
      const storedUser = userInfo;

      if (storedToken && storedUser) {
        token.value = storedToken;
        user.value = storedUser;
        isLogged.value = true;
      }
    }
    catch(err){
      console.error(err);
    }
  
  }



  return {
    token,
    user,
    isLoggedIn,
    handleLogin,
    login,
    logout,
    restoreSession,
  };
});
