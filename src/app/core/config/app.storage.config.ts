import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export const localStorageSyncReducer = (reducer: ActionReducer<any>): ActionReducer<any> =>
  localStorageSync({
    keys: [
      {
        auth: {
          serialize(state) {
            return stripVolatileFields(state);
          },
        },
      },
      {
        'principal-user': { serialize: stripVolatileFields },
      },
    ],

    rehydrate: true,
  })(reducer);

const stripVolatileFields = <T extends Record<string, any>>({ loading, error, ...rest }: T) => rest;
