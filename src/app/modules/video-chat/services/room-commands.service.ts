import { Injectable, OnDestroy } from '@angular/core';
import { CommandsService } from '@services/commands.service';
import { VideoChatCommandGroup } from '@constants/command-groups';
import { canShareLink } from '@utils/index';

@Injectable({ providedIn: 'root' })
export class RoomCommandsService implements OnDestroy {
  constructor(private commands: CommandsService) {}

  ngOnDestroy(): void {
    this.unregister();
  }

  public register() {
    VideoChatCommandGroup.commands.find(
      (command) => command.name === 'shareLink'
    ).visible = canShareLink();

    this.commands.registerGroup(VideoChatCommandGroup);
  }

  public unregister() {
    this.commands.unregisterGroup(VideoChatCommandGroup);
  }
}
