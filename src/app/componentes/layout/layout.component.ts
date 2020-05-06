import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public isHeadset$: Observable<BreakpointState>;
  public hasSubmenu$ = new BehaviorSubject(false);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public auth: AuthService,
    public title: TitleService
  ) {
    this.isHeadset$ == this.breakpointObserver.observe(Breakpoints.Handset);
  }

  ngOnInit(): void {}

  closeApp(): void {
    this.router.navigate(['/']);
    window.close();
  }

  titleClick($event): void {
    this.title.click$.emit($event);
  }
}
