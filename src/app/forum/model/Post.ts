import { User } from "src/app/user/user";
import { Community } from "./Community";
import { PostType } from "./PostType";

export class Post {
  postId!: number;
  textContent!: string;
  user!: User;
  attachment!: string; 
  createdAt!: Date;
  updatedAt!: Date;
  community!: Community;
  postType!: PostType; 
}
