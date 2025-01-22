<!-- src/components/DashboardComponent.vue -->
<template>
  <div class="h-full">
    <!-- Board Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold">{{ currentBoard?.title || "Board" }}</h1>
        <div class="flex items-center space-x-2"></div>
      </div>
    </div>

    <!-- Board Content -->
    <div
      class="flex space-x-4 overflow-x-auto pb-4"
      style="min-height: calc(100vh - 200px)"
    >
      <Draggable
        v-model="lists"
        group="lists"
        item-key="listId"
        class="flex space-x-4"
        @change="handleListDragChange"
      >
        <template #item="{ element: list }">
          <div class="w-72 flex-shrink-0 bg-gray-100 rounded-lg p-4">
            <!-- List Header -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">{{ list.title }}</h3>
              <el-dropdown trigger="click">
                <el-button type="text">
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEditList(list)"
                      >Edit</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="handleDeleteList(list.listId)"
                      class="text-red-500"
                      >Delete</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- Tasks -->
            <Draggable
              v-model="list.tasks"
              group="tasks"
              item-key="taskId"
              class="space-y-2"
              @change="(event) => handleTaskDragChange(event, list.listId)"
            >
              <template #item="{ element: task }">
                <div
                  class="bg-white rounded p-3 shadow-sm cursor-pointer hover:bg-gray-50"
                  @click="handleEditTask(task)"
                >
                  <p class="text-sm">{{ task.title }}</p>
                  <p v-if="task.description" class="text-xs text-gray-500 mt-1">
                    {{ task.description }}
                  </p>
                </div>
              </template>
            </Draggable>

            <!-- Add Task Button -->
            <div class="mt-3">
              <el-button
                type="text"
                class="w-full text-left hover:bg-gray-200"
                @click="handleAddTask(list.listId)"
              >
                <el-icon><Plus /></el-icon>
                Add a card
              </el-button>
            </div>
          </div>
        </template>
      </Draggable>

      <!-- Add List Button -->
      <div class="w-72 flex-shrink-0">
        <el-button
          type="text"
          class="w-full h-12 text-left bg-gray-100 hover:bg-gray-200 rounded-lg"
          @click="handleAddList"
        >
          <el-icon><Plus /></el-icon>
          Add another list
        </el-button>
      </div>
    </div>

    <!-- Dialogs remain the same -->
    <!-- Add/Edit List Dialog -->
    <el-dialog
      v-model="listDialog.visible"
      :title="listDialog.isEdit ? 'Edit List' : 'Add List'"
      width="30%"
    >
      <el-form @submit.prevent="handleListSubmit">
        <el-form-item label="Title">
          <el-input v-model="listDialog.title" placeholder="Enter list title" />
        </el-form-item>
        <div class="flex justify-end">
          <el-button @click="listDialog.visible = false">Cancel</el-button>
          <el-button type="primary" @click="handleListSubmit">
            {{ listDialog.isEdit ? "Update" : "Create" }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- Add/Edit Task Dialog -->
    <el-dialog
      v-model="taskDialog.visible"
      :title="taskDialog.isEdit ? 'Edit Task' : 'Add Task'"
      width="30%"
    >
      <el-form @submit.prevent="handleTaskSubmit">
        <el-form-item label="Title">
          <el-input v-model="taskDialog.title" placeholder="Enter task title" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            v-model="taskDialog.description"
            type="textarea"
            placeholder="Enter task description"
          />
        </el-form-item>
        <div class="flex justify-end">
          <el-button @click="taskDialog.visible = false">Cancel</el-button>
          <el-button type="primary" @click="handleTaskSubmit">
            {{ taskDialog.isEdit ? "Update" : "Create" }}
          </el-button>
        </div>
      </el-form>
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
  if (event.added) {
    const { element: task, newIndex } = event.added;
    await taskStore.updateTaskPosition(task.taskId, {
      listId,
      position: newIndex,
    });
  } else if (event.moved) {
    const { element: task, newIndex } = event.moved;
    await taskStore.updateTaskPosition(task.taskId, {
      listId,
      position: newIndex,
    });
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
:deep(.el-dialog__body) {
  padding-top: 20px;
}
</style>
