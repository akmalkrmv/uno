import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { User } from 'src/app/models/user';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss'],
})
export class VideosListComponent implements OnInit, AfterViewInit {
  @Input() user: User;
  @ViewChild('videos') videosRef: ElementRef;
  @ViewChild('handle') handleRef: MatButton;

  constructor() {}

  public isContentVisible = true;
  public isDragging = false;

  public startDrag = () => (this.isDragging = true);
  public stopDrag = () => (this.isDragging = false);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const handle = this.handleRef._elementRef
      .nativeElement as HTMLButtonElement;

    handle.addEventListener('mousedown', () => this.startDrag());
    handle.addEventListener('touchstart', () => this.startDrag());

    document.addEventListener('mouseup', () => this.stopDrag());
    document.addEventListener('touchend', () => this.stopDrag());
    document.addEventListener('touchcancel', () => this.stopDrag());

    document.addEventListener('mousemove', (event) => this.drag(event));
    document.addEventListener('touchmove', (event) => this.drag(event));
  }

  private drag(event: MouseEvent | TouchEvent) {
    if (this.isDragging) {
      const videos = this.videosRef.nativeElement as HTMLDivElement;
      const clientY =
        event instanceof TouchEvent
          ? event.changedTouches[0].clientY
          : event.clientY;

      const height = clientY - videos.parentElement.offsetTop;
      const parentHeight = videos.parentElement.clientHeight;
      const hasEnoughHeight = parentHeight - height > 50;
      const videosHeight = hasEnoughHeight ? height + 'px' : '100%';

      videos.style.height = videosHeight;
      this.isContentVisible = hasEnoughHeight;
    }
  }
}
