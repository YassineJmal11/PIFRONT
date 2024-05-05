import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileWorkoutComponent } from './my-profile-workout.component';

describe('MyProfileWorkoutComponent', () => {
  let component: MyProfileWorkoutComponent;
  let fixture: ComponentFixture<MyProfileWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProfileWorkoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProfileWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
