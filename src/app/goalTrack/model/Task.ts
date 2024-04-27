import { Goal } from "./Goal";

export class Task {
  
    taskId!: number;
    description !: string;
    startDate !:Date;
    deadline !: Date;
    completionDate!:Date|null;
    completed !:boolean ;
    goal!:Goal;

}