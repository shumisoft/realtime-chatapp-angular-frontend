import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { User } from '../../models/user.models';

export interface UserState {
  users: Record<string, User>;
  colors: Record<string, string>;
}

export const initialState: UserState = {
  users: {},
  colors: {},
};

const randomColor = () => {
  const r = Math.floor(Math.random() * 150); // 0-127
  const g = Math.floor(Math.random() * 150); // 0-127
  const b = Math.floor(Math.random() * 150); // 0-127
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  );
};

export const usersReducer = createReducer(
  initialState,

  on(UsersActions.upsertUser, (state, { user }) => {
    return user.userId
      ? {
          users: {
            ...state.users,
            [user.userId]: user,
          },
          colors: {
            ...state.colors,
            [user.userId]: state.colors[user.userId] || randomColor(),
          },
        }
      : state;
  }),
);
