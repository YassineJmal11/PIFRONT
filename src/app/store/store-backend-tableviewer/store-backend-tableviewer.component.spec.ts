import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBackendTableviewerComponent } from './store-backend-tableviewer.component';

describe('StoreBackendTableviewerComponent', () => {
  let component: StoreBackendTableviewerComponent;
  let fixture: ComponentFixture<StoreBackendTableviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreBackendTableviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreBackendTableviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
