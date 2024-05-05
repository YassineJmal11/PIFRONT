import { User } from "../user/user";

export class Rating {
    id: number;
    ratedUser: User;
    ratingUser: User;
    ratingValue: number;
  
    constructor(id: number, ratedUser: User, ratingUser: User, ratingValue: number) {
      this.id = id;
      this.ratedUser = ratedUser;
      this.ratingUser = ratingUser;
      this.ratingValue = ratingValue;
    }
  }