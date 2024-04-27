import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBackendComponent } from './store-backend.component';

describe('StoreBackendComponent', () => {
  let component: StoreBackendComponent;
  let fixture: ComponentFixture<StoreBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreBackendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
