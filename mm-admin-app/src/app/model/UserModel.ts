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

  public getAllUsers(): Promise<UserDTO[]> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.userService.getAllUsers()
      .then((users: UserDTO[]) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return users;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public getUsersByEmail(email: string): Promise<UserDTO[]> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.userService.getUsersByEmail(email)
      .then((users: UserDTO[]) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return users;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public createUser(user: UserDTO, userId: string = null): Promise<UserDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.userService.createUser(user, userId)
      .then((createdUser: UserDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return createdUser;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public updateUser(user: UserDTO): Promise<UserDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.userService.updateUser(user)
      .then((updatedUser: UserDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return updatedUser;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public enableAutomaticUpdateForUser(userId: string): Promise<UserDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.userService.enableAutomaticUpdateForUser(userId)
      .then((updatedUser: UserDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return updatedUser;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

}
