import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ViewChildren,
  AfterViewInit,
  QueryList,
  OnDestroy,
  ContentChildren,
  AfterContentInit,
} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

type orientationType = 'vertical' | 'horizontal';

@Component({
  selector: 'app-flex-grid',
  templateUrl: './flex-grid.component.html',
  styleUrls: ['./flex-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexGridComponent
  implements AfterViewInit, AfterContentInit, OnDestroy {
  @Input() orientation: orientationType = 'vertical';

  @ViewChild('container') containerRef: ElementRef;
  @ViewChildren('[grid-item]') viewItems: QueryList<ElementRef>;
  @ContentChildren('[grid-item]') contentItems: QueryList<ElementRef>;

  public itemsCount = 0;

  constructor() {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit', this.viewItems);

    this.viewItems.changes
      .pipe(untilDestroyed(this))
      .subscribe((items) => console.log('ngAfterViewInit', items));
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit', this.contentItems);

    this.contentItems.changes
      .pipe(untilDestroyed(this))
      .subscribe((items) => console.log('ngAfterContentInit', items));
  }
}
