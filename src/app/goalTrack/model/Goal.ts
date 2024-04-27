import { User } from "src/app/user/user";
import { Task } from "./Task";


export class Goal {
  
      goalId!: number;
      title !: string;
      description !: string;
      progress !:number;
      startDate !:Date;
      deadline !: Date;
      completionDate!:Date|null;
      completed!:boolean;
      tasks!:Task[];
      user!:User;
      


}