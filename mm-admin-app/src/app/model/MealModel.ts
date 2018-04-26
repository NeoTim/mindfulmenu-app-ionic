import { Injectable } from '@angular/core';
import { Event } from '../common/Event';
import { MealService } from '../service/MealService';
import { MealDTO } from '../data/dto/menu/MealDTO';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { EventsService } from 'angular-event-service/dist';

@Injectable()
export class MealModel {

  constructor(private eventsService: EventsService,
              private localStorage: AsyncLocalStorage,
              private mealService: MealService) {

    this.setupListeners();
  }

  private setupListeners(): void {
      //
  }

  public getMeal(mealId: string): Promise<MealDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.mealService.getMeal(mealId)
      .then((meal: MealDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return meal;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public getMeals(mealIds: string[]): Promise<MealDTO[]> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.mealService.getMeals(mealIds)
      .then((meals: MealDTO[]) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return meals;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public getAllMeals(): Promise<MealDTO[]> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.mealService.getAllMeals()
      .then((meals: MealDTO[]) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return meals;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public createMeal(meal: MealDTO): Promise<MealDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.mealService.createMeal(meal)
      .then((newMeal: MealDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return newMeal;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public deleteMeal(mealId: string): Promise<void> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.mealService.deleteMeal(mealId)
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
