export interface Group {
    id: number;
    name: string;
    createdAt: Date;
    lastActivity: Date;
    members: Member[];
}

export interface Member {
    id: number;
    username: string;
    lastOnline: Date;
    userSince: Date;
    role: string;
    memberSince: Date;
}

export interface Message {
    id: number;
    authorId: number;
    groupId: number;
    content: string;
    createdAt: Date;
}

export interface User {
    id: number;
    username: string;
    email: string;
    lastOnline: Date;
    userSince: Date;
}

export interface Relationship {
    otherUser: User;
    status: string;
    lastUpdatedAt: Date;
}
