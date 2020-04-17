import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { RoomComponent } from './componentes/room/room.component';
import { PlayComponent } from './componentes/bura/play/play.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: 'game', component: PlayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
