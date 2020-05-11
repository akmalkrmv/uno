import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModule } from './material-imports.module';
import { FirebaseImportsModule } from './firebase-imports.module';
import { ArraySortPipe } from 'src/app/pipes/sort-by.pipe';
import { OrientationDirective } from '../directives/orientation.directive';

const pipes = [ArraySortPipe];
const directives = [OrientationDirective];

@NgModule({
  declarations: [...pipes, ...directives],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModule,
    FirebaseImportsModule,
    ...pipes,
    ...directives,
  ],
})
export class SharedModule {}
