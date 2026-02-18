export interface UserStatus {
  userId: string;
  status: OnlineStatusType;
  lastSeen: string | null;
}

export interface UserStatusResponse {
  [userId: string]: UserStatus;
}

export enum OnlineStatusType {
  ONLINE,
  OFFLINE,
}
