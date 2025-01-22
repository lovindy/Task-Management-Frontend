import { defineStore } from "pinia";
import type { CreateListDto, UpdateListTitleDto } from "@/interfaces/list";
import api from "@/services/api";

export const useListStore = defineStore("list", {
  actions: {
    async createList(createDto: CreateListDto) {
      const response = await api.post("/list", createDto);
      return response.data;
    },

    async getBoardLists(boardId: string) {
      const response = await api.get(`/list/board/${boardId}`);
      return response.data;
    },

    async updateListPosition(listId: string, newPosition: number) {
      await api.put(`/list/${listId}/position`, newPosition);
    },

    async updateListTitle(listId: string, newTitle: string) {
      await api.put(`/list/${listId}/title`, newTitle);
    },

    async deleteList(listId: string) {
      await api.delete(`/list/${listId}`);
    },
  },
});
