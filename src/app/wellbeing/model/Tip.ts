export enum TipType {
    StressManagementTips = "Stress Management",
    SleepHygieneTips = "Sleep Hygiene",
    MindfulnessTips = "Mindfulness",
    TimeManagementTips = "Time Management",
    HealthyLifestyleTips = "Healthy Lifestyle"
  }
  
  export interface Tip {
    tipId?: number;
    tipTitle: string;
    content: string;
    tipType: TipType;
  }
  