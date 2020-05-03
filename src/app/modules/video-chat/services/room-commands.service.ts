import { Injectable } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { filter } from 'rxjs/operators';

import { CommandsService } from '@services/commands.service';
import { VideoChatCommandGroup } from '@constants/command-groups';

@Injectable({ providedIn: 'root' })
export class RoomCommandsService {
  constructor(private commands: CommandsService) {}

  public register() {
    this.commands.registerGroup(VideoChatCommandGroup);
    this.commands.current$
      .pipe(untilDestroyed(this, 'unregister'))
      .pipe(filter((current) => !!current))
      .subscribe((current) => {
        const command = this[current.name];
        if (command && typeof command == 'function') {
          command();
        }
      });
  }

  public unregister() {
    this.commands.unregisterGroup(VideoChatCommandGroup);
  }
}
