import { Injectable } from '@angular/core';
import { Event } from '../common/Event';
import { AuthService } from '../service/AuthService';
import { FirebaseCredentialsDTO } from '../data/dto/auth/FirebaseCredentialsDTO';
import { EventsService } from 'angular-event-service/dist';
import { AsyncLocalStorage } from 'angular-async-local-storage';

@Injectable()
export class AuthModel {


  constructor(private eventsService: EventsService,
              private localStorage: AsyncLocalStorage,
              private authService: AuthService) {

    this.setupListeners();
  }

  private setupListeners(): void {
    //
  }

  public register(username: string, password: string): Promise<FirebaseCredentialsDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.authService.register(username, password)
      .then((credentials: FirebaseCredentialsDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return credentials;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return Promise.reject(error);
      });
  }

}
