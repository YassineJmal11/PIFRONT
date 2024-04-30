export class Exercice {
    exerciceId!: number;
    exerciceName!: string;
    muscle!: ExerciceType;
    exerciceImageUrl!: string;
    
  }
  
  export enum ExerciceType {
    CHEST = "CHEST",
    BACK = "BACK",
    ARMS = "ARMS",
    ABDOMINALS = "ABDOMINALS",
    LEGS = "LEGS",
    SHOULDERS = "SHOULDERS",
    CALVES = "CALVES",
    QUADRICEPS = "QUADRICEPS",
    GLUTES = "GLUTES",
    BICEPS = "BICEPS",
    TRICEPS = "TRICEPS",
    FOREARMS = "FOREARMS",
    TRAPEZIUS = "TRAPEZIUS",
    LATISSIMUSDORSI = "LATISSIMUSDORSI",
  }