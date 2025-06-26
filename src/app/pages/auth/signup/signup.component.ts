import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { AuthActions } from '../../../core/state/actions/auth.action';
import {
  selectAuthError,
  selectIsAuthenticated,
  selectSignupSuccess,
} from '../../../core/state/selectors/auth.selector';
import { Observable } from 'rxjs';
import { AppState } from '../../../core/state/app.state';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  hidePassword = true;
  error$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;
  isSignupSuccess$: Observable<boolean | undefined>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.error$ = this.store.select(selectAuthError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.isSignupSuccess$ = this.store.select(selectSignupSuccess);
  }

  ngOnInit() {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });

    this.isSignupSuccess$.subscribe((success) => {
      if (success) {
        this.snackBar.open('Signup success', 'Close', { duration: 3000 });
        this.router.navigate(['/auth/signin']);
      }
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      this.store.dispatch(AuthActions.signup({ username, email, password }));
    }
  }
}
