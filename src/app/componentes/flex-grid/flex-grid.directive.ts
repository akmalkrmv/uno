import { Directive, Input, ElementRef, HostListener } from '@angular/core';

type orientationType = 'vertical' | 'horizontal';

@Directive({
  selector: '[appFlexGrid]',
})
export class FlexGridDirective {
  constructor(private el: ElementRef) {}

  @Input() autorotate: boolean = true;
  @Input() orientation: orientationType = 'vertical';

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  public setOrientation() {
    if (!this.autorotate) return;

    const element: HTMLDivElement = this.el.nativeElement;

    if (element.clientHeight > element.clientWidth) {
      this.orientation = 'vertical';
      element.style.flexDirection = 'column';
    } else {
      this.orientation = 'horizontal';
      element.style.flexDirection = 'row';
    }
  }
}
