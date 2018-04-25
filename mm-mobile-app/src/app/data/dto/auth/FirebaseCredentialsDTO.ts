export class FirebaseCredentialsDTO {

  /* need to initialize all the fields, as a code in AuthService has to iterate over all of them */

  uid: string = undefined;

  displayName: string = undefined;

  email: string = undefined;

  phoneNumber: string = undefined;

  photoURL: string = undefined;

  emailVerified: boolean = undefined;

  isAnonymous: boolean = undefined;

  creationTime: Date = undefined;
​​
  lastSignInTime: Date = undefined;

  refreshToken: string = undefined;

}
