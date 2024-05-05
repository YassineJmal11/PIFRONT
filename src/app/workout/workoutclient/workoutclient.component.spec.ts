import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutclientComponent } from './workoutclient.component';

describe('WorkoutclientComponent', () => {
  let component: WorkoutclientComponent;
  let fixture: ComponentFixture<WorkoutclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutclientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
