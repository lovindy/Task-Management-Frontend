<template>
  <el-container class="h-screen">
    <!-- Sidebar -->
    <el-aside
      width="240px"
      class="bg-blue-700 text-black flex flex-col h-screen overflow-hidden"
    >
      <!-- Workspace Header -->
      <div class="p-4 border-b border-blue-600">
        <div class="flex items-center space-x-3 mb-2">
          <el-avatar :size="32" class="bg-teal-500">{{
            userInitials
          }}</el-avatar>
          <span class="font-semibold text-sm text-white">{{
            user?.username
          }}</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-hidden">
        <el-menu
          class="border-none bg-transparent h-full"
          :default-active="activeMenu"
          text-color="black"
          active-text-color="#e6f4ff"
        >
          <!-- Boards Section -->
          <el-sub-menu index="boards">
            <template #title>
              <div class="flex justify-between items-center w-full pr-4">
                <span>Your Boards</span>
                <el-button
                  type="text"
                  class="text-black p-1 hover:bg-blue-600"
                  @click.stop="openCreateBoardModal"
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
      <el-main class="p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>

    <!-- Create Board Modal - Moved outside of submenu -->
    <el-dialog
      v-model="createBoardModal"
      title="Create New Board"
      width="30%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="createBoardForm"
        :model="newBoard"
        :rules="boardRules"
        label-position="top"
      >
        <el-form-item label="Board Title" prop="title">
          <el-input
            v-model="newBoard.title"
            placeholder="Enter board title"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="newBoard.description"
            type="textarea"
            placeholder="Enter board description"
            maxlength="200"
            show-word-limit
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createBoardModal = false">Cancel</el-button>
          <el-button
            type="primary"
            :loading="creating"
            @click="handleCreateBoard"
          >
            Create Board
          </el-button>
        </span>
      </template>
    </el-dialog>
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
  Document,
  Calendar,
  Collection,
} from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/auth.store";
import { useBoardStore } from "@/stores/board.store";
import type { Board } from "@/interfaces/board";
import { ElMessage, type FormInstance } from "element-plus";

// Router and Store setup
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const boardStore = useBoardStore();

// State
const boards = ref<Board[]>([]);
const createBoardModal = ref(false);
const creating = ref(false);
const createBoardForm = ref<FormInstance>();
const newBoard = ref({
  title: "",
  description: "",
});

// Form validation rules
const boardRules = {
  title: [
    { required: true, message: "Please enter a board title", trigger: "blur" },
    { min: 3, message: "Title must be at least 3 characters", trigger: "blur" },
  ],
  description: [
    {
      max: 200,
      message: "Description cannot exceed 200 characters",
      trigger: "blur",
    },
  ],
};

// Computed properties
const user = computed(() => authStore.user);
const userInitials = computed(() => {
  return user.value?.username?.charAt(0).toUpperCase() || "U";
});
const activeMenu = computed(() => route.path);

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

const openCreateBoardModal = (e: Event) => {
  e.stopPropagation();
  createBoardModal.value = true;
};

const handleCreateBoard = async () => {
  if (!createBoardForm.value) return;

  await createBoardForm.value.validate(async (valid) => {
    if (valid) {
      try {
        creating.value = true;
        const createdBoard = await boardStore.createBoard({
          title: newBoard.value.title,
          description: newBoard.value.description,
        });

        // Add the new board to the local boards list
        boards.value.push(createdBoard);

        // Reset form and close modal
        newBoard.value.title = "";
        newBoard.value.description = "";
        createBoardModal.value = false;

        ElMessage.success("Board created successfully");
      } catch (error) {
        console.error("Failed to create board:", error);
        ElMessage.error("Failed to create board. Please try again.");
      } finally {
        creating.value = false;
      }
    }
  });
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

:deep(.el-menu) {
  background-color: transparent !important;
}

:deep(.el-sub-menu__title) {
  color: white !important;
}

:deep(.el-menu-item) {
  color: white !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
