import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const publicRoutes = ["/auth/login", "/dashboard", "/sensors/create"];

  if (!authStore.token && !publicRoutes.includes(to.path)) {
    return navigateTo("/auth/login");
  }
  
  if (authStore.token && to.path === "/auth/login") {
    return navigateTo("/dashboard");
  }
});
