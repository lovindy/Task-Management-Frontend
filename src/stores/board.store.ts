// src/stores/board.store.ts
import { defineStore } from "pinia";
import type { CreateBoardDto, UpdateBoardDto } from "../interfaces/board";
import api from "@/services/api";

export const useBoardStore = defineStore("board", {
  actions: {
    async createBoard(createDto: CreateBoardDto) {
      const response = await api.post("/board", createDto);
      return response.data;
    },

    async getUserBoards() {
      const response = await api.get("/board/my-boards");
      return response.data;
    },

    async getBoardById(boardId: string) {
      const response = await api.get(`/board/${boardId}`);
      return response.data;
    },

    async updateBoard(boardId: string, updateDto: UpdateBoardDto) {
      const response = await api.put(`/board/${boardId}`, updateDto);
      return response.data;
    },

    async deleteBoard(boardId: string) {
      await api.delete(`/board/${boardId}`);
    },

    async searchBoards(searchTerm: string) {
      const response = await api.get("/board/search", {
        params: { searchTerm },
      });
      return response.data;
    },
  },
});
