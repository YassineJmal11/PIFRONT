import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltemplateComponent } from './alltemplate.component';

describe('AlltemplateComponent', () => {
  let component: AlltemplateComponent;
  let fixture: ComponentFixture<AlltemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlltemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlltemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
