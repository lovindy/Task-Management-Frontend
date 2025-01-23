<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? 'Edit Task' : 'Add Task'"
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
      <el-form-item label="Description">
        <el-input
          :model-value="dialogDescription"
          @input="$emit('update:dialog-description', $event)"
          type="textarea"
          rows="3"
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
  dialogDescription: String,
});

const emit = defineEmits([
  "close",
  "submit",
  "update:dialog-title",
  "update:dialog-description",
]);

const handleSubmit = () => {
  emit("submit");
};
</script>
