import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';
import firebase from 'firebase';
import { UserDTO } from '../data/dto/user/UserDTO';
import { FirestoreManager } from "../util/FirestoreManager";

@Injectable()
export class UserService {

  constructor(private firestoreManager: FirestoreManager) {
  }

  public getUser(userId: string): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('users').doc(userId).get()
        .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
          let result: object = this.firestoreManager.documentToObject(documentSnapshot);
          let data: UserDTO = plainToClass(UserDTO, result as object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public updateUserFavoriteMealIds(userId: string, favoriteMealIds: string[]): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('users').doc(userId).update( { 'favoriteMealIds': favoriteMealIds })
        .then(() => {
            resolve(this.getUser(userId));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public createUser(user: UserDTO): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('users').add(classToPlain(user))
        .then((documentReference: firebase.firestore.DocumentReference) => {
          resolve(this.getUser(documentReference.id));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}
