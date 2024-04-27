import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product: any;
  @Output() productClicked: EventEmitter<any> = new EventEmitter();

  onClick() {
    this.productClicked.emit(this.product);
  }
}
