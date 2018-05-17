import * as _ from 'lodash';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { FirebaseManager } from './FirebaseManager';
import { Injectable } from '@angular/core';

@Injectable()
export class FirestoreManager {

  public firestore: firebase.firestore.Firestore;

  constructor(public firebaseManager: FirebaseManager) {
    this.firestore = firebaseManager.firestore;
  }

  public queryToObjectArray(querySnapshot: firebase.firestore.QuerySnapshot): object[] {
    let result: object[] = _.map(querySnapshot.docs, (queryDocumentSnapshot: firebase.firestore.QueryDocumentSnapshot) => {
      let obj: object = queryDocumentSnapshot.data();

      if (!_.isNil(obj)) {
        obj['id'] = queryDocumentSnapshot.id;
        return obj;
      }
      else {
        return null;
      }
    });

    return _.without(result, null);
  }

  // for queries from which you expect only one unique result (array with single object)
  public queryToObject(querySnapshot: firebase.firestore.QuerySnapshot): object {
    let result: object[] = this.queryToObjectArray(querySnapshot);

    if (result) {
      if (result.length === 1) {
        if (!_.isNil(result[0])) {
          return result[0];
        }
        else {
          return null;
        }
      }
      else {
        // if there's more than one or none at all, then it's unexpected result
        return null;
      }
    }
    else {
      return null;
    }
  }

  public documentArrayToObjectArray(documentSnapshots: firebase.firestore.DocumentSnapshot[]): object[] {
    let result: object[] = _.map(documentSnapshots, (documentSnapshot: firebase.firestore.DocumentSnapshot) => {
      return this.documentToObject(documentSnapshot);
    });

    return _.without(result, null);
  }

  public documentToObject(documentSnapshot: firebase.firestore.DocumentSnapshot): object {
    let obj: object = documentSnapshot.data();

    if (!_.isNil(obj)) {
      obj['id'] = documentSnapshot.id;
      return obj;
    }
    else {
      return null;
    }
  }

  public stripUndefined(obj: any): any {
    return _.omitBy(obj, _.isUndefined);
  }

  public getByIds(idArray: string[], collection: firebase.firestore.CollectionReference): Promise<firebase.firestore.DocumentSnapshot[]> {
    return new Promise((resolve, reject) => {
      if (_.isNil(idArray)) {
        reject(null);
      }
      else if (idArray.length === 0) {
        resolve([]);
      }
      else {
        let successCount: number = 0;
        let errorCount: number = 0;
        let totalCount: number = idArray.length;

        let items: firebase.firestore.DocumentSnapshot[] = [];

        for (let id of idArray) {
          collection.doc(id).get()
            .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
              items.push(documentSnapshot);
              successCount++;

              if ((successCount + errorCount) === totalCount) {
                resolve(items);
              }
            })
            .catch((error) => {
              errorCount++;

              if (errorCount === totalCount) {
                reject(error);
              }
              else if ((successCount + errorCount) === totalCount) {
                resolve(items);
              }
            });
        }
      }
    });
  }

}
