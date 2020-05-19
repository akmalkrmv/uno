import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoomResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    while (route) {
      if (route.paramMap.get('id')) {
        return route.paramMap.get('id');
      }

      route = route.parent;
    }

    return null;
  }
}
