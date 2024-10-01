import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, collectionData } from '@angular/fire/firestore';
import {v4 as uuidv4   } from 'uuid';
import { Observable } from 'rxjs';
import { User, VerificationToken } from '../../../lib/definitions';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'users');
  tokensCollection = collection(this.firestore, 'verificationTokens');
  
  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<User[]>;
  }

  async generateVerificationToken(email: string): Promise<VerificationToken> {
    const token = uuidv4(); // generate a random token
    const expiresAt = new Date(Date.now() + 60 * 1000 * 5); // 5 min

    const verificationToken: VerificationToken = {
      token,
      email,
      expiresAt: Timestamp.fromDate(expiresAt), // pass in firebase timestamp format
    };

    await addDoc(this.tokensCollection, verificationToken); // firebase method to add document to collection

    return verificationToken; // return the token object
   }

}

