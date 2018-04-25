import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { FirebaseManager } from '../util/FirebaseManager';
import firebase from 'firebase';
import { UserDTO } from '../data/dto/user/UserDTO';

@Injectable()
export class UserService {

  constructor(private firebaseManager: FirebaseManager) {
  }

  public getUser(userId: string): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.firestore.collection('users').doc(userId).get()
        .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
          let result: Object = this.firebaseManager.documentToObject(documentSnapshot);
          let data: UserDTO = plainToClass(UserDTO, result as Object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getUserByUID(userUID: string): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.firestore.collection('users').where('UID', '==', userUID).get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: Object[] = this.firebaseManager.queryToObjectArray(querySnapshot);
          let data: UserDTO[] = plainToClass(UserDTO, result as Object[]);

          if (data.length === 1) {
            resolve(data[0]);
          }
          else {
            reject(null);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }



}
