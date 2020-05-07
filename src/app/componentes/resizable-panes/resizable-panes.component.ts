import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-resizable-panes',
  templateUrl: './resizable-panes.component.html',
  styleUrls: ['./resizable-panes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizablePanesComponent implements OnInit {
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() autorotate = true;
  @Input() collapseAt = 50;

  @ViewChild('viewport') viewportRef: ElementRef;
  @ViewChild('topPane') topPaneRef: ElementRef;
  @ViewChild('divider') dividerRef: ElementRef;
  @ViewChild('bottomPane') bottomPaneRef: ElementRef;
  @ViewChild('handle') handleRef: MatButton;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public isDragging = false;
  public isTopVisible = true;
  public isBottomVisible = true;

  private lastAngle: string | number = 0;
  private startDrag = () => (this.isDragging = true);
  private isVertical = () => this.orientation === 'vertical';

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const handle: HTMLButtonElement = this.handleRef._elementRef.nativeElement;
    handle.addEventListener('mousedown', this.startDrag);
    handle.addEventListener('touchstart', this.startDrag);

    setTimeout(() => this.setOrientation());
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  public setOrientation() {
    if (!this.autorotate) return;
    if (!screen.orientation) return;

    if (screen.orientation.angle != this.lastAngle) {
      this.rotate();
      this.lastAngle = screen.orientation.angle;
    }
  }

  private rotate() {
    const rotated = this.orientation === 'vertical' ? 'horizontal' : 'vertical';
    const topPane: HTMLDivElement = this.topPaneRef.nativeElement;

    [topPane.style.width, topPane.style.height] = [
      topPane.style.height,
      topPane.style.width,
    ];

    this.orientation = rotated;
    this.changeDetectorRef.markForCheck();
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  @HostListener('document:touchcancel')
  public stopDrag() {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  public drag(event: MouseEvent | TouchEvent) {
    if (this.isDragging) {
      this.isVertical() ? this.dragVertical(event) : this.dragHorizontal(event);
    }
  }

  private dragVertical(event: MouseEvent | TouchEvent) {
    const viewport: HTMLDivElement = this.viewportRef.nativeElement;
    const topHeight = this.clientY(event) - viewport.offsetTop;
    const bottomHeight = viewport.clientHeight - topHeight;

    this.setMeasurements('height', topHeight, bottomHeight);
  }

  private dragHorizontal(event: MouseEvent | TouchEvent) {
    const viewport: HTMLDivElement = this.viewportRef.nativeElement;
    const topWidth = this.clientX(event) - viewport.offsetLeft;
    const bottomWidth = viewport.clientWidth - topWidth;

    this.setMeasurements('width', topWidth, bottomWidth);
  }

  private setMeasurements(type: string, topValue: number, botmValue: number) {
    const top: HTMLDivElement = this.topPaneRef.nativeElement;
    const botm: HTMLDivElement = this.bottomPaneRef.nativeElement;

    const hideTop = topValue < this.collapseAt;
    const hideBottom = botmValue < this.collapseAt;

    top.style[type] = hideTop ? '0%' : hideBottom ? '100%' : topValue + 'px';
    botm.style[type] = hideTop ? '100%' : hideBottom ? '0%' : botmValue + 'px';

    this.isTopVisible = !hideTop;
    this.isBottomVisible = !hideBottom;
  }

  private clientY(event: MouseEvent | TouchEvent) {
    return event instanceof TouchEvent
      ? event.changedTouches[0].clientY
      : event.clientY;
  }

  private clientX(event: MouseEvent | TouchEvent) {
    return event instanceof TouchEvent
      ? event.changedTouches[0].clientX
      : event.clientX;
  }
}
