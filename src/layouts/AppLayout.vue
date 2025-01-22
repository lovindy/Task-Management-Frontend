<!-- src/layouts/AppLayout.vue -->
<template>
  <el-container class="h-screen">
    <!-- Sidebar -->
    <el-aside
      width="240px"
      class="bg-blue-700 text-white flex flex-col h-screen overflow-hidden"
    >
      <!-- Workspace Header -->
      <div class="p-4 border-b border-blue-600">
        <div class="flex items-center space-x-3 mb-2">
          <el-avatar :size="32" class="bg-teal-500">{{
            userInitials
          }}</el-avatar>
          <div class="flex flex-col">
            <span class="font-semibold text-sm">{{ user?.username }}</span>
            <span class="text-xs text-blue-200">Premium</span>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-hidden">
        <el-menu
          class="border-none bg-transparent h-full"
          :default-active="activeMenu"
          text-color="black"
          active-text-color="black"
        >
          <!-- Main Navigation -->
          <el-menu-item
            v-for="item in navigationItems"
            :key="item.path"
            :index="item.path"
            @click="navigateTo(item.path)"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>

          <!-- Workspace Section -->
          <el-sub-menu index="workspace">
            <template #title>
              <el-icon><Folder /></el-icon>
              <span>Workspace</span>
            </template>
            <el-menu-item
              v-for="view in workspaceViews"
              :key="view.path"
              :index="view.path"
              @click="navigateTo(view.path)"
            >
              <el-icon><component :is="view.icon" /></el-icon>
              <span>{{ view.name }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- Boards Section -->
          <el-sub-menu index="boards">
            <template #title>
              <div class="flex justify-between items-center w-full pr-4">
                <span>Your Boards</span>
                <el-button
                  type="text"
                  class="text-white p-1 hover:bg-blue-600"
                  @click.stop="handleCreateBoard"
                >
                  <el-icon><Plus /></el-icon>
                </el-button>
              </div>
            </template>
            <el-menu-item
              v-for="board in boards"
              :key="board.boardId"
              :index="`/boards/${board.boardId}`"
              @click="navigateTo(`/boards/${board.boardId}`)"
            >
              <div class="flex items-center space-x-2">
                <div
                  class="w-3 h-3 rounded"
                  :style="{
                    backgroundColor: generateBoardColor(board.boardId),
                  }"
                ></div>
                <span class="truncate">{{ board.title }}</span>
              </div>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

      <!-- Bottom Actions -->
      <div class="p-4 border-t border-blue-600">
        <el-dropdown trigger="click" class="w-full">
          <el-button type="text" class="w-full text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <el-icon><Setting /></el-icon>
                <span>Settings</span>
              </div>
              <el-icon><ArrowDown /></el-icon>
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
    </el-aside>

    <!-- Main Content Area -->
    <el-container class="bg-gray-100">
      <el-header
        class="bg-white border-b flex items-center justify-between px-6"
      >
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-semibold">{{ currentPageTitle }}</h1>
        </div>
        <div class="flex items-center space-x-4">
          <el-input
            v-model="searchQuery"
            placeholder="Search..."
            prefix-icon="Search"
            class="w-64"
          />
          <el-button-group>
            <el-button type="primary" plain>
              <el-icon><Plus /></el-icon>Create
            </el-button>
            <el-button type="primary" plain>
              <el-icon><Share /></el-icon>Share
            </el-button>
          </el-button-group>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Plus,
  Setting,
  User,
  SwitchButton,
  ArrowDown,
  Folder,
  Share,
  Search,
  Document,
  Calendar,
  Collection,
} from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/auth.store";
import { useBoardStore } from "@/stores/board.store";
import type { Board } from "@/interfaces/board";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const boardStore = useBoardStore();

// State
const boards = ref<Board[]>([]);
const searchQuery = ref("");

// Navigation items
const navigationItems = [
  { name: "Boards", path: "/boards", icon: Collection },
  { name: "Members", path: "/members", icon: User },
];

const workspaceViews = [
  { name: "Table", path: "/workspace/table", icon: Document },
  { name: "Calendar", path: "/workspace/calendar", icon: Calendar },
];

// Computed
const user = computed(() => authStore.user);
const userInitials = computed(() => {
  return user.value?.username?.charAt(0).toUpperCase() || "U";
});

const activeMenu = computed(() => route.path);

const currentPageTitle = computed(() => {
  const currentBoard = boards.value.find((board) =>
    route.path.includes(`/boards/${board.boardId}`)
  );
  if (currentBoard) return currentBoard.title;

  const currentRoute = navigationItems.find((item) =>
    route.path.startsWith(item.path)
  );
  return currentRoute?.name || "Dashboard";
});

// Methods
const navigateTo = (path: string) => {
  router.push(path);
};

const generateBoardColor = (boardId: string) => {
  const colors = ["#FF8B8B", "#89CFF0", "#98FB98", "#FFA07A", "#DDA0DD"];
  const index = boardId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const handleCreateBoard = (e: Event) => {
  e.stopPropagation();
  router.push("/boards/create");
};

const handleProfile = () => router.push("/profile");
const handleSettings = () => router.push("/settings");

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

// Lifecycle
onMounted(async () => {
  try {
    boards.value = await boardStore.getUserBoards();
  } catch (error) {
    console.error("Failed to fetch boards:", error);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
