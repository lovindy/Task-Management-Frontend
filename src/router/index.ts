import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.ts";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import BoardView from "@/views/BoardView.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import BoardMemberView from "@/views/BoardMemberView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "boards",
          name: "boards",
          component: BoardView,
        },
        {
          path: "boards/:id",
          name: "board",
          component: BoardView,
        },
        // board member
        {
          path: "boardmembers",
          name: "boardmembers",
          component: BoardMemberView,
        },
      ],
    },
    {
      path: "/board",
      name: "board",
      component: BoardView,
      meta: { requiresAuth: true },
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
