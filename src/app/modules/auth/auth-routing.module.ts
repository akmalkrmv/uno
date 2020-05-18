import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { NameComponent } from './name/name.component';

const routes: Routes = [
  { path: 'login', component: SigninComponent },
  { path: 'name', component: NameComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
