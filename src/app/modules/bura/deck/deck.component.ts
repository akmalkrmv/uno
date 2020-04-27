import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../models/card.model';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit {
  @Input() deck: Card[];
  @Input() trump: Card;

  constructor() {}

  ngOnInit(): void {}
}
