import {
  Directive,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';

@Directive({
  selector: '[appOrientation]',
})
export class OrientationDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef<Element>) {}

  ngAfterViewInit() {
    this.setOrientation();

    const ro = new ResizeObserver(() => this.setOrientation());
    ro.observe(this.elementRef.nativeElement);
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  public setOrientation() {
    const element = this.elementRef.nativeElement;

    if (element.clientWidth < element.clientHeight) {
      element.classList.remove('horizontal');
      element.classList.add('vertical');
    } else {
      element.classList.remove('vertical');
      element.classList.add('horizontal');
    }
  }
}
