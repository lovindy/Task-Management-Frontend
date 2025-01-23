<template>
  <div
    class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8"
  >
    <div
      class="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex"
    >
      <!-- Illustration Side -->
      <div
        class="hidden md:flex md:w-1/2 bg-blue-50 p-8 items-center justify-center"
      >
        <img
          src="@/assets/undraw_security-on_btwg.svg"
          alt="Register Illustration"
          class="max-w-full h-auto object-contain"
        />
      </div>

      <!-- Register Form Side -->
      <div class="w-full md:w-1/2 p-8">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Create an Account</h2>
          <p class="text-gray-500">Join our platform today</p>
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
              placeholder="Choose a username"
              :prefix-icon="User"
              clearable
              class="w-full"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="Create a password"
              :prefix-icon="Lock"
              show-password
              class="w-full"
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm password"
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
              Create Account
            </el-button>
          </el-form-item>
        </el-form>

        <div class="text-center mt-4">
          <p class="text-gray-600">
            Already have an account?
            <router-link
              to="/login"
              class="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Login here
            </router-link>
          </p>
        </div>
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
  confirmPassword: "",
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
  confirmPassword: [
    { required: true, message: "Please confirm password", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== formData.password) {
          callback(new Error("Passwords do not match"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    // Validate form
    await formRef.value.validate();

    loading.value = true;

    // Register the user
    await authStore.register({
      username: formData.username,
      password: formData.password,
    });

    // Immediately log in the user after successful registration
    await authStore.login({
      username: formData.username,
      password: formData.password,
    });

    ElMessage.success("Registration successful. Redirecting to dashboard...");

    // Redirect to dashboard
    router.push("/");
  } catch (error: any) {
    ElMessage.error(error.response?.data || "Registration failed");
  } finally {
    loading.value = false;
  }
};
</script>
