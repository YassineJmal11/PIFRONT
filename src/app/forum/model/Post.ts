import { User } from "src/app/user/user";
import { Community } from "./Community";
import { PostType } from "./PostType";
import { Vote } from "./Vote";
import { Comment } from "./Comment";

export class Post {
  postId!: number;
  textContent!: string;
  user!: User;
  attachment!: string; 
  createdAt!: Date;
  updatedAt!: Date;
  community!: Community;
  postType!: PostType; 
  votes!:Vote[];
  upvoteCount!: number;
  downvoteCount!: number;
  upvoted!: boolean;
  downvoted!: boolean;
  totalVotes!:number;
  comments!:Comment[];
}
