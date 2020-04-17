import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialImportsModule } from 'src/app/shared/material-imports.module';

import { CardComponent } from './card/card.component';
import { CardsComponent } from './cards/cards.component';
import { DeckComponent } from './deck/deck.component';
import { PlayComponent } from './play/play.component';

@NgModule({
  imports: [CommonModule, FormsModule, MaterialImportsModule],
  exports: [CardComponent, CardsComponent, DeckComponent, PlayComponent],
  declarations: [CardComponent, CardsComponent, DeckComponent, PlayComponent],
})
export class BuraModule {}
