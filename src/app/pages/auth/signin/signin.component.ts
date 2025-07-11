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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
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
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
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
    this.signinForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
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
  }

  onSubmit() {
    if (this.signinForm.valid) {
      const { username, email, password } = this.signinForm.value;
      this.store.dispatch(AuthActions.login({ username, password }));
    }
  }

  onSignup() {
    if (this.signinForm.valid) {
      const { username, email, password } = this.signinForm.value;
      this.store.dispatch(AuthActions.signup({ username, email, password }));
    }
  }
}
