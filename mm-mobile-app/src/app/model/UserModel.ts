import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Event } from '../common/Event';
import { UserDTO } from "../data/dto/user/UserDTO";
import { UserService } from "../service/UserService";

@Injectable()
export class UserModel {

  public currentUser: UserDTO;

  constructor(private events: Events,
              private storage: Storage,
              private userService: UserService) {

    this.setupListeners();
  }

  private setupListeners(): void {
    this.events.subscribe(Event.AUTH.LOGOUT.SUCCESS, () => {
      this.currentUser = null;
    });
  }

  public getUser(userId: string): Promise<UserDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.userService.getUser(userId)
      .then((user: UserDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return user;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

  public getUserByUID(userUID: string): Promise<UserDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.userService.getUserByUID(userUID)
      .then((user: UserDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return user;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

}
