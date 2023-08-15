export interface Todo {
    id: number;
    content: string;
}

export interface Meta {
    totalCount: number;
}

export interface Group {
    id: number;
    name: string;
    createdAt: Date;
    lastActivity: Date;
}

export interface Message {
    id: number;
    authorId: number;
    groupId: number;
    content: string;
    createdAt: Date;
}
