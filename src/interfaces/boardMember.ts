export interface BoardMember {
    userId: string;
    boardId: string;
    role: string;
  }
  
  export interface AddBoardMemberDto {
    userId: string;
    role: string;
  }