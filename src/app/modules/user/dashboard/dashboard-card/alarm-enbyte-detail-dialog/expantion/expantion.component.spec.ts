import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpantionComponent } from './expantion.component';

describe('ExpantionComponent', () => {
  let component: ExpantionComponent;
  let fixture: ComponentFixture<ExpantionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpantionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpantionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
