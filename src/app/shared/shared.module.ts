import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModule } from './material-imports.module';
import { FirebaseImportsModule } from './firebase-imports.module';
import { ArraySortPipe } from 'src/app/pipes/sort-by.pipe';

const pipes = [ArraySortPipe];

@NgModule({
  declarations: [...pipes],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModule,
    FirebaseImportsModule,
    ...pipes,
  ],
})
export class SharedModule {}
