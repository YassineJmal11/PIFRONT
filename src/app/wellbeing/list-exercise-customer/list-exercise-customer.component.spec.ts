import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExerciseCustomerComponent } from './list-exercise-customer.component';

describe('ListExerciseCustomerComponent', () => {
  let component: ListExerciseCustomerComponent;
  let fixture: ComponentFixture<ListExerciseCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListExerciseCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListExerciseCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
