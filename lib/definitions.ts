import type { Timestamp } from "@angular/fire/firestore";

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
 
export interface RegisterUser {
  name:string;
  email: string;
  password: string;
}
 
export interface VerificationToken {
  token: string;
  email: string;
  expiresAt: Timestamp
 }