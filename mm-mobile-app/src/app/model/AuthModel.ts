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

    this.setupListeners();
  }

  private setupListeners(): void {
    this.events.subscribe(Event.SYSTEM.FORCE_SILENT_LOGOUT, () => {
      this.authService.logout()
        .then((result: any) => {
          this.credentials = null;
        })
        .catch((error) => {
          //
        })
    });
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

  public register(username: string, password: string): Promise<FirebaseCredentialsDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.authService.register(username, password)
      .then((credentials: FirebaseCredentialsDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.FORCE_SILENT_LOGOUT, false);
        return credentials;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.FORCE_SILENT_LOGOUT, false);
        return Promise.reject(error);
      })
  }

  public changePassword(username: string, currentPassword: string, newPassword: string): Promise<any> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.authService.changePassword(username, currentPassword, newPassword)
      .then((result: any) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return result;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return Promise.reject(error);
      })
  }

  public forgotPassword(username: string): Promise<void> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.authService.forgotPassword(username)
      .then((result: any) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return result;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return Promise.reject(error);
      })
  }


}
