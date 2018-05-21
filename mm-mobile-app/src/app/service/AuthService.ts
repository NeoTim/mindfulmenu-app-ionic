import { Injectable } from '@angular/core';
import { FirebaseManager } from "../util/FirebaseManager";
import { FirebaseCredentialsDTO } from "../data/dto/auth/FirebaseCredentialsDTO";
import { plainToClass } from "class-transformer";
import * as moment from 'moment';
import firebase from "firebase";

@Injectable()
export class AuthService {

  constructor(private firebaseManager: FirebaseManager) {
  }

  public login(username: string, password: string): Promise<FirebaseCredentialsDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.auth.signInWithEmailAndPassword(username, password)
        .then((result: firebase.User) => {  /* new API versions are said to return slightly different object/structure, watch out */
          const firebaseCredentials: FirebaseCredentialsDTO = this.convertFirebaseUser(result);
          resolve(firebaseCredentials);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.auth.signOut()
        .then((result) => {
          resolve(result);
        })
        .catch( (error) => {
          reject(error);
        });
    });
  }

  public recoverCredentials(): Promise<FirebaseCredentialsDTO> {
    return new Promise((resolve, reject) => {
      const unsubscribeFn: firebase.Unsubscribe = this.firebaseManager.auth.onAuthStateChanged((user: firebase.User) => {
        unsubscribeFn();

        if (user === null) {
          reject(null);
        }
        else {
          const firebaseCredentials: FirebaseCredentialsDTO = this.convertFirebaseUser(user);
          resolve(firebaseCredentials);
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  public changePassword(username: string, currentPassword: string, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const credential = firebase.auth.EmailAuthProvider.credential(username, currentPassword);

      this.firebaseManager.auth.currentUser.reauthenticateWithCredential(credential)
        .then((result) => {
          this.firebaseManager.auth.currentUser.updatePassword(newPassword)
            .then((result) => {
              resolve(result);
            })
            .catch( (error) => {
              reject(error);
            });
        })
        .catch( (error) => {
          reject(error);
        });
    });
  }

  public register(username: string, password: string): Promise<FirebaseCredentialsDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.auth.createUserWithEmailAndPassword(username, password)
        .then((result: firebase.User) => { /* new API versions are said to return slightly different object/structure, watch out */
          //return result.sendEmailVerification()
            //.then(() => {
              const firebaseCredentials: FirebaseCredentialsDTO = this.convertFirebaseUser(result);
              resolve(firebaseCredentials);
            //})
            //.catch((error) => {
            //  reject(error);
            //});
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // I've created FirebaseCredentialsDTO to extract the most important data (the rest of the object is just gibberish properties and functions named a,b,c, etc.)
  // firebase.User complains about accessing/copying some metadata (they're marked as readonly (?))
  // note: FirebaseCredentialsDTO isn't really used for authorization, Firebase SDK maintains its own firebase.User in the background - we just store a simplified copy for reference
  private convertFirebaseUser(user: firebase.User): FirebaseCredentialsDTO  {
    const reflectionFirebaseCredentials: FirebaseCredentialsDTO = new FirebaseCredentialsDTO();
    let targetFirebaseCredentials: any = {};

    for (let propertyName in reflectionFirebaseCredentials) {
      if (user.hasOwnProperty(propertyName)) {
        targetFirebaseCredentials[propertyName] = user[propertyName];
      }
    }

    targetFirebaseCredentials.creationTime = moment(user.metadata.creationTime).toDate();
    targetFirebaseCredentials.lastSignInTime = moment(user.metadata.lastSignInTime).toDate();

    let firebaseCredentials: FirebaseCredentialsDTO = plainToClass(FirebaseCredentialsDTO, targetFirebaseCredentials as object);
    return firebaseCredentials;
  }

}
