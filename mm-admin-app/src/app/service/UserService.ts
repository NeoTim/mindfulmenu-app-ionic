import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';
import * as firebase from 'firebase';
import { UserDTO } from '../data/dto/user/UserDTO';
import { FirestoreManager } from '../util/FirestoreManager';
import { UserFDTO } from '../data/dto/user/UserFDTO';
import { FirebaseManager } from '../util/FirebaseManager';

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

  public getAllUsers(): Promise<UserDTO[]> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('users').get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: object = this.firestoreManager.queryToObjectArray(querySnapshot);
          let data: UserDTO[] = plainToClass(UserDTO, result as object[]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getUsersByEmail(email: string): Promise<UserDTO[]> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('users').where('email', '==', email).get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: object = this.firestoreManager.queryToObjectArray(querySnapshot);
          let data: UserDTO[] = plainToClass(UserDTO, result as object[]);
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

  public updateUser(user: UserDTO): Promise<UserDTO> {
    let userFDTO: UserFDTO = UserFDTO.fromDTO(user);

    return new Promise((resolve, reject) => {
      this.firebaseManager.functions.httpsCallable('updateUser')({ user: classToPlain(userFDTO), userId: userFDTO.id })
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

  public enableAutomaticUpdateForUser(userId: string): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.functions.httpsCallable('enableAutomaticUpdateForUser')({ userId: userId })
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
