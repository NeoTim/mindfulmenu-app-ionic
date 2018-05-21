import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Event } from '../common/Event';
import { UserDTO } from "../data/dto/user/UserDTO";
import { UserService } from "../service/UserService";
import * as _ from "lodash";

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

  public toggleFavoriteMeal(mealId: string, isFavorite: boolean): Promise<UserDTO> {
    let favoriteMealIds: string[] = _.cloneDeep(this.currentUser.favoriteMealIds);

    if (isFavorite) {
      favoriteMealIds.push(mealId);
    }
    else {
      _.remove(favoriteMealIds, (id: string) => {
        return (id === mealId);
      });
    }

    // if there was no mealId in currentUser.favoriteMealIds and nothing was actually removed, don't make the call
    if (_.isEqual(favoriteMealIds, this.currentUser.favoriteMealIds)) {
      return Promise.resolve(this.currentUser);
    }
    else {
      this.events.publish(Event.SYSTEM.LOADING, true);

      return this.userService.updateUserFavoriteMealIds(this.currentUser.id, favoriteMealIds)
        .then((user: UserDTO) => {
          this.events.publish(Event.SYSTEM.LOADING, false);
          this.currentUser = user;
          return user;
        })
        .catch((error) => {
          this.events.publish(Event.SYSTEM.LOADING, false);
          this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
          return Promise.reject(error);
        })
    }
  }

  public createUser(user: UserDTO): Promise<UserDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.userService.createUser(user)
      .then((createdUser: UserDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return createdUser;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

}
