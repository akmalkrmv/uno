import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { SidenavComponent } from './sidenav/sidenav.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { CommandsMenuComponent } from './commands-menu/commands-menu.component';
import { ResizablePanesComponent } from './resizable-panes/resizable-panes.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { FlexGridComponent } from './flex-grid/flex-grid.component';
import { FlexGridDirective } from './flex-grid/flex-grid.directive';

const copmonents = [
  SidenavComponent,
  ProfileComponent,
  CommandsMenuComponent,
  ResizablePanesComponent,
  CodeEditorComponent,
  UserComponent,
  FlexGridComponent,
  FlexGridDirective,
];

@NgModule({
  imports: [SharedModule, RouterModule],
  exports: [...copmonents],
  declarations: [...copmonents],
})
export class SharedComponentsModule {}
