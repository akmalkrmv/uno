import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  
  @Input() card: Card;
  @Input() visible: boolean = true;
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @Input() onlySuit: boolean = false;
  
  constructor() {}

  ngOnInit(): void {}


}
