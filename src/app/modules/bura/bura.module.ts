import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CardComponent } from './components/card/card.component';
import { CardsComponent } from './components/cards/cards.component';
import { DeckComponent } from './components/deck/deck.component';
import { PlayComponent } from './components/play/play.component';
import { ControlsComponent } from './components/controls/controls.component';
import { HandComponent } from './components/hand/hand.component';

@NgModule({
  imports: [SharedModule],
  exports: [CardComponent, CardsComponent, DeckComponent, PlayComponent],
  declarations: [CardComponent, CardsComponent, DeckComponent, PlayComponent, ControlsComponent, HandComponent],
})
export class BuraModule {}
