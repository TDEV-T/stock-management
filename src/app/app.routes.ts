import { Routes } from '@angular/router';
import { authGuardGuard } from './guard/auth-guard.guard';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { ManageStockPageComponent } from './pages/manage-stock/manage-stock-page.component';
import { ManageCategoriesPageComponent } from './pages/manage-categories/manage-categories-page.component';
import { StockMovementPageComponent } from './pages/stock-movement/stock-movement-page.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'manage-stock',
        component: ManageStockPageComponent,
      },
      {
        path: 'stock-movement',
        component: StockMovementPageComponent,
      },
      {
        path: 'manage-categories',
        component: ManageCategoriesPageComponent,
      },
    ],
  },
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
