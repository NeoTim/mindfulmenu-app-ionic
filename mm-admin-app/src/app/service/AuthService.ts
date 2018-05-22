import { Injectable } from '@angular/core';
import { FirebaseManager } from '../util/FirebaseManager';
import { FirebaseCredentialsDTO } from '../data/dto/auth/FirebaseCredentialsDTO';
import { plainToClass } from 'class-transformer';
import * as moment from 'moment';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {

  constructor(private firebaseManager: FirebaseManager) {
  }

  public register(username: string, password: string): Promise<FirebaseCredentialsDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.registerAuth.createUserWithEmailAndPassword(username, password)
        .then((result: firebase.User) => { /* new API versions are said to return slightly different object/structure, watch out */
          return result.sendEmailVerification()
            .then(() => {
              // createUserWithEmailAndPassword will log us in, but we don't want to store that credentials, even if secondary firebase app (firebaseManager.registerAuth)
              // so let's log out in either case, just to keep it clean
              this.firebaseManager.registerAuth.signOut()
                .then(() => {})
                .catch((error) => {});

              const firebaseCredentials: FirebaseCredentialsDTO = this.convertFirebaseUser(result);
              resolve(firebaseCredentials);
            })
            .catch((error) => {
              this.firebaseManager.registerAuth.signOut()
                .then(() => {})
                .catch((signOutError) => {});

              reject(error);
            });
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
