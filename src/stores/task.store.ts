import { defineStore } from "pinia";
import type {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskPositionDto,
} from "@/interfaces/task";
import api from "@/services/api";

export const useTaskStore = defineStore("task", {
  actions: {
    async createTask(createDto: CreateTaskDto) {
      const response = await api.post("/task", createDto);
      return response.data;
    },

    async getListTasks(listId: string) {
      const response = await api.get(`/task/list/${listId}`);
      return response.data;
    },

    async updateTask(taskId: string, updateDto: UpdateTaskDto) {
      await api.put(`/task/${taskId}`, updateDto);
    },

    async updateTaskPosition(
      taskId: string,
      updatePositionDto: UpdateTaskPositionDto
    ) {
      await api.put(`/task/${taskId}/position`, updatePositionDto);
    },

    async deleteTask(taskId: string) {
      await api.delete(`/task/${taskId}`);
    },
  },
});
