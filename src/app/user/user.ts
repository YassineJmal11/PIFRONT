export interface User {
    id: number;
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
    diploma: any;
    photo: any;
  }
  