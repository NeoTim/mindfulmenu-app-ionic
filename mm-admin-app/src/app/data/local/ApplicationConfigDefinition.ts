import { FirebaseConfig } from './FirebaseConfig';

export interface ApplicationConfigDefinition {

  production: boolean;

  firebase: FirebaseConfig;

}
