import { environment } from '../../environment/environment';
import { ApplicationConfigDefinition } from '../data/local/ApplicationConfigDefinition';

export const ApplicationConfig: ApplicationConfigDefinition = {

  production: environment.production,
  firebase: environment.firebase

};
