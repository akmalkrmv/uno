import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { RoomComponent } from './componentes/room/room.component';
import { PlayComponent } from './componentes/bura/play/play.component';
import { SigninComponent } from './componentes/auth/signin/signin.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { HomeComponent } from './componentes/home/home.component';

const routes: Routes = [
  { path: 'login', component: SigninComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      // { path: 'room/:id', component: RoomComponent },
      // { path: 'game/:id', component: PlayComponent },
    ],
  },
  { path: 'room/:id', component: RoomComponent },
  { path: 'game', component: PlayComponent },
  { path: 'game/:id', component: PlayComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./componentes/admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
