import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NameComponent } from './name/name.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [SigninComponent, NameComponent],
})
export class AuthModule {}
