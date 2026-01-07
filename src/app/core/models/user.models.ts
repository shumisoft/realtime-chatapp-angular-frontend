export interface UserState {
  userId: string | null;
  username: string | null;
  email: string | null;
  fullName: string | null;
  avatar: string | null;
  bio: string | null;
  loading: boolean;
  error: string | null;
}

export interface EditUserRequest {
  email: string;
  fullName: string;
  avatar: string | null;
  bio: string | null;
}

export interface UserDTOResponse {
  userId: string | null;
  username: string | null;
  email: string;
  fullName: string;
  avatar: string | null;
  bio: string | null;
}

// TODO Move to auth later
export interface UsernameExistsDTOResponse {
  exists: boolean;
}
