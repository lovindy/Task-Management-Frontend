// src/stores/boardMember.store.ts
import { defineStore } from "pinia";
import type { BoardMember, AddBoardMemberDto } from "../interfaces/boardMember";
import api from "@/services/api";

export const useBoardMemberStore = defineStore("boardMember", {
  state: () => ({
    boardMembers: [] as BoardMember[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getBoardMembers(boardId: string) {
      try {
        this.loading = true;
        const response = await api.get(`/boardmember/${boardId}/members`);
        this.boardMembers = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addBoardMember(boardId: string, memberData: AddBoardMemberDto) {
      try {
        this.loading = true;
        await api.post(`/boardmember/${boardId}/members`, memberData);
        await this.getBoardMembers(boardId); // Refresh the list
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateMemberRole(boardId: string, memberId: string, newRole: string) {
      try {
        this.loading = true;
        await api.put(
          `/boardmember/${boardId}/members/${memberId}/role`,
          newRole
        );
        await this.getBoardMembers(boardId); // Refresh the list
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeBoardMember(boardId: string, memberId: string) {
      try {
        this.loading = true;
        await api.delete(`/boardmember/${boardId}/members/${memberId}`);
        await this.getBoardMembers(boardId); // Refresh the list
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
