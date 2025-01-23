<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4"
  >
    <div
      class="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-2xl overflow-hidden"
    >
      <div
        class="relative h-1 bg-gradient-to-r from-blue-500 to-purple-600"
      ></div>

      <div class="p-8 text-center">
        <div class="mb-6">
          <div
            class="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            404
          </div>
          <h2 class="mt-4 text-2xl font-bold text-gray-800">
            Oops! Page Not Found
          </h2>
          <p class="mt-3 text-gray-600 text-base">
            The page you're looking for seems to have wandered off the digital
            map.
          </p>
        </div>

        <div
          class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <el-button
            type="primary"
            @click="goToDashboard"
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            <el-icon class="mr-2"><HomeFilled /></el-icon>
            Go to Dashboard
          </el-button>

          <el-button
            type="default"
            @click="goBack"
            class="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-300 flex items-center justify-center"
          >
            <el-icon class="mr-2"><Back /></el-icon>
            Go Back
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { HomeFilled, Back } from "@element-plus/icons-vue";

const router = useRouter();

const goToDashboard = () => {
  router.push("/");
};

const goBack = () => {
  router.go(-1);
};
</script>
