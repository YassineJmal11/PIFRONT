import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductReview } from '../entities';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.css']
})
export class ProductReviewComponent {
  @Input() review!: ProductReview;
  unknownUserIcon:string = "https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-120.jpg?size=626&ext=jpg&ga=GA1.1.1803636316.1711756800&semt=ais"
}
