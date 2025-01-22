<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Board Members</h2>
      <el-button type="primary" @click="showAddMemberDialog = true">
        Add Member
      </el-button>
    </div>

    <!-- Members List -->
    <el-table
      v-loading="boardMemberStore.loading"
      :data="boardMemberStore.boardMembers"
      class="w-full"
    >
      <el-table-column prop="userId" label="User ID" width="180" />
      <el-table-column prop="role" label="Role" width="120">
        <template #default="{ row }">
          <el-select
            v-model="row.role"
            @change="handleRoleChange(row)"
            :disabled="!isOwner"
          >
            <el-option label="Member" value="member" />
            <el-option label="Admin" value="admin" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120">
        <template #default="{ row }">
          <el-button
            type="danger"
            size="small"
            @click="handleRemoveMember(row)"
            :disabled="!isOwner"
          >
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add Member Dialog -->
    <el-dialog
      v-model="showAddMemberDialog"
      title="Add Board Member"
      width="500px"
    >
      <el-form ref="addMemberForm" :model="newMember" label-width="120px">
        <el-form-item label="User ID" required>
          <el-input v-model="newMember.userId" />
        </el-form-item>
        <el-form-item label="Role" required>
          <el-select v-model="newMember.role">
            <el-option label="Member" value="member" />
            <el-option label="Admin" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddMemberDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleAddMember">Add</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBoardMemberStore } from "@/stores/boardMember.store";
import { ElMessage, ElMessageBox } from "element-plus";
import type { BoardMember } from "@/interfaces/boardMember";

const props = defineProps<{
  boardId: string;
  isOwner: boolean;
}>();

const boardMemberStore = useBoardMemberStore();
const showAddMemberDialog = ref(false);
const newMember = ref({
  userId: "",
  role: "member",
});

onMounted(async () => {
  try {
    await boardMemberStore.getBoardMembers(props.boardId);
  } catch (error) {
    ElMessage.error("Failed to load board members");
  }
});

const handleAddMember = async () => {
  try {
    await boardMemberStore.addBoardMember(props.boardId, newMember.value);
    showAddMemberDialog.value = false;
    ElMessage.success("Member added successfully");
    newMember.value = { userId: "", role: "member" };
  } catch (error) {
    ElMessage.error("Failed to add member");
  }
};

const handleRoleChange = async (member: BoardMember) => {
  try {
    await boardMemberStore.updateMemberRole(
      props.boardId,
      member.userId,
      member.role
    );
    ElMessage.success("Role updated successfully");
  } catch (error) {
    ElMessage.error("Failed to update role");
  }
};

const handleRemoveMember = async (member: BoardMember) => {
  try {
    await ElMessageBox.confirm(
      "Are you sure you want to remove this member?",
      "Warning",
      {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      }
    );

    await boardMemberStore.removeBoardMember(props.boardId, member.userId);
    ElMessage.success("Member removed successfully");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("Failed to remove member");
    }
  }
};
</script>
