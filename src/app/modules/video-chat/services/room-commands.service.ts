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
    const canShare = canShareLink();

    VideoChatCommandGroup.setCommandOptions('shareLink', { visible: canShare });
    VideoChatCommandGroup.setCommandOptions('copyLink', { visible: !canShare });

    this.commands.registerGroup(VideoChatCommandGroup);
  }

  public unregister() {
    this.commands.unregisterGroup(VideoChatCommandGroup);
  }
}
