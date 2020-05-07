import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TitleService {
  private default = 'Uno';

  public icon$ = new BehaviorSubject<string>(null);
  public text$ = new BehaviorSubject(this.default);
  public click$ = new EventEmitter();

  public toDefault() {
    this.text$.next(this.default);
    this.icon$.next(null);
  }

  public clear() {
    this.text$.next(null);
    this.icon$.next(null);
  }
}
