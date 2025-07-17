import { User } from './user.models';

export enum ChatRoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
}

export interface Message {
  messageId: string;
  chatRoomId: number;
  userId: string;
  content: string;
  timestamp: string; // Timestamp as ISO string
  status: string;
  type: string;
  edited: boolean;
}

export interface CreateChatRoomRequest {
  type: ChatRoomType;
  name: string;
  description: string;
  memberIds: string[];
}

export interface ChatRoom {
  chatId: number;
  name: string;
  type: ChatRoomType;
  members: ChatRoomMember[];
  createdAt: string | null;
  description: string;
  latestMessage?: Message | null;
}

export interface ChatRoomMember {
  chatId: number;
  userId: string;
  admin: boolean;
  user: User;
}

export interface PaginatedChatRooms {
  content: ChatRoom[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

export interface PaginatedMessages {
  content: Message[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}
