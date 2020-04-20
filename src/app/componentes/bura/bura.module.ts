import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CardComponent } from './card/card.component';
import { CardsComponent } from './cards/cards.component';
import { DeckComponent } from './deck/deck.component';
import { PlayComponent } from './play/play.component';

@NgModule({
  imports: [SharedModule],
  exports: [CardComponent, CardsComponent, DeckComponent, PlayComponent],
  declarations: [CardComponent, CardsComponent, DeckComponent, PlayComponent],
})
export class BuraModule {}
