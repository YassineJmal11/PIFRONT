import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBackendEditComponent } from './store-backend-edit.component';

describe('StoreBackendEditComponent', () => {
  let component: StoreBackendEditComponent;
  let fixture: ComponentFixture<StoreBackendEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreBackendEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreBackendEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
