import { ApplicationConfig } from "../config/ApplicationConfig";
import { Injectable } from "@angular/core";
import * as _ from "lodash";
import firebase from "firebase";
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/messaging';

@Injectable()
export class FirebaseManager {

  private firebaseApp: firebase.app.App;

  public auth: firebase.auth.Auth;
  public storage: firebase.storage.Storage;
  public firestore: firebase.firestore.Firestore;
  public messaging: firebase.messaging.Messaging;

  constructor(private config: ApplicationConfig) {
    this.firebaseApp = firebase.initializeApp(config.ENV.firebase);
    this.firebaseApp.firestore().settings({
        timestampsInSnapshots: true
    });

    this.auth = this.firebaseApp.auth();
    this.storage = this.firebaseApp.storage();
    this.firestore = this.firebaseApp.firestore();
    this.messaging = this.firebaseApp.messaging();
  }

  //

  queryToObjectArray(querySnapshot: firebase.firestore.QuerySnapshot): Object[] {
    return _.map(querySnapshot.docs, (queryDocumentSnapshot: firebase.firestore.QueryDocumentSnapshot) => {
      let obj: Object = queryDocumentSnapshot.data();
      obj['id'] = queryDocumentSnapshot.id;

      return obj;
    });
  }

  documentToObject(documentSnapshot: firebase.firestore.DocumentSnapshot): Object {
    let obj: Object = documentSnapshot.data();
    obj['id'] = documentSnapshot.id;

    return obj;
  }

  getByIds(idArray: string[], collection: firebase.firestore.CollectionReference): Promise<firebase.firestore.DocumentSnapshot[]> {
    return new Promise((resolve, reject) => {
        if ((idArray === null) || (idArray.length === 0)) {
          reject(null);
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
              })
          }
        }
    })
  }

}
