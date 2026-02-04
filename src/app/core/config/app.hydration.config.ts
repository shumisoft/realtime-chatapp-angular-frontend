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
  const principalUser = JSON.parse(localStorage.getItem('principalUser') ?? '{}');

  return {
    ...principalUser,
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
