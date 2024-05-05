export interface Role {
    id: number;
    name: ERole;
  }
  
  export enum ERole {
    ADMIN = "ADMIN",
    COACH = "COACH",
    NUTRITIONIST = "NUTRITIONIST",
    PSYCHOLOGIST = "PSYCHOLOGIST",
    CUSTOMER = "CUSTOMER"
  }
  