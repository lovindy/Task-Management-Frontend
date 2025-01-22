import { defineStore } from "pinia";
import type {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskPositionDto,
} from "@/interfaces/task";
import api from "@/services/api";

export const useTaskStore = defineStore("task", {
  actions: {
    /**
     * Create a new task
     * @param createDto Data for creating a new task
     * @returns The ID of the newly created task
     */
    async createTask(createDto: CreateTaskDto) {
      const response = await api.post("/task", createDto);
      return response.data;
    },

    /**
     * Get all tasks for a specific list
     * @param listId The ID of the list
     * @returns An array of tasks associated with the list
     */
    async getListTasks(listId: string) {
      const response = await api.get(`/task/list/${listId}`);
      return response.data;
    },

    /**
     * Update the details of a task
     * @param taskId The ID of the task
     * @param updateDto Data for updating the task
     */
    async updateTask(taskId: string, updateDto: UpdateTaskDto) {
      await api.put(`/task/${taskId}`, updateDto);
    },

    /**
     * Update the position of a task within a list
     * @param taskId The ID of the task
     * @param updatePositionDto Data for updating task position
     */
    async updateTaskPosition(
      taskId: string,
      updatePositionDto: UpdateTaskPositionDto
    ) {
      await api.put(`/task/${taskId}/position`, updatePositionDto);
    },

    /**
     * Delete a task by its ID
     * @param taskId The ID of the task to delete
     */
    async deleteTask(taskId: string) {
      await api.delete(`/task/${taskId}`);
    },
  },
});
