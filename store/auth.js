import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(null);
  const user = ref(null);
  const isLogged = ref(false);
  const isLoggedIn = computed(() => isLogged.value);

  const getUserType = computed(() => user.value?.role);
  const getUserName = computed(() => user.value?.name);

  const getUserEmail = computed(() => user.value?.email);

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

    // Save data to sessionStorage (only for the session)
    if (process.client) {
      sessionStorage.setItem("authToken", userToken);
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    isLogged.value = false;

    // Remove from sessionStorage (on logout)
    if (process.client) {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
    }

    router.push("/auth/login");
  }

  // Restore session on app load (only on client-side)
  async function restoreSession() {
    if (process.client) {
      try {
        const storedToken = sessionStorage.getItem("authToken");
        const storedUser = JSON.parse(sessionStorage.getItem("user"));

        if (!storedToken || !storedUser) {
          return;
        }

        const combinedHeaders = {
          ...headers,
          Authorization: `Bearer ${storedToken}`,
        };

        const userInfo = await $fetch(api + "/auth/user", {
          method: "GET",
          headers: combinedHeaders,
        });

        if (!userInfo) {
          return;
        }

        token.value = storedToken;
        user.value = storedUser;
        isLogged.value = true;
        router.push('/dashboard')
      } catch (err) {
        console.error(err);
      }
    }
  }

  // Call restoreSession on store initialization, only on client-side
  if (process.client) {
    restoreSession();
  }

  return {
    token,
    user,
    isLoggedIn,
    getUserType,
    handleLogin,
    login,
    logout,
    restoreSession,
    getUserEmail,
    getUserName,
  };
});
