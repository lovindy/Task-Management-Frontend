<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? 'Edit List' : 'Add List'"
    width="30%"
    @close="$emit('close')"
  >
    <el-form @submit.prevent="handleSubmit">
      <el-form-item label="Title">
        <el-input
          :model-value="dialogTitle"
          @input="$emit('update:dialog-title', $event)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Save</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps({
  visible: Boolean,
  isEdit: Boolean,
  dialogTitle: String,
});

const emit = defineEmits(["close", "submit", "update:dialog-title"]);

const handleSubmit = () => {
  emit("submit");
};
</script>
