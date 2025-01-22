<!-- src/components/Board.vue -->
<template>
  <div class="min-h-screen bg-blue-50">
    <!-- Top Navigation -->
    <el-header class="bg-white shadow-sm">
      <div class="flex items-center justify-between h-16 px-4">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-semibold text-gray-800">My Boards</h1>
          <el-button type="primary" @click="showCreateBoardDialog = true">
            <el-icon class="mr-1"><Plus /></el-icon>
            Create Board
          </el-button>
        </div>
        <el-input
          v-model="searchQuery"
          placeholder="Search boards..."
          class="w-64"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </el-header>

    <!-- Main Content -->
    <el-main class="p-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <el-spin class="inline-flex" />
      </div>

      <!-- Error State -->
      <el-alert
        v-if="error"
        type="error"
        :title="error"
        show-icon
        class="mb-4"
      />

      <!-- Boards Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <!-- Board Cards -->
        <el-card
          v-for="board in boards"
          :key="board.boardId"
          class="hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateToBoard(board.boardId)"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium">{{ board.title }}</h3>
              <el-dropdown
                trigger="click"
                @command="handleBoardAction($event, board)"
              >
                <el-button type="text">
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">Edit</el-dropdown-item>
                    <el-dropdown-item command="delete" class="text-red-500">
                      Delete
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div class="text-gray-600">{{ board.description }}</div>
          <div class="mt-4 text-sm text-gray-500">
            {{ new Date(board.createdAt).toLocaleDateString() }}
          </div>
        </el-card>
      </div>
    </el-main>

    <!-- Create Board Dialog -->
    <el-dialog
      v-model="showCreateBoardDialog"
      title="Create New Board"
      width="500px"
    >
      <el-form
        ref="createFormRef"
        :model="createBoardForm"
        :rules="boardRules"
        label-position="top"
      >
        <el-form-item label="Title" prop="title">
          <el-input v-model="createBoardForm.title" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="createBoardForm.description"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateBoardDialog = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="handleCreateBoard"
            :loading="creating"
          >
            Create
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Edit Board Dialog -->
    <el-dialog v-model="showEditBoardDialog" title="Edit Board" width="500px">
      <el-form
        ref="editFormRef"
        :model="editBoardForm"
        :rules="boardRules"
        label-position="top"
      >
        <el-form-item label="Title" prop="title">
          <el-input v-model="editBoardForm.title" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="editBoardForm.description"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditBoardDialog = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="handleUpdateBoard"
            :loading="updating"
          >
            Update
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search, More } from "@element-plus/icons-vue";
import { useBoardStore } from "../stores/board.store";
import type { Board } from "../interfaces/board";

const router = useRouter();
const boardStore = useBoardStore();

// State
const loading = ref(false);
const error = ref("");
const boards = ref<Board[]>([]);
const searchQuery = ref("");
const showCreateBoardDialog = ref(false);
const showEditBoardDialog = ref(false);
const creating = ref(false);
const updating = ref(false);

// Forms
const createFormRef = ref();
const editFormRef = ref();
const createBoardForm = ref({
  title: "",
  description: "",
});
const editBoardForm = ref({
  boardId: "",
  title: "",
  description: "",
});

// Validation rules
const boardRules = {
  title: [
    { required: true, message: "Title is required", trigger: "blur" },
    { min: 3, message: "Title must be at least 3 characters", trigger: "blur" },
  ],
  description: [
    { required: true, message: "Description is required", trigger: "blur" },
  ],
};

// Methods
const fetchBoards = async () => {
  try {
    loading.value = true;
    const response = await boardStore.getUserBoards();
    boards.value = response;
    error.value = "";
  } catch (err) {
    error.value = "Failed to load boards";
    ElMessage.error("Failed to load boards");
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  if (searchQuery.value) {
    try {
      loading.value = true;
      const response = await boardStore.searchBoards(searchQuery.value);
      boards.value = response;
    } catch (err) {
      ElMessage.error("Failed to search boards");
    } finally {
      loading.value = false;
    }
  } else {
    fetchBoards();
  }
};

const handleCreateBoard = async () => {
  if (!createFormRef.value) return;

  try {
    await createFormRef.value.validate();
    creating.value = true;
    await boardStore.createBoard(createBoardForm.value);
    ElMessage.success("Board created successfully");
    showCreateBoardDialog.value = false;
    createBoardForm.value = { title: "", description: "" };
    await fetchBoards();
  } catch (err) {
    ElMessage.error("Failed to create board");
  } finally {
    creating.value = false;
  }
};

const handleBoardAction = (command: string, board: any) => {
  if (command === "edit") {
    editBoardForm.value = { ...board };
    showEditBoardDialog.value = true;
  } else if (command === "delete") {
    ElMessageBox.confirm(
      "Are you sure you want to delete this board?",
      "Warning",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    ).then(async () => {
      try {
        await boardStore.deleteBoard(board.boardId);
        ElMessage.success("Board deleted successfully");
        await fetchBoards();
      } catch (err) {
        ElMessage.error("Failed to delete board");
      }
    });
  }
};

const handleUpdateBoard = async () => {
  if (!editFormRef.value) return;

  try {
    await editFormRef.value.validate();
    updating.value = true;
    await boardStore.updateBoard(
      editBoardForm.value.boardId,
      editBoardForm.value
    );
    ElMessage.success("Board updated successfully");
    showEditBoardDialog.value = false;
    await fetchBoards();
  } catch (err) {
    ElMessage.error("Failed to update board");
  } finally {
    updating.value = false;
  }
};

const navigateToBoard = (boardId: string) => {
  router.push(`/boards/${boardId}`);
};

// Initialize
onMounted(() => {
  fetchBoards();
});
</script>
