import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Event } from '../common/Event';
import { WeeklyMenuDTO } from "../data/dto/weeklyMenu/WeeklyMenuDTO";
import { WeeklyMenuService } from "../service/WeeklyMenuService";

@Injectable()
export class WeeklyMenuModel {

  constructor(private events: Events,
              private storage: Storage,
              private weeklyMenuService: WeeklyMenuService) {

    this.setupListeners();
  }

  private setupListeners(): void {
      //
  }

  public getWeeklyMenu(weeklyMenuId: string): Promise<WeeklyMenuDTO> {
      return this.weeklyMenuService.getWeeklyMenu(weeklyMenuId)
          .then((weeklyMenu: WeeklyMenuDTO) => {
              return weeklyMenu;
          })
          .catch((error) => {
              this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
              return Promise.reject(error);
          })
  }

}
