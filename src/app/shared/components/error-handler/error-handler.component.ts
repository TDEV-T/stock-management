import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../../../core/state/app.state';
import { selectErrors } from '../../../core/state/selectors/error.selector';
import { ErrorActions } from '../../../core/state/actions/error.action';

@Component({
  selector: 'app-error-handler',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: '',
})
export class ErrorHandlerComponent implements OnInit, OnDestroy {
  private errors$: Observable<
    Array<{ id: string; message: string; errorType: string }>
  >;
  private subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>, private snackBar: MatSnackBar) {
    this.errors$ = this.store.select(selectErrors);
  }

  ngOnInit() {
    this.subscription = this.errors$.subscribe((errors) => {
      errors.forEach((error) => {
        const snackBarRef = this.snackBar.open(error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });

        snackBarRef.afterDismissed().subscribe(() => {
          this.store.dispatch(ErrorActions.clearError({ id: error.id }));
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
