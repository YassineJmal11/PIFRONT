import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBackComponent } from './header-back.component';

describe('HeaderBackComponent', () => {
  let component: HeaderBackComponent;
  let fixture: ComponentFixture<HeaderBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderBackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
