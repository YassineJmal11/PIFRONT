import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaxationExerciseAddComponent } from './relaxation-exercise-add.component';

describe('RelaxationExerciseAddComponent', () => {
  let component: RelaxationExerciseAddComponent;
  let fixture: ComponentFixture<RelaxationExerciseAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelaxationExerciseAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelaxationExerciseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
