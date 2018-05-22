import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';
import firebase from 'firebase';
import { UserDTO } from '../data/dto/user/UserDTO';
import { FirestoreManager } from "../util/FirestoreManager";
import { FirebaseManager } from "../util/FirebaseManager";
import { UserFDTO } from "../data/dto/user/UserFDTO";

@Injectable()
export class UserService {

  constructor(private firestoreManager: FirestoreManager,
              private firebaseManager: FirebaseManager) {
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

  public syncLoggedUser(): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.functions.httpsCallable('syncLoggedUser')()
        .then((result) => {
          let dataFDTO: UserFDTO = plainToClass(UserFDTO, result.data as object);
          let data: UserDTO = UserFDTO.toDTO(dataFDTO);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public updateUserFavoriteMealIds(userId: string, favoriteMealIds: string[]): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.functions.httpsCallable('updateUserFavoriteMealIds')({ userId: userId, favoriteMealIds: favoriteMealIds })
        .then((result) => {
          let dataFDTO: UserFDTO = plainToClass(UserFDTO, result.data as object);
          let data: UserDTO = UserFDTO.toDTO(dataFDTO);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
      });
    });
  }

  public createUser(user: UserDTO, userId: string): Promise<UserDTO> {
    let userFDTO: UserFDTO = UserFDTO.fromDTO(user);

    return new Promise((resolve, reject) => {
      this.firebaseManager.functions.httpsCallable('createUser')({ user: classToPlain(userFDTO), userId: userId })
        .then((result) => {
          let dataFDTO: UserFDTO = plainToClass(UserFDTO, result.data as object);
          let data: UserDTO = UserFDTO.toDTO(dataFDTO);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}
