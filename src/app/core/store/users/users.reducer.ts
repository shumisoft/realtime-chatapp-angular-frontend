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

const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

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
