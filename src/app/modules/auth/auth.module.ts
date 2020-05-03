import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NameComponent } from './name/name.component';

@NgModule({
  imports: [SharedModule],
  declarations: [SigninComponent, NameComponent],
})
export class AuthModule {}
