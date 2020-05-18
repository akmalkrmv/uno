import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoomResolver implements Resolve<string> {
  constructor(private auth: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return route.parent.paramMap.get('id');
  }
}
