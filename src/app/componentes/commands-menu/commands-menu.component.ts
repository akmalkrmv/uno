import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommandsService } from '@services/commands.service';

@Component({
  selector: 'app-commands-menu',
  templateUrl: './commands-menu.component.html',
  styleUrls: ['./commands-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandsMenuComponent implements OnInit {
  constructor(public commands: CommandsService) {}

  ngOnInit(): void {}
}
