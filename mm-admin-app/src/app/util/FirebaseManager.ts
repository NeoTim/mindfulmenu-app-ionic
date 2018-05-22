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

  // workaround for firebase auth functionality (it logs in the newly created user, which we - as admin - don't want)
  // so we're creating another "connection" to firebase and use it only for registering user, so that main app is logged in as admin
  private firebaseRegisterApp: firebase.app.App;

  public auth: firebase.auth.Auth;
  public storage: firebase.storage.Storage;
  public firestore: firebase.firestore.Firestore;
  public messaging: firebase.messaging.Messaging;
  public functions: FirebaseFunctions;

  public registerAuth: firebase.auth.Auth;

  constructor() {
    this.firebaseApp = firebase.initializeApp(ApplicationConfig.firebase);
    this.firebaseApp.firestore().settings({
        timestampsInSnapshots: true
    });

    this.firebaseRegisterApp = firebase.initializeApp(ApplicationConfig.firebase, 'register');
    this.firebaseRegisterApp.firestore().settings({
      timestampsInSnapshots: true
    });

    this.auth = this.firebaseApp.auth();
    this.storage = this.firebaseApp.storage();
    this.firestore = this.firebaseApp.firestore();
    this.messaging = this.firebaseApp.messaging();
    this.functions = this.firebaseApp['functions'](); // Firebase SDK has some issues with type declarations for this one

    this.registerAuth = this.firebaseRegisterApp.auth();
  }

}
