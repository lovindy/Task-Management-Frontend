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
      listId: string,
      newPosition: number
    ) {
      console.log("UpdateTaskPosition params:", {
        taskId,
        listId,
        newPosition,
      });
      try {
        const response = await api.put(
          `/task/${taskId}/position?listId=${listId}`,
          {
            position: newPosition,
          }
        );
        return response.data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },

    async deleteTask(taskId: string) {
      await api.delete(`/task/${taskId}`);
    },
  },
});
