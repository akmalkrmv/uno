import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './componentes/home/home.component';
import { RoomComponent } from './componentes/room/room.component';
import { PlayComponent } from './componentes/bura/play/play.component';
import { SigninComponent } from './componentes/auth/signin/signin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: 'game/:id', component: PlayComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: './componentes/admin/admin.module#AdminModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
