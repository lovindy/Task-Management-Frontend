<template>
  <div
    class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8"
  >
    <div
      class="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex"
    >
      <!-- Login Form Side -->
      <div class="w-full md:w-1/2 p-8">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p class="text-gray-500">Sign in to continue</p>
        </div>

        <el-form
          :model="formData"
          :rules="rules"
          ref="formRef"
          @submit.prevent="handleSubmit"
          class="space-y-4"
        >
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="Username"
              :prefix-icon="User"
              clearable
              class="w-full"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="Password"
              :prefix-icon="Lock"
              show-password
              class="w-full"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="handleSubmit"
              class="w-full"
              round
            >
              Login
            </el-button>
          </el-form-item>
        </el-form>

        <div class="text-center mt-4">
          <p class="text-gray-600">
            Don't have an account?
            <router-link
              to="/register"
              class="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Register here
            </router-link>
          </p>
        </div>
      </div>
      
      <!-- Illustration Side -->
      <div
        class="hidden md:flex md:w-1/2 bg-blue-50 p-8 items-center justify-center"
      >
        <img
          src="@/assets/undraw_security_0ubl.svg"
          alt="Login Illustration"
          class="max-w-full h-auto object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/auth.store";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const formRef = ref();
const loading = ref(false);

const formData = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    { required: true, message: "Please input username", trigger: "blur" },
    {
      min: 3,
      message: "Username must be at least 3 characters",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Please input password", trigger: "blur" },
    {
      min: 6,
      message: "Password must be at least 6 characters",
      trigger: "blur",
    },
  ],
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    await authStore.login(formData);
    ElMessage.success("Login successful");
    router.push("/");
  } catch (error: any) {
    ElMessage.error(error.response?.data || "An error occurred");
  } finally {
    loading.value = false;
  }
};
</script>
