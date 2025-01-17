export default defineNuxtRouteMiddleware((to) => {
  const token = ref('');
  if (process.client) {
    token.value = localStorage.getItem('token');
    if (token.value && !store.getters["auth/isLogged"]) {
      store.dispatch("auth/restoreSession");
      console.log("restored session");
    }
  }

  if (!token.value && to.path !== "/auth/login") {
    return navigateTo("/auth/login");
  }

  if (token.value && to.path === "/auth/login") {
    return navigateTo("/dashboard");
  }
});