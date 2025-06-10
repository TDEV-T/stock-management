import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'signin',
        loadComponent: () =>
          import('./pages/auth/signin/signin.component').then(
            (m) => m.SigninComponent
          ),
      },
    ],
  },
];
