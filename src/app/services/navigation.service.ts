import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageKeys } from '@constants/index';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) {}

  public redirectIfShould() {
    const redirectUrl = localStorage.getItem(LocalStorageKeys.redirectUrl);

    if (redirectUrl) {
      this.router.navigate([this.withoutDomainRoute(redirectUrl)]);
      localStorage.removeItem(LocalStorageKeys.redirectUrl);
    } else {
      this.router.navigate(['/']);
    }
  }

  private withoutDomainRoute(redirectUrl: string): string {
    if (redirectUrl.indexOf('/uno') >= 0) return redirectUrl.substr(4);
    if (redirectUrl.indexOf('uno') >= 0) return redirectUrl.substr(3);

    return redirectUrl;
  }
}
