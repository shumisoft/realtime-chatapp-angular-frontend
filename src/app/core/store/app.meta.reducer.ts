import { Action, ActionReducer, createAction } from '@ngrx/store';

//action
export const clearAppState = createAction('[App] Clear App State');

export function clearAppStateMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state: any, action: Action) {
    if (action.type === clearAppState.type) {
      // By passing undefined, the reducers will fall back to their default initialState
      state = undefined;
    }
    return reducer(state, action);
  };
}
