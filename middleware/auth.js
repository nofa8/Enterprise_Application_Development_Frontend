export default defineNuxtRouteMiddleware((to) => {
  const token = localStorage.getItem("authToken");

  if (token && !store.getters["auth/isLogged"]) {
    store.dispatch("auth/restoreSession");
  }

  if (!token && to.path !== "/login") {
    return navigateTo("/login");
  }

  if (token && to.path === "/login") {
    return navigateTo("/dashboard");
  }
});