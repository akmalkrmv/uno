import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  HostListener,
  ChangeDetectorRef,
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
  @ViewChild('handle') handleRef: MatButton;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public isDragging = false;
  public isTopVisible = true;
  public isBottomVisible = true;

  private startDrag = () => (this.isDragging = true);
  private isVertical = () => this.orientation === 'vertical';

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const handle: HTMLButtonElement = this.handleRef._elementRef.nativeElement;
    handle.addEventListener('mousedown', this.startDrag);
    handle.addEventListener('touchstart', this.startDrag);

    if (window.orientation !== 0) {
      setTimeout(() => this.rotate());
    }
  }

  @HostListener('window:orientationchange')
  public rotate() {
    if (this.autorotate) {
      const rotated =
        this.orientation === 'vertical' ? 'horizontal' : 'vertical';
      this.orientation = rotated;

      const topPane: HTMLDivElement = this.topPaneRef.nativeElement;
      [topPane.style.width, topPane.style.height] = [
        topPane.style.height,
        topPane.style.width,
      ];

      this.changeDetectorRef.markForCheck();
    }
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
    const topPane: HTMLDivElement = this.topPaneRef.nativeElement;

    const height = this.clientY(event) - viewport.offsetTop;
    const hideTop = height < this.collapseAt;
    const hideBottom = viewport.clientHeight - height < this.collapseAt;

    topPane.style.height = hideTop ? '0%' : hideBottom ? '100%' : height + 'px';

    this.isTopVisible = !hideTop;
    this.isBottomVisible = !hideBottom;
  }

  private dragHorizontal(event: MouseEvent | TouchEvent) {
    const viewport: HTMLDivElement = this.viewportRef.nativeElement;
    const topPane: HTMLDivElement = this.topPaneRef.nativeElement;

    const width = this.clientX(event) - viewport.offsetLeft;
    const hideTop = width < this.collapseAt;
    const hideBottom = viewport.clientWidth - width < this.collapseAt;

    topPane.style.width = hideTop ? '0%' : hideBottom ? '100%' : width + 'px';

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
