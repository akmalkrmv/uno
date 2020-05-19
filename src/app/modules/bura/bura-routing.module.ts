import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './components/play/play.component';
import { RoomResolver } from 'src/app/resolvers/room.resolver';

const routes: Routes = [
  { path: '', component: PlayComponent, resolve: { roomId: RoomResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuraRoutingModule {}
