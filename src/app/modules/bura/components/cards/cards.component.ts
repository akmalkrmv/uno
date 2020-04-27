import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  @Input() deck: Card[];

  constructor() {}

  ngOnInit(): void {}
}
