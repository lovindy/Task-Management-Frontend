<template>
  <el-card shadow="hover" class="cursor-pointer" @click="$emit('edit-task')">
    <h4 class="font-medium">{{ task.title }}</h4>
    <p v-if="task.description" class="text-sm text-gray-600 mt-2">
      {{ task.description }}
    </p>
  </el-card>
</template>

<script setup lang="ts">
import type { Task } from "@/interfaces/task";

defineProps<{
  task: Task;
}>();

defineEmits(["edit-task"]);
</script>
