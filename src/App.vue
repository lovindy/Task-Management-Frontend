<!-- App.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "./stores/auth.store";

const authStore = useAuthStore();
const error = ref<string | null>(null);
</script>

<template>
  <div>
    <div v-if="authStore.isLoading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 20px;
}
.error {
  color: red;
  text-align: center;
  padding: 20px;
}
</style>
