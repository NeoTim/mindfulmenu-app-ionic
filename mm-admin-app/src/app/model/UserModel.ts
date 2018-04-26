import { Injectable } from '@angular/core';
import { Event } from '../common/Event';
import { UserDTO } from '../data/dto/user/UserDTO';
import { UserService } from '../service/UserService';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { EventsService } from 'angular-event-service/dist';

@Injectable()
export class UserModel {

  constructor(private eventsService: EventsService,
              private localStorage: AsyncLocalStorage,
              private userService: UserService) {

    this.setupListeners();
  }

  private setupListeners(): void {
  }

  public getUser(userId: string): Promise<UserDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.userService.getUser(userId)
      .then((user: UserDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return user;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public getUserByUID(userUID: string): Promise<UserDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.userService.getUserByUID(userUID)
      .then((user: UserDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return user;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

}
