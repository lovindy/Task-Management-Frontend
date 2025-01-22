import DashboardView from "@/views/DashboardView.vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.ts";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import BoardView from "@/views/BoardView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: "board",
          name: "board",
          component: BoardView,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guest: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { guest: true },
    },
  ],
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check authentication status before proceeding
  await authStore.checkAuth();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if trying to access protected route while not authenticated
    next({ name: "login" });
  } else if (to.meta.guest && authStore.isAuthenticated) {
    // Redirect to home if trying to access guest route while authenticated
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
