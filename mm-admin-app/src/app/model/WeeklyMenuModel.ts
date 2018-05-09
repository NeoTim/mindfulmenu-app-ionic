import { Injectable } from '@angular/core';
import { Event } from '../common/Event';
import { WeeklyMenuDTO } from '../data/dto/menu/WeeklyMenuDTO';
import { WeeklyMenuService } from '../service/WeeklyMenuService';
import * as moment from 'moment';
import { Moment } from 'moment';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { EventsService } from 'angular-event-service/dist';

@Injectable()
export class WeeklyMenuModel {

  constructor(private eventsService: EventsService,
              private localStorage: AsyncLocalStorage,
              private weeklyMenuService: WeeklyMenuService) {

    this.setupListeners();
  }

  private setupListeners(): void {
      //
  }

  public getCurrentWeeklyMenu(): Promise<WeeklyMenuDTO> {
    const firstDayOfCurrentWeek: Moment = moment().startOf('isoWeek');
    const currentWeekNumber: number = Number(firstDayOfCurrentWeek.format('YYYYMMDD'));

    return this.getWeeklyMenuByWeekNumber(currentWeekNumber);
  }

  public getWeeklyMenuInRelationToCurrent(weekRelation: number): Promise<WeeklyMenuDTO> {
    const firstDayOfTargetWeek: Moment = moment().add(weekRelation, 'week').startOf('isoWeek');
    const targetWeekNumber: number = Number(firstDayOfTargetWeek.format('YYYYMMDD'));

    return this.getWeeklyMenuByWeekNumber(targetWeekNumber);
  }

  public getWeeklyMenu(weeklyMenuId: string): Promise<WeeklyMenuDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.weeklyMenuService.getWeeklyMenu(weeklyMenuId)
        .then((weeklyMenu: WeeklyMenuDTO) => {
          this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
          return weeklyMenu;
        })
        .catch((error) => {
          this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
          this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
          return Promise.reject(error);
        });
  }

  public getWeeklyMenuByWeekNumber(weekNumber: number): Promise<WeeklyMenuDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.weeklyMenuService.getWeeklyMenuByWeekNumber(weekNumber)
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return weeklyMenu;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public getAllWeeklyMenus(): Promise<WeeklyMenuDTO[]> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.weeklyMenuService.getAllWeeklyMenus()
      .then((weeklyMenus: WeeklyMenuDTO[]) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return weeklyMenus;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public createWeeklyMenu(weeklyMenu: WeeklyMenuDTO): Promise<WeeklyMenuDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.weeklyMenuService.createWeeklyMenu(weeklyMenu)
      .then((newWeeklyMenu: WeeklyMenuDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return newWeeklyMenu;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public updateWeeklyMenu(weeklyMenu: WeeklyMenuDTO): Promise<WeeklyMenuDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.weeklyMenuService.updateWeeklyMenu(weeklyMenu)
      .then((updatedWeeklyMenu: WeeklyMenuDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return updatedWeeklyMenu;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public deleteWeeklyMenu(weeklyMenuId: string): Promise<void> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.weeklyMenuService.deleteWeeklyMenu(weeklyMenuId)
      .then(() => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

}
