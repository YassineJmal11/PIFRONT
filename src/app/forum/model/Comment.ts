import { User } from "src/app/user/user";
import { Post } from "./Post";
import { CommentLike } from "./CommentLike";



export class Comment {
  
    commentId!: number;
    content!:string;
    createdAt !:Date;
    updatedAt !:Date;
    post!:Post;
    user!:User;
    replies!:Comment[];
    reply!:boolean
    commentLikes!:CommentLike[];
    commentLikesCount!:number;
    liked!: boolean;
    





}