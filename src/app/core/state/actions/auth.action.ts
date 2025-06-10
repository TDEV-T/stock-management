import { createAction, createActionGroup, props } from '@ngrx/store';
import { User } from '../../../models/user';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ username: string; password: string }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': props<{ error: string }>(),
    'Logout Success': props<{ error: string }>(),
    'Logout Failure': props<{ error: string }>(),
    'Signup': props<{ username: string; password: string; email: string }>(),
    'Signup Success': props<{ user: User; token: string }>(),
    'Signup Failure': props<{ error: string }>(),
    'Check Auth': props<{ error: string }>(),
    'Check Auth Success': props<{ user: User; token: string }>(),
    'Check Auth Failure': props<{ error: string }>(),
    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),
    'Update Password': props<{ oldPassword: string; newPassword: string }>(),
    'Update Password Success': props<{ user: User }>(),
    'Update Password Failure': props<{ error: string }>(),
  },
});

