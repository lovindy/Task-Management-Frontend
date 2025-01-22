<template>
  <div class="min-h-screen bg-blue-500 p-6">
    <!-- Board Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white">
        {{ currentBoard?.title || "Loading..." }}
      </h1>
      <div class="flex space-x-4">
        <el-button type="primary" @click="handleShare">
          <el-icon><Share /></el-icon>
          Share
        </el-button>
        <el-button type="primary" @click="handleAddList">
          <el-icon><Plus /></el-icon>
          Add List
        </el-button>
      </div>
    </div>

    <!-- Lists Container -->
    <Draggable
      v-model="lists"
      class="flex space-x-4 overflow-x-auto pb-4"
      group="lists"
      @change="handleListDragChange"
      item-key="listId"
    >
      <template #item="{ element: list }">
        <div class="flex-shrink-0 w-72 bg-gray-100 rounded-lg">
          <!-- List Header -->
          <div
            class="p-3 flex items-center justify-between bg-gray-200 rounded-t-lg"
          >
            <h3 class="font-semibold">{{ list.title }}</h3>
            <div class="flex items-center space-x-2">
              <el-button
                type="primary"
                size="small"
                @click="handleAddTask(list.listId)"
              >
                <el-icon><Plus /></el-icon>
              </el-button>
              <el-dropdown trigger="click">
                <el-button type="primary" size="small">
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEditList(list)">
                      Edit List
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDeleteList(list.listId)">
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
              @change="(event) => handleTaskDragChange(event, list.listId)"
              item-key="taskId"
            >
              <template #item="{ element: task }">
                <el-card
                  shadow="hover"
                  class="cursor-pointer"
                  @click="handleEditTask(task)"
                >
                  <h4 class="font-medium">{{ task.title }}</h4>
                  <p v-if="task.description" class="text-sm text-gray-600 mt-2">
                    {{ task.description }}
                  </p>
                </el-card>
              </template>
            </Draggable>
          </div>
        </div>
      </template>
    </Draggable>

    <!-- List Dialog -->
    <el-dialog
      v-model="listDialog.visible"
      :title="listDialog.isEdit ? 'Edit List' : 'Add List'"
      width="30%"
    >
      <el-form @submit.prevent="handleListSubmit">
        <el-form-item label="Title">
          <el-input v-model="listDialog.title" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="listDialog.visible = false">Cancel</el-button>
        <el-button type="primary" @click="handleListSubmit">Save</el-button>
      </template>
    </el-dialog>

    <!-- Task Dialog -->
    <el-dialog
      v-model="taskDialog.visible"
      :title="taskDialog.isEdit ? 'Edit Task' : 'Add Task'"
      width="30%"
    >
      <el-form @submit.prevent="handleTaskSubmit">
        <el-form-item label="Title">
          <el-input v-model="taskDialog.title" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="taskDialog.description" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="taskDialog.visible = false">Cancel</el-button>
        <el-button type="primary" @click="handleTaskSubmit">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Draggable from "vuedraggable";
import { Plus, More, Share, Grid, List } from "@element-plus/icons-vue";
import type { Board } from "@/interfaces/board";
import type { List as BoardList } from "@/interfaces/list";
import type { Task } from "@/interfaces/task";
import { useBoardStore } from "@/stores/board.store";
import { useListStore } from "@/stores/list.store";
import { useTaskStore } from "@/stores/task.store";
import { ElMessage } from "element-plus";

const route = useRoute();
const boardStore = useBoardStore();
const listStore = useListStore();
const taskStore = useTaskStore();

// State
const currentBoard = ref<Board | null>(null);
const lists = ref<BoardList[]>([]);

// Dialog state
const listDialog = ref({
  visible: false,
  isEdit: false,
  title: "",
  listId: "",
});

const taskDialog = ref({
  visible: false,
  isEdit: false,
  title: "",
  description: "",
  taskId: "",
  listId: "",
});

// Methods
const fetchBoardData = async (boardId: string) => {
  try {
    currentBoard.value = await boardStore.getBoardById(boardId);
    const boardLists = await listStore.getBoardLists(boardId);

    // Fetch tasks for each list
    const listsWithTasks = await Promise.all(
      boardLists.map(async (list: { listId: string }) => {
        const tasks = await taskStore.getListTasks(list.listId);
        return { ...list, tasks };
      })
    );

    lists.value = listsWithTasks;
  } catch (error) {
    console.error("Failed to fetch board data:", error);
  }
};

// List CRUD operations
const handleAddList = () => {
  listDialog.value = {
    visible: true,
    isEdit: false,
    title: "",
    listId: "",
  };
};

const handleEditList = (list: BoardList) => {
  listDialog.value = {
    visible: true,
    isEdit: true,
    title: list.title,
    listId: list.listId,
  };
};

const handleListSubmit = async () => {
  try {
    if (listDialog.value.isEdit) {
      await listStore.updateListTitle(
        listDialog.value.listId,
        listDialog.value.title
      );
    } else {
      await listStore.createList({
        boardId: currentBoard.value!.boardId,
        title: listDialog.value.title,
      });
    }

    // Refresh lists
    if (currentBoard.value) {
      await fetchBoardData(currentBoard.value.boardId);
    }

    listDialog.value.visible = false;
  } catch (error) {
    console.error("Failed to save list:", error);
  }
};

const handleDeleteList = async (listId: string) => {
  try {
    await listStore.deleteList(listId);
    if (currentBoard.value) {
      await fetchBoardData(currentBoard.value.boardId);
    }
  } catch (error) {
    console.error("Failed to delete list:", error);
  }
};

// Task CRUD operations
const handleAddTask = (listId: string) => {
  taskDialog.value = {
    visible: true,
    isEdit: false,
    title: "",
    description: "",
    taskId: "",
    listId,
  };
};

const handleEditTask = (task: Task) => {
  taskDialog.value = {
    visible: true,
    isEdit: true,
    title: task.title,
    description: task.description || "",
    taskId: task.taskId,
    listId: task.listId,
  };
};

const handleTaskSubmit = async () => {
  try {
    if (taskDialog.value.isEdit) {
      await taskStore.updateTask(taskDialog.value.taskId, {
        title: taskDialog.value.title,
        description: taskDialog.value.description,
      });
    } else {
      await taskStore.createTask({
        listId: taskDialog.value.listId,
        title: taskDialog.value.title,
        description: taskDialog.value.description,
        position: 0,
      });
    }

    // Refresh lists
    if (currentBoard.value) {
      await fetchBoardData(currentBoard.value.boardId);
    }

    taskDialog.value.visible = false;
  } catch (error) {
    console.error("Failed to save task:", error);
  }
};

// Drag and drop handlers
const handleListDragChange = async (event: any) => {
  if (event.moved) {
    const { element, newIndex } = event.moved;
    await listStore.updateListPosition(element.listId, newIndex);
  }
};

const handleTaskDragChange = async (event: any, listId: string) => {
  // Store the original lists state for rollback if needed
  const originalLists = JSON.parse(JSON.stringify(lists.value));

  try {
    if (event.added) {
      const { element: task, newIndex } = event.added;
      await taskStore.updateTaskPosition(task.taskId, listId, newIndex);
    } else if (event.moved) {
      const { element: task, newIndex } = event.moved;
      await taskStore.updateTaskPosition(task.taskId, listId, newIndex);
    }
  } catch (error) {
    console.error("Failed to update task position:", error);
    // Rollback to previous state
    lists.value = originalLists;
    // Show error message to user
    ElMessage.error("Failed to update task position");
  } finally {
    // Refresh board data to ensure UI is in sync with backend
    if (currentBoard.value) {
      await fetchBoardData(currentBoard.value.boardId);
    }
  }
};

// Share handler
const handleShare = () => {
  // Implement share functionality
  console.log("Share clicked");
};

// Watch for route changes
watch(
  () => route.params.boardId,
  async (newBoardId) => {
    if (newBoardId) {
      await fetchBoardData(newBoardId as string);
    }
  }
);

// Initial load
onMounted(async () => {
  if (route.params.boardId) {
    await fetchBoardData(route.params.boardId as string);
  }
});
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 20px 20px 10px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
}

/* Custom scrollbar for the board container */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}
</style>
