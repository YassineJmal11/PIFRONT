import { User } from "src/app/user/user";
import { Post } from "./Post";
import { VoteType } from "./VoteType";


export class Vote {
  voteId!: number;
  user!: User;
  createdAt!: Date;
  voteType!: VoteType; 
  post!:Post



}
