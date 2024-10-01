import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private readonly auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser$.next(user);
    })
   }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async register(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async logout(): Promise<void> {
    console.log('User logged out');
    await signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getCurrentUserObservable() {
    return this.currentUser$.asObservable();
  }
  
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
  
  loginWithGitHub() {
    const provider = new GithubAuthProvider();
    return signInWithPopup(this.auth, provider);
   }

}