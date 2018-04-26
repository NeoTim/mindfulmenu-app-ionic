import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/functions';
import { FirebaseFunctions } from '@firebase/functions-types';
import { ApplicationConfig } from '../config/ApplicationConfig';

@Injectable()
export class FirebaseManager {

  private firebaseApp: firebase.app.App;

  public auth: firebase.auth.Auth;
  public storage: firebase.storage.Storage;
  public firestore: firebase.firestore.Firestore;
  public messaging: firebase.messaging.Messaging;
  public functions: FirebaseFunctions;

  constructor() {
    this.firebaseApp = firebase.initializeApp(ApplicationConfig.firebase);
    this.firebaseApp.firestore().settings({
        timestampsInSnapshots: true
    });

    this.auth = this.firebaseApp.auth();
    this.storage = this.firebaseApp.storage();
    this.firestore = this.firebaseApp.firestore();
    this.messaging = this.firebaseApp.messaging();
    this.functions = this.firebaseApp['functions'](); // Firebase SDK has some issues with type declarations for this one
  }

}
