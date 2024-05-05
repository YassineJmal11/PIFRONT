import { User } from "src/app/user/user";
import { Post } from "./Post";



export class Community {
  
    communityId!: number;
    createdAt !:Date;
    communityName !: string;   
      creator!:User;
      members!:User[];
      posts!:Post[];

}