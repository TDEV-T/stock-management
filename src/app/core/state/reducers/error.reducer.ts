import { createReducer, on } from '@ngrx/store';
import { ErrorActions, clearAllErrors } from '../actions/error.action';

export interface ErrorState {
  errors: Array<{
    id: string;
    message: string;
    errorType: string;
    timestamp: number;
  }>;
}

export const initialState: ErrorState = {
  errors: [],
};

export const errorReducer = createReducer(
  initialState,
  on(ErrorActions.addError, (state, { message, errorType }) => ({
    ...state,
    errors: [
      ...state.errors,
      {
        id: Date.now().toString(),
        message,
        errorType,
        timestamp: Date.now(),
      },
    ],
  })),
  on(ErrorActions.clearError, (state, { id }) => ({
    ...state,
    errors: state.errors.filter((error) => error.id !== id),
  })),
  on(clearAllErrors, (state) => ({
    ...state,
    errors: [],
  }))
);
