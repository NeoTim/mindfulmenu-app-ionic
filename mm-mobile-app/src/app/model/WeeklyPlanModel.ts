import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Event } from '../common/Event';
import { Moment } from "moment";
import { WeeklyPlanService } from "../service/WeeklyPlanService";
import { WeeklyPlanDTO } from "../data/dto/menu/WeeklyPlanDTO";
import { DateUtil } from "../util/DateUtil";
import { UserDTO } from "../data/dto/user/UserDTO";

@Injectable()
export class WeeklyPlanModel {

  constructor(private events: Events,
              private storage: Storage,
              private weeklyPlanService: WeeklyPlanService) {

    this.setupListeners();
  }

  private setupListeners(): void {
      //
  }

  public getCurrentWeeklyPlan(userId: string): Promise<WeeklyPlanDTO> {
    return new Promise((resolve, reject) => {
      const firstDayOfCurrentWeek: Moment = DateUtil.getFirstDayOfCurrentWeek();
      const currentWeekNumber: number = Number(firstDayOfCurrentWeek.format('YYYYMMDD'));

      this.getWeeklyPlanByUserIdAndWeekNumber(userId, currentWeekNumber)
        .then((weeklyPlan: WeeklyPlanDTO) => {
          if (weeklyPlan == null) {
            let newWeeklyPlan: WeeklyPlanDTO = new WeeklyPlanDTO();
            newWeeklyPlan.userId = userId;
            newWeeklyPlan.weekNumber = currentWeekNumber;
            newWeeklyPlan.mealIds = [];
            newWeeklyPlan.customIngredientIds = [];
            newWeeklyPlan.checkedIngredientIds = [];

            resolve(this.createWeeklyPlan(newWeeklyPlan));
          }
          else {
            resolve(weeklyPlan);
          }
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  public getWeeklyPlanInRelationToCurrent(userId: string, weekRelation: number): Promise<WeeklyPlanDTO> {
    const firstDayOfTargetWeek: Moment = DateUtil.getFirstDayOfCurrentWeek().add(weekRelation, 'week').startOf('isoWeek');
    const targetWeekNumber: number = Number(firstDayOfTargetWeek.format('YYYYMMDD'));

    return this.getWeeklyPlanByUserIdAndWeekNumber(userId, targetWeekNumber);
  }

  public getWeeklyPlan(weeklyPlanId: string): Promise<WeeklyPlanDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.getWeeklyPlan(weeklyPlanId)
        .then((weeklyPlan: WeeklyPlanDTO) => {
          this.events.publish(Event.SYSTEM.LOADING, false);
          return weeklyPlan;
        })
        .catch((error) => {
          this.events.publish(Event.SYSTEM.LOADING, false);
          this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
          return Promise.reject(error);
        })
  }

  public getWeeklyPlanByUserIdAndWeekNumber(userId: string, weekNumber: number): Promise<WeeklyPlanDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.getWeeklyPlanByUserIdAndWeekNumber(userId, weekNumber)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return weeklyPlan;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

  public createWeeklyPlan(weeklyPlan: WeeklyPlanDTO): Promise<WeeklyPlanDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.createWeeklyPlan(weeklyPlan)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return weeklyPlan;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

  public setMeals(weeklyPlanId: string, mealIds: string[]): Promise<WeeklyPlanDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.updateWeeklyPlanMealIds(weeklyPlanId, mealIds)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return weeklyPlan;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

}
