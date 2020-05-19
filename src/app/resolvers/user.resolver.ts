import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '@models/index';
import { AuthService } from '@services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<IUser> {
  constructor(private auth: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.auth.authorized$;
  }
}
