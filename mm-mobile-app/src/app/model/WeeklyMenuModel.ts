import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Event } from '../common/Event';
import { WeeklyMenuDTO } from "../data/dto/menu/WeeklyMenuDTO";
import { WeeklyMenuService } from "../service/WeeklyMenuService";
import { Moment } from "moment";
import { DateUtil } from "../util/DateUtil";

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

  public getCurrentWeeklyMenu(): Promise<WeeklyMenuDTO> {
    const firstDayOfCurrentWeek: Moment = DateUtil.getFirstDayOfCurrentWeek();
    const currentWeekNumber: number = Number(firstDayOfCurrentWeek.format('YYYYMMDD'));

    return this.getWeeklyMenuByWeekNumber(currentWeekNumber);
  }

  public getWeeklyMenuInRelationToCurrent(weekRelation: number): Promise<WeeklyMenuDTO> {
    const firstDayOfTargetWeek: Moment = DateUtil.getFirstDayOfCurrentWeek().add(weekRelation, 'week').startOf('isoWeek');
    const targetWeekNumber: number = Number(firstDayOfTargetWeek.format('YYYYMMDD'));

    return this.getWeeklyMenuByWeekNumber(targetWeekNumber);
  }

  public getWeeklyMenu(weeklyMenuId: string): Promise<WeeklyMenuDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyMenuService.getWeeklyMenu(weeklyMenuId)
        .then((weeklyMenu: WeeklyMenuDTO) => {
          this.events.publish(Event.SYSTEM.LOADING, false);
          return weeklyMenu;
        })
        .catch((error) => {
          this.events.publish(Event.SYSTEM.LOADING, false);
          this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
          return Promise.reject(error);
        })
  }

  public getWeeklyMenuByWeekNumber(weekNumber: number): Promise<WeeklyMenuDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyMenuService.getWeeklyMenuByWeekNumber(weekNumber)
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return weeklyMenu;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

}
