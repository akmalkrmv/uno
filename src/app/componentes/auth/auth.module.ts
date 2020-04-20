import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [SigninComponent],
})
export class AuthModule {}
