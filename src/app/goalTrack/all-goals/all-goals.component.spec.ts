import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGoalsComponent } from './all-goals.component';

describe('AllGoalsComponent', () => {
  let component: AllGoalsComponent;
  let fixture: ComponentFixture<AllGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllGoalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
