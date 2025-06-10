import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions/auth.action';
import { User } from '../../../models/user';

export interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(AuthActions.signup, (state) => ({
    ...state,
    error: null,
  })),
  on(AuthActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    error: null,
  })),
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    error: null,
  })),
  on(AuthActions.logoutSuccess, () => ({
    ...initialState,
  })),
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
