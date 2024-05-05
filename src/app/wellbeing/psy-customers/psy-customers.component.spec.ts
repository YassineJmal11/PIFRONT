import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsyCustomersComponent } from './psy-customers.component';

describe('PsyCustomersComponent', () => {
  let component: PsyCustomersComponent;
  let fixture: ComponentFixture<PsyCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsyCustomersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsyCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
