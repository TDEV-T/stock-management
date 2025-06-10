import { AuthState } from './reducers/auth.reducer';
import { ErrorState } from './reducers/error.reducer';

export interface AppState {
  auth: AuthState;
  errors: ErrorState;
} 