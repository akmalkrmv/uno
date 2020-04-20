import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialImportsModule } from './material-imports.module';
import { FirestoreImportsModule } from './firestore-imports.module';
import { ArraySortPipe } from 'src/app/pipes/sort-by.pipe';

const pipes = [ArraySortPipe];

@NgModule({
  declarations: [...pipes],
  exports: [
    CommonModule,
    FormsModule,
    MaterialImportsModule,
    FirestoreImportsModule,
    ...pipes,
  ],
})
export class SharedModule {}
