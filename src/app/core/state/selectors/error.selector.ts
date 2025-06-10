import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectErrorState = (state: AppState) => state.errors;

export const selectErrors = createSelector(
  selectErrorState,
  (state) => state.errors
); 