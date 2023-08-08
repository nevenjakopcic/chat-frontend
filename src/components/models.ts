export interface Todo {
    id: number;
    content: string;
}

export interface Meta {
    totalCount: number;
}

export interface GroupMessage {
    id: number;
    authorId: number;
    groupId: number;
    content: string;
    createdAt: Date;
}
