<template>
  <div class="board-view">
    <el-tabs type="border-card">
      <el-tab-pane label="Board">
        <Dashboard :board-id="boardId" />
      </el-tab-pane>
      <el-tab-pane label="Members">
        <BoardMembers :board-id="boardId" :is-owner="isOwner" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBoardStore } from "@/stores/board.store";
import Dashboard from "@/components/Dashboard.vue";
import BoardMembers from "@/components/BoardMembers.vue";

const route = useRoute();
const boardStore = useBoardStore();
const boardId = route.params.id as string;
const isOwner = ref(false);

onMounted(async () => {
  try {
    const board = await boardStore.getBoardById(boardId);
    isOwner.value = board.isOwner;
  } catch (error) {
    // Handle error
  }
});
</script>
