import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerExerciseComponent } from './customer-exercise.component';

describe('CustomerExerciseComponent', () => {
  let component: CustomerExerciseComponent;
  let fixture: ComponentFixture<CustomerExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerExerciseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
