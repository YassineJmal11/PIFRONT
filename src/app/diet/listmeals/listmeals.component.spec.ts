import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListmealsComponent } from './listmeals.component';

describe('ListmealsComponent', () => {
  let component: ListmealsComponent;
  let fixture: ComponentFixture<ListmealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListmealsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListmealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
