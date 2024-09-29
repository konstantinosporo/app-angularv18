import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../../lib/definitions';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'users');
  
  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<User[]>;
   }

}
