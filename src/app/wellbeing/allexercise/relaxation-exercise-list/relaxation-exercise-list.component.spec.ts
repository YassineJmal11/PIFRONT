import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaxationExerciseListComponent } from './relaxation-exercise-list.component';

describe('RelaxationExerciseListComponent', () => {
  let component: RelaxationExerciseListComponent;
  let fixture: ComponentFixture<RelaxationExerciseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelaxationExerciseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelaxationExerciseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
