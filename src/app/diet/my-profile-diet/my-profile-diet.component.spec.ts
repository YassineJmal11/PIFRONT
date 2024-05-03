import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileDietComponent } from './my-profile-diet.component';

describe('MyProfileDietComponent', () => {
  let component: MyProfileDietComponent;
  let fixture: ComponentFixture<MyProfileDietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProfileDietComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProfileDietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
