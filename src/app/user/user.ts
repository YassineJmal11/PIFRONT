import { AccountStatus } from "./AccountStatus";
export interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: Date | null;
    gender: string;
    weight: number | null;
    height: number | null;
    roles: string[];
    diploma: string;
    profileImageUrl: string;
    accountStatus: AccountStatus; 
    badWordsCount:number;

  }
  