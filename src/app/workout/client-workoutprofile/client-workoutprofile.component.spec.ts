import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWorkoutprofileComponent } from './client-workoutprofile.component';

describe('ClientWorkoutprofileComponent', () => {
  let component: ClientWorkoutprofileComponent;
  let fixture: ComponentFixture<ClientWorkoutprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientWorkoutprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientWorkoutprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
