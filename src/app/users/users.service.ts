import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../lib/definitions';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users = new BehaviorSubject<User[]>([]);
  firestore = inject(Firestore);

  async addUser(name: string, email: string, password: string): Promise<void> {
    const newUser: User = { name, email, password };

    // Add user to Firestore
    try {
      const docRef = await addDoc(collection(this.firestore, 'users'), newUser);
      console.log("User added with ID: ", docRef.id);

      // Optionally, you can also update your BehaviorSubject
      const currentUsers = [...this.users.getValue(), newUser];
      this.users.next(currentUsers);
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  }
}
