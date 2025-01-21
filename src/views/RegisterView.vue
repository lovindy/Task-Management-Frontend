<template>
  <el-container class="centered-container">
    <el-row justify="center" align="middle" class="full-height">
      <el-col :span="8">
        <el-card class="elevation-12">
          <div slot="header" class="text-center">
            <h2>Create Account</h2>
          </div>

          <el-form
            :model="formData"
            @submit.native.prevent="handleSubmit"
            label-width="0"
          >
            <el-form-item prop="username">
              <el-input
                v-model="formData.username"
                prefix-icon="el-icon-user"
                placeholder="Username"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                prefix-icon="el-icon-lock"
                placeholder="Password"
                show-password
                type="password"
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                prefix-icon="el-icon-lock"
                placeholder="Confirm Password"
                show-password
                type="password"
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
              Register
            </el-button>
          </el-form>

          <el-row justify="center" class="mt-4">
            <el-col class="text-center">
              Already have an account?
              <router-link to="/login" class="text-primary"
                >Login here</router-link
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

const router = useRouter();
const loading = ref(false);

const formData = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/login");
  } catch (error) {
    console.error("Registration failed:", error);
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
