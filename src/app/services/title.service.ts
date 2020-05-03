import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TitleService {
  public text$ = new BehaviorSubject('Uno');
}
