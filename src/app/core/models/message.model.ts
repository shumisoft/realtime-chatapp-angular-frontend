import { User } from './user.models';

export enum ChatRoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export enum MessageStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
  DELIVERED = 'DELIVERED',
}

export interface Message {
  messageId: string;
  chatRoomId: number;
  userId: string;
  content: string;
  timestamp: string; // Timestamp as ISO string
  status: MessageStatus;
  type: MessageType;
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

export interface TypingEventDTO {
  chatId: number;
  userId: string;
  typing: boolean;
}
