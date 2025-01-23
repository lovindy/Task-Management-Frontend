<template>
  <div class="flex-shrink-0 w-72 bg-gray-100 rounded-lg">
    <!-- List Header -->
    <div class="p-3 flex items-center justify-between bg-gray-200 rounded-t-lg">
      <h3 class="font-semibold">{{ list.title }}</h3>
      <div class="flex items-center space-x-2">
        <el-button
          type="primary"
          size="small"
          @click="$emit('add-task', list.listId)"
        >
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-dropdown trigger="click">
          <el-button type="primary" size="small">
            <el-icon><More /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$emit('edit-list', list)">
                Edit List
              </el-dropdown-item>
              <el-dropdown-item @click="$emit('delete-list', list.listId)">
                Delete List
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Tasks Container -->
    <div class="p-2">
      <Draggable
        v-model="list.tasks"
        class="space-y-2 min-h-[10px]"
        :group="{ name: 'tasks', pull: true, put: true }"
        @change="(event) => $emit('task-drag', event, list.listId)"
        item-key="taskId"
      >
        <template #item="{ element: task }">
          <TaskCard :task="task" @edit-task="$emit('edit-task', task)" />
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, More } from "@element-plus/icons-vue";
import Draggable from "vuedraggable";
import TaskCard from "../components/TaskCard.vue";
import type { List as BoardList } from "@/interfaces/list";

defineProps<{
  list: BoardList;
}>();

defineEmits(["add-task", "edit-list", "delete-list", "edit-task", "task-drag"]);
</script>
