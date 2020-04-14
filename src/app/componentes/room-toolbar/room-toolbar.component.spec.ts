import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomToolbarComponent } from './room-toolbar.component';

describe('RoomToolbarComponent', () => {
  let component: RoomToolbarComponent;
  let fixture: ComponentFixture<RoomToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
