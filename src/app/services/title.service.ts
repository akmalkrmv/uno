import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TitleService {
  private default = 'Uno';

  public text$ = new BehaviorSubject(this.default);

  public toDefault() {
    this.text$.next(this.default);
  }

  public clear() {
    this.text$.next(null);
  }
}
