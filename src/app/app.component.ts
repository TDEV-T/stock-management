import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './core/state/reducers/auth.reducer';
import { ErrorHandlerComponent } from './shared/components/error-handler/error-handler.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TokenService } from './services/token.service';

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

  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit() {
    if (this.tokenService.getToken() == null) {
      this.router.navigate(['/auth/signin']);
    }
  }
}
