import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Event } from '../common/Event';
import { Moment } from "moment";
import { WeeklyPlanService } from "../service/WeeklyPlanService";
import { WeeklyPlanDTO } from "../data/dto/menu/WeeklyPlanDTO";
import { DateUtil } from "../util/DateUtil";
import * as _ from "lodash";

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

      /* always create a new plan for current week, if there isn't one yet */
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

  public setMealsForWeeklyPlan(weeklyPlan: WeeklyPlanDTO, mealIds: string[]): Promise<WeeklyPlanDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.updateWeeklyPlanMealIds(weeklyPlan.id, mealIds)
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

  public addMealToWeeklyPlan(weeklyPlan: WeeklyPlanDTO, mealId: string): Promise<WeeklyPlanDTO> {
    let mealIds: string[] = _.cloneDeep(weeklyPlan.mealIds);

    mealIds.push(mealId);

    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.updateWeeklyPlanMealIds(weeklyPlan.id, mealIds)
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

  public removeMealFromWeeklyPlan(weeklyPlan: WeeklyPlanDTO, mealId: string): Promise<WeeklyPlanDTO> {
    let mealIds: string[] = _.cloneDeep(weeklyPlan.mealIds);

    _.remove(mealIds, (id: string) => {
      return (id === mealId);
    });

    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.updateWeeklyPlanMealIds(weeklyPlan.id, mealIds)
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

  public addCustomIngredientToWeeklyPlan(weeklyPlan: WeeklyPlanDTO, ingredientId: string): Promise<WeeklyPlanDTO> {
    let customIngredientIds: string[] = _.cloneDeep(weeklyPlan.customIngredientIds);

    customIngredientIds.push(ingredientId);

    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.updateWeeklyPlanCustomIngredientIds(weeklyPlan.id, customIngredientIds)
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

  public removeCustomIngredientFromWeeklyPlan(weeklyPlan: WeeklyPlanDTO, ingredientId: string): Promise<WeeklyPlanDTO> {
    let customIngredientIds: string[] = _.cloneDeep(weeklyPlan.customIngredientIds);

    _.remove(customIngredientIds, (id: string) => {
      return (id === ingredientId);
    });

    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.updateWeeklyPlanCustomIngredientIds(weeklyPlan.id, customIngredientIds)
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

  public toggleIngredientCheck(weeklyPlan: WeeklyPlanDTO, ingredientId: string, checked: boolean): Promise<WeeklyPlanDTO> {
    let checkedIngredientIds: string[] = _.cloneDeep(weeklyPlan.checkedIngredientIds);

    if (checked) {
      checkedIngredientIds.push(ingredientId);
    }
    else {
      _.remove(checkedIngredientIds, (id: string) => {
        return (id === ingredientId);
      });
    }

    // if there was no ingredientId in weeklyPlan.checkedIngredientIds and nothing was actually removed, don't make the call
    if (_.isEqual(checkedIngredientIds, weeklyPlan.checkedIngredientIds)) {
      return Promise.resolve(weeklyPlan);
    }
    else {
      this.events.publish(Event.SYSTEM.LOADING, true);

      return this.weeklyPlanService.updateWeeklyPlanCheckedIngredientIds(weeklyPlan.id, checkedIngredientIds)
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

  public emailPlan(weeklyPlan: WeeklyPlanDTO, userId: string): Promise<void> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.weeklyPlanService.emailPlan(weeklyPlan.id, userId)
      .then(() => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

}
