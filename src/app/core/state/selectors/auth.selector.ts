import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectAuthState = (state: AppState) => state.auth;

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => !!state.token
);


export const selectSignupSuccess = createSelector(
  selectAuthState,
  (state) => state.signupSuccess
);

export const selectLoginSuccess = createSelector(
  selectAuthState,
  (state) => state.loginSuccess
);
