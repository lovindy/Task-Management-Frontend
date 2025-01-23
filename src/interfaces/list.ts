export interface List {
  tasks: unknown[] | undefined;
  listId: string;
  title: string;
  boardId: string;
  position: number;
}

export interface CreateListDto {
  title: string;
  boardId: string;
}

export interface UpdateListTitleDto {
  title: string;
}

export interface UpdateListPositionDto {
  position: number;
}
