import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
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

  public getUserByUID(userUID: string): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('users').where('UID', '==', userUID).get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: object = this.firestoreManager.queryToObject(querySnapshot);
          let data: UserDTO = plainToClass(UserDTO, result as object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }



}
