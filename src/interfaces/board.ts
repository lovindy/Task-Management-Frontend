export interface Board {
  boardId: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members?: BoardMember[];
}

export interface BoardMember {
  userId: string;
  username: string;
  role: string;
  joinedAt: string;
}

export interface CreateBoardDto {
  title: string;
  description: string;
}

export interface UpdateBoardDto {
  title: string;
  description: string;
}
