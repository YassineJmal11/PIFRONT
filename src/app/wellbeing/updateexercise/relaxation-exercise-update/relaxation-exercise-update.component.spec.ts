import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaxationExerciseUpdateComponent } from './relaxation-exercise-update.component';

describe('RelaxationExerciseUpdateComponent', () => {
  let component: RelaxationExerciseUpdateComponent;
  let fixture: ComponentFixture<RelaxationExerciseUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelaxationExerciseUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelaxationExerciseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
