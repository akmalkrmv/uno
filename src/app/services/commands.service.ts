import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Command, CommandGroup } from '@models/command';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CommandsService {
  public hasGroups$: Observable<boolean>;
  public groups$ = new BehaviorSubject<CommandGroup[]>([]);
  public current$ = new BehaviorSubject<Command>(null);

  constructor() {
    this.hasGroups$ = this.groups$.pipe(
      map((groups) => groups && groups.length > 0)
    );
  }

  public run(command: Command) {
    this.current$.next(command);
  }

  public registerGroup(group: CommandGroup) {
    const groups = this.groups$.value;
    if (groups.indexOf(group) < 0) {
      groups.push(group);
      this.groups$.next(groups);
    }
  }

  public unregisterGroup(group: CommandGroup) {
    const index = this.groups$.value.findIndex(
      (item) => item.name === group.name
    );
    this.groups$.value.splice(index, 1);
    this.groups$.next(this.groups$.value);
    this.current$.next(null);
  }
}
