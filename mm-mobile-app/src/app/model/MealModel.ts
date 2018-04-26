import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Event } from '../common/Event';
import { MealService } from "../service/MealService";
import { MealDTO } from "../data/dto/menu/MealDTO";

@Injectable()
export class MealModel {

  constructor(private events: Events,
              private storage: Storage,
              private mealService: MealService) {

    this.setupListeners();
  }

  private setupListeners(): void {
      //
  }

  public getMeal(mealId: string): Promise<MealDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.mealService.getMeal(mealId)
      .then((meal: MealDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return meal;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

  public getMeals(mealIds: string[]): Promise<MealDTO[]> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.mealService.getMeals(mealIds)
      .then((meals: MealDTO[]) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return meals;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

}
