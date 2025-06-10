import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './core/state/reducers/auth.reducer';
import { ErrorHandlerComponent } from './shared/components/error-handler/error-handler.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorHandlerComponent, MatSnackBarModule],
  template: `
    <app-error-handler></app-error-handler>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'stock-management';
}
