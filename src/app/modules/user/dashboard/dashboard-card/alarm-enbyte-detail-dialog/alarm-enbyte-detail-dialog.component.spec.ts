import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmEnbyteDetailDialogComponent } from './alarm-enbyte-detail-dialog.component';

describe('AlarmEnbyteDetailDialogComponent', () => {
  let component: AlarmEnbyteDetailDialogComponent;
  let fixture: ComponentFixture<AlarmEnbyteDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmEnbyteDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmEnbyteDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
