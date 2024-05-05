import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreShipmentComponent } from './store-shipment.component';

describe('StoreShipmentComponent', () => {
  let component: StoreShipmentComponent;
  let fixture: ComponentFixture<StoreShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreShipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
