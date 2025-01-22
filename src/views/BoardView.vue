<!-- src/views/BoardView.vue -->
<template>
  <div class="min-h-screen bg-blue-600">
    <!-- Board Header -->
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-semibold text-white">{{ board.title }}</h1>
        <el-button-group>
          <el-button size="small">
            <el-icon><Star /></el-icon>
          </el-button>
          <el-button size="small">
            <el-icon><User /></el-icon>
            Share
          </el-button>
        </el-button-group>
      </div>
      <div class="flex items-center space-x-4">
        <el-button-group>
          <el-button size="small">
            <el-icon><View /></el-icon>
            Board
          </el-button>
          <el-button size="small">
            <el-icon><Document /></el-icon>
            Table
          </el-button>
        </el-button-group>
        <el-button size="small">
          <el-icon><Filter /></el-icon>
          Filters
        </el-button>
      </div>
    </div>

    <!-- Board Content -->
    <div class="p-4">
      <div class="flex space-x-4">
        <draggable
          v-model="lists"
          group="lists"
          :animation="200"
          class="flex space-x-4"
          @end="handleListMove"
        >
          <template #item="{ element }">
            <!-- List Component -->
            <div class="w-72 bg-gray-100 rounded-lg">
              <div class="p-3">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="font-medium">{{ element.title }}</h3>
                  <el-dropdown trigger="click">
                    <el-button type="text">
                      <el-icon><More /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>Add Card...</el-dropdown-item>
                        <el-dropdown-item>Copy List...</el-dropdown-item>
                        <el-dropdown-item>Move List...</el-dropdown-item>
                        <el-dropdown-item divided class="text-red-500">
                          Archive List
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>

                <!-- Cards Container -->
                <draggable
                  v-model="element.cards"
                  group="cards"
                  :animation="200"
                  class="space-y-2"
                  @end="handleCardMove"
                >
                  <template #item="{ element: card }">
                    <div class="bg-white p-3 rounded shadow-sm">
                      {{ card.title }}
                    </div>
                  </template>
                </draggable>

                <!-- Add Card Button -->
                <div class="mt-2">
                  <el-button
                    type="text"
                    class="w-full text-left text-gray-600 hover:bg-gray-200"
                    @click="handleAddCard(element.id)"
                  >
                    <el-icon class="mr-2"><Plus /></el-icon>
                    Add a card
                  </el-button>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <!-- Add List Button -->
        <div class="w-72">
          <el-button
            type="text"
            class="w-full text-left text-white bg-white/30 hover:bg-white/40 h-10 px-3 rounded"
            @click="handleAddList"
          >
            <el-icon class="mr-2"><Plus /></el-icon>
            Add another list
          </el-button>
        </div>
      </div>
    </div>

    <!-- Add Card Dialog -->
    <el-dialog v-model="showAddCardDialog" title="Add Card" width="500px">
      <el-form ref="cardFormRef" :model="newCard" label-position="top">
        <el-form-item label="Title" prop="title">
          <el-input v-model="newCard.title" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddCardDialog = false">Cancel</el-button>
          <el-button type="primary" @click="submitNewCard">Add Card</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Add List Dialog -->
    <el-dialog v-model="showAddListDialog" title="Add List" width="500px">
      <el-form ref="listFormRef" :model="newList" label-position="top">
        <el-form-item label="Title" prop="title">
          <el-input v-model="newList.title" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddListDialog = false">Cancel</el-button>
          <el-button type="primary" @click="submitNewList">Add List</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  Star,
  User,
  View,
  Document,
  Filter,
  Plus,
  More,
} from "@element-plus/icons-vue";
import draggable from "vuedraggable";
import { useBoardStore } from "@/stores/board.store";

const boardStore = useBoardStore();
const board = ref({ title: "Scrum Board" });
const lists = ref([
  {
    id: "1",
    title: "TODO",
    cards: [
      { id: "1", title: "Login UI" },
      { id: "2", title: "Register UI" },
      { id: "3", title: "Root UI (Board, Board member, List, Task)" },
    ],
  },
  {
    id: "2",
    title: "DOING",
    cards: [{ id: "4", title: "List Controller" }],
  },
  {
    id: "3",
    title: "DONE",
    cards: [
      { id: "5", title: "Board Member Controller" },
      { id: "6", title: "Task Controller" },
      { id: "7", title: "Board Controller" },
    ],
  },
  {
    id: "4",
    title: "RELEASE",
    cards: [],
  },
]);

// Dialog controls
const showAddCardDialog = ref(false);
const showAddListDialog = ref(false);
const activeListId = ref("");
const newCard = ref({ title: "" });
const newList = ref({ title: "" });

// Form refs
const cardFormRef = ref();
const listFormRef = ref();

// Methods
const handleListMove = (event: any) => {
  // Implement list reordering logic
  console.log("List moved", event);
};

const handleCardMove = (event: any) => {
  // Implement card reordering logic
  console.log("Card moved", event);
};

const handleAddCard = (listId: string) => {
  activeListId.value = listId;
  showAddCardDialog.value = true;
};

const handleAddList = () => {
  showAddListDialog.value = true;
};

const submitNewCard = async () => {
  if (!newCard.value.title) return;

  const list = lists.value.find((l) => l.id === activeListId.value);
  if (list) {
    list.cards.push({
      id: Date.now().toString(),
      title: newCard.value.title,
    });
  }

  newCard.value.title = "";
  showAddCardDialog.value = false;
  ElMessage.success("Card added successfully");
};

const submitNewList = async () => {
  if (!newList.value.title) return;

  lists.value.push({
    id: Date.now().toString(),
    title: newList.value.title,
    cards: [],
  });

  newList.value.title = "";
  showAddListDialog.value = false;
  ElMessage.success("List added successfully");
};

onMounted(async () => {
  // Fetch board data
  try {
    const response = await boardStore.getBoardById(route.params.id);
    board.value = response;
  } catch (error) {
    ElMessage.error("Failed to load board");
  }
});
</script>
