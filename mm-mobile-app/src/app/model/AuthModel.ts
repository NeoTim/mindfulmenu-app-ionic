import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";
import { Event } from '../common/Event';
import { Storage } from "@ionic/storage";
import { AuthService } from "../service/AuthService";
import { FirebaseCredentialsDTO } from "../data/dto/auth/FirebaseCredentialsDTO";

@Injectable()
export class AuthModel {

  public credentials: FirebaseCredentialsDTO;

  constructor(private events: Events,
              private storage: Storage,
              private authService: AuthService) {
  }

  public login(username: string, password: string): Promise<FirebaseCredentialsDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.authService.login(username, password)
      .then((credentials: FirebaseCredentialsDTO) => {
        this.credentials = credentials;
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.AUTH.LOGIN.SUCCESS, credentials);
        return credentials;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return Promise.reject(error);
      })
  }

  public logout(): Promise<any> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.authService.logout()
      .then((result: any) => {
        this.credentials = null;
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.AUTH.LOGOUT.SUCCESS);
        return result;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return Promise.reject(error);
      })
  }

  public recoverCredentials(): Promise<FirebaseCredentialsDTO> {
    return this.authService.recoverCredentials()
      .then((credentials: FirebaseCredentialsDTO) => {
        this.credentials = credentials;
        return credentials;
      })
      .catch((error) => {
        return Promise.reject(error);
      })
  }

}
