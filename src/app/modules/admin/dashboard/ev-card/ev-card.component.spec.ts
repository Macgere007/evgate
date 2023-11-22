import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvCardComponent } from './ev-card.component';

describe('EvCardComponent', () => {
  let component: EvCardComponent;
  let fixture: ComponentFixture<EvCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
