// src/stores/auth.store.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../services/api";
import type { LoginCredentials } from "../interfaces/types";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const user = ref<{
    userId: string;
    username: string;
    isActive: boolean;
    createdAt: string;
  } | null>(null);
  const isLoading = ref(true);

  // Initialize the store
  function init() {
    const token = localStorage.getItem("authToken");
    if (token) {
      isAuthenticated.value = true;
      checkAuth(); // Verify the token and get user data
    } else {
      isLoading.value = false;
    }
  }

  // Register user
  async function register(credentials: LoginCredentials) {
    try {
      console.log("Registering user with credentials:", credentials);
      const response = await api.post("/user/register", credentials);
      user.value = response.data;
      isAuthenticated.value = true;
      console.log("Registration successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", (error as any).response?.data || error);
      isAuthenticated.value = false;
      user.value = null;
      throw error;
    }
  }

  // Login user
  async function login(credentials: LoginCredentials) {
    try {
      console.log("Logging in with credentials:", credentials);
      const response = await api.post("/user/login", credentials);

      // Store token in localStorage
      localStorage.setItem("authToken", response.data.token);
      
      // Set user data and authentication state
      user.value = response.data.user;
      isAuthenticated.value = true;
      
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login failed:", (error as any).response?.data || error);
      isAuthenticated.value = false;
      user.value = null;
      throw error;
    }
  }

  // Logout user
  function logout() {
    localStorage.removeItem("authToken");
    isAuthenticated.value = false;
    user.value = null;
  }

  // Check authentication status
  async function checkAuth() {
    isLoading.value = true;

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.get("/user/me");
      
      // Update user data from the response
      user.value = response.data;
      isAuthenticated.value = true;
      
      console.log("Authentication check successful:", response.data);
    } catch (error) {
      console.error("Authentication check failed:", error);
      localStorage.removeItem("authToken"); // Clear invalid token
      isAuthenticated.value = false;
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  // Initialize the store when it's created
  init();

  return {
    isLoading,
    isAuthenticated,
    user,
    login,
    register,
    logout,
    checkAuth,
  };
});