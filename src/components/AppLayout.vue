<!-- src/layouts/AppLayout.vue -->
<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-blue-700 text-white flex flex-col">
      <!-- Logo and Workspace Section -->
      <div class="p-4 flex items-center space-x-2 border-b border-blue-600">
        <el-avatar :size="32" class="bg-teal-500">{{ userInitials }}</el-avatar>
        <div class="flex flex-col">
          <span class="font-semibold">Workspace</span>
          <span class="text-sm text-blue-200">Premium</span>
        </div>
      </div>

      <!-- User Profile Section -->
      <div class="p-4 border-b border-blue-600">
        <div class="flex items-center space-x-2 mb-2">
          <div class="flex flex-col">
            <span class="font-medium">{{ user?.username }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto">
        <!-- Main Navigation -->
        <div class="px-2 py-4 space-y-1">
          <router-link
            v-for="item in mainMenuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-blue-600 transition-colors"
            :class="{ 'bg-blue-600': isCurrentRoute(item.path) }"
          >
            <el-icon class="mr-3">
              <component :is="item.icon" />
            </el-icon>
            {{ item.name }}
          </router-link>
        </div>

        <!-- Workspace Views -->
        <div class="px-4 py-2">
          <div
            class="flex items-center justify-between text-sm text-blue-200 mb-2"
          >
            <span>Workspace views</span>
            <el-button
              type="text"
              class="text-blue-200 hover:text-white p-1"
              @click="toggleWorkspaceMenu"
            >
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
          <div class="space-y-1">
            <router-link
              v-for="item in workspaceViews"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-blue-600 transition-colors"
              :class="{ 'bg-blue-600': isCurrentRoute(item.path) }"
            >
              <el-icon class="mr-3">
                <component :is="item.icon" />
              </el-icon>
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Your Boards -->
        <div class="px-4 py-2">
          <div
            class="flex items-center justify-between text-sm text-blue-200 mb-2"
          >
            <span>Your boards</span>
            <el-button
              type="text"
              class="text-blue-200 hover:text-white p-1"
              @click="handleCreateBoard"
            >
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
          <div class="space-y-1">
            <router-link
              v-for="board in boards"
              :key="board.boardId"
              :to="`/boards/${board.boardId}`"
              class="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-blue-600 transition-colors"
              :class="{
                'bg-blue-600': isCurrentRoute(`/boards/${board.boardId}`),
              }"
            >
              <div
                class="w-4 h-4 rounded mr-3"
                :style="{ backgroundColor: generateBoardColor(board.boardId) }"
              ></div>
              {{ board.title }}
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-4 border-t border-blue-600">
        <el-dropdown trigger="click" class="w-full">
          <el-button type="text" class="w-full text-white">
            <div class="flex items-center justify-between">
              <span>Settings</span>
              <el-icon><Setting /></el-icon>
            </div>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleProfile">
                <el-icon><User /></el-icon>Profile
              </el-dropdown-item>
              <el-dropdown-item @click="handleSettings">
                <el-icon><Setting /></el-icon>Settings
              </el-dropdown-item>
              <el-dropdown-item
                divided
                @click="handleLogout"
                class="text-red-500"
              >
                <el-icon><SwitchButton /></el-icon>Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Plus,
  Setting,
  User,
  SwitchButton,
  Menu,
  Calendar,
  Document,
  Collection,
} from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/auth.store";
import { useBoardStore } from "@/stores/board.store";
import type { Board } from "@/interfaces/board";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const boardStore = useBoardStore();

const boards = ref<Board[]>([]);

// Computed
const user = computed(() => authStore.user);
const userInitials = computed(() => {
  return user.value?.username?.charAt(0).toUpperCase() || "U";
});

// Main menu items
const mainMenuItems = [
  { name: "Boards", path: "/boards", icon: Collection },
  { name: "Members", path: "/members", icon: User },
];

// Workspace views
const workspaceViews = [
  { name: "Table", path: "/views/table", icon: Document },
  { name: "Calendar", path: "/views/calendar", icon: Calendar },
];

// Methods
const isCurrentRoute = (path: string) => {
  return route.path === path;
};

const generateBoardColor = (boardId: string) => {
  // Generate a consistent color based on boardId
  const colors = ["#FF8B8B", "#89CFF0", "#98FB98", "#FFA07A", "#DDA0DD"];
  const index = boardId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const handleCreateBoard = () => {
  router.push("/boards/create");
};

const handleProfile = () => {
  router.push("/profile");
};

const handleSettings = () => {
  router.push("/settings");
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

const toggleWorkspaceMenu = () => {
  // Implement workspace menu toggle
};

// Fetch boards on component mount
const fetchBoards = async () => {
  try {
    boards.value = await boardStore.getUserBoards();
  } catch (error) {
    console.error("Failed to fetch boards:", error);
  }
};

fetchBoards();
</script>

<style scoped>
/* Add any additional styling here */
</style>
