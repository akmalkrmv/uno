import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SidenavComponent } from './sidenav/sidenav.component';
import { ProfileComponent } from './profile/profile.component';
import { CommandsMenuComponent } from './commands-menu/commands-menu.component';
import { ResizablePanesComponent } from './resizable-panes/resizable-panes.component';

const copmonents = [
  SidenavComponent,
  ProfileComponent,
  CommandsMenuComponent,
  ResizablePanesComponent,
];

@NgModule({
  imports: [SharedModule],
  exports: [...copmonents],
  declarations: [...copmonents],
})
export class SharedComponentsModule {}
