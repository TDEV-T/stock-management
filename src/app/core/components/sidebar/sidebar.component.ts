import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/actions/auth.action';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    RouterOutlet,
    MatButtonModule,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Output() menuItemClicked = new EventEmitter<void>();

  constructor(private router: Router, private store: Store) {}

  onMenuItemClick(): void {
    this.menuItemClicked.emit();
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }
}
