<!-- LoginView.vue -->
<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>{{ isRegisterMode ? 'Register' : 'Login' }}</h2>
      </template>
      
      <el-form 
        :model="formData" 
        :rules="rules"
        ref="formRef"
        label-position="top"
      >
        <el-form-item label="Username" prop="username">
          <el-input 
            v-model="formData.username"
            placeholder="Enter username"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input 
            v-model="formData.password"
            type="password"
            placeholder="Enter password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading"
            @click="handleSubmit"
            class="w-full"
          >
            {{ isRegisterMode ? 'Register' : 'Login' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="text-center mt-4">
        <el-button 
          link 
          type="primary" 
          @click="isRegisterMode = !isRegisterMode"
        >
          {{ isRegisterMode ? 'Already have an account? Login' : 'Need an account? Register' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()
const loading = ref(false)
const isRegisterMode = ref(false)

const formData = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    if (isRegisterMode.value) {
      await authStore.register(formData)
      ElMessage.success('Registration successful')
    } else {
      await authStore.login(formData)
      ElMessage.success('Login successful')
    }
    
    router.push('/')
  } catch (error: any) {
    ElMessage.error(error.response?.data || 'An error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 400px;
}
</style>