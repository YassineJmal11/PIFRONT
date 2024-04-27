import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateBackComponent } from './template-back.component';

describe('TemplateBackComponent', () => {
  let component: TemplateBackComponent;
  let fixture: ComponentFixture<TemplateBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateBackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
