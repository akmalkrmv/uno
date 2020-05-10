import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { LocalStorageKeys } from '@constants/index';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | Observable<boolean> {
    return this.auth.hasRole('admin').pipe(
      tap((isAdmin) => {
        if (!isAdmin) {
          localStorage.setItem(LocalStorageKeys.redirectUrl, location.pathname);
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
