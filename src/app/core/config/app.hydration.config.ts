import { initialState as userInitialState } from './../store/user/user.reducer';
export function hydrateAuthState() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  return {
    accessToken,
    refreshToken,
    loading: false,
    error: null,
  };
}

export function hydrateUserState() {
  const principalUser = localStorage.getItem('principalUser');

  const initialState = principalUser ? JSON.parse(principalUser) : userInitialState;

  return {
    ...initialState,
    loading: false,
    error: null,
  };
}

export function hydrateChatRoomsState() {
  const principalUser = JSON.parse('{}');

  return {
    ...principalUser,
    loading: false,
    error: null,
  };
}
