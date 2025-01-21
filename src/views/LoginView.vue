<template>
  <el-container class="centered-container">
    <el-row justify="center" align="middle" class="full-height">
      <el-col :span="8">
        <el-card class="elevation-12">
          <div slot="header" class="text-center">
            <h2>Welcome Back</h2>
          </div>

          <div v-if="error" class="mb-4">
            <el-alert type="error" show-icon :closable="false">
              {{ error }}
            </el-alert>
          </div>

          <el-form
            :model="credentials"
            @submit.native.prevent="handleSubmit"
            label-width="0"
          >
            <el-form-item prop="username">
              <el-input
                v-model="credentials.username"
                prefix-icon="el-icon-user"
                placeholder="Username"
                :disabled="loading"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="credentials.password"
                prefix-icon="el-icon-lock"
                placeholder="Password"
                type="password"
                show-password
                :disabled="loading"
              />
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              class="mt-4"
              :loading="loading"
              block
              @click="handleSubmit"
            >
              Sign In
            </el-button>
          </el-form>

          <el-row justify="center" class="mt-4">
            <el-col class="text-center">
              Don't have an account?
              <router-link to="/register" class="text-primary"
                >Register here</router-link
              >
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const error = ref("");

const credentials = reactive({
  username: "",
  password: "",
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";

  try {
    await authStore.login(credentials);
    router.push("/");
  } catch (err: any) {
    error.value =
      err.response?.data?.message || "Login failed. Please try again.";
    console.error("Login failed:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.centered-container {
  height: 100vh;
}
.full-height {
  height: 100%;
}
.text-primary {
  color: #409eff;
  text-decoration: none;
}
.text-primary:hover {
  text-decoration: underline;
}
</style>
