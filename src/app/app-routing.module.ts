import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './componentes/home/home.component';
import { RoomComponent } from './componentes/room/room.component';
import { PlayComponent } from './componentes/bura/play/play.component';
import { SigninComponent } from './componentes/auth/signin/signin.component';

const routes: Routes = [
  { path: 'login', component: SigninComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'game', component: PlayComponent, canActivate: [AuthGuard] },
  { path: 'room/:id', component: RoomComponent, canActivate: [AuthGuard] },
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
