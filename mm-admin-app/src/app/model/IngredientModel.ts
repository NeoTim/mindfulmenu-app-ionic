import { Injectable } from '@angular/core';
import { Event } from '../common/Event';
import { IngredientDTO } from '../data/dto/menu/IngredientDTO';
import { IngredientService } from '../service/IngredientService';
import { EventsService } from 'angular-event-service/dist';
import { AsyncLocalStorage } from 'angular-async-local-storage';

@Injectable()
export class IngredientModel {

  constructor(private eventsService: EventsService,
              private localStorage: AsyncLocalStorage,
              private ingredientService: IngredientService) {

    this.setupListeners();
  }

  private setupListeners(): void {
      //
  }

  public getIngredient(ingredientId: string): Promise<IngredientDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.ingredientService.getIngredient(ingredientId)
      .then((ingredient: IngredientDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return ingredient;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public getIngredients(ingredientIds: string[]): Promise<IngredientDTO[]> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.ingredientService.getIngredients(ingredientIds)
      .then((ingredients: IngredientDTO[]) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return ingredients;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public getAllIngredients(): Promise<IngredientDTO[]> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.ingredientService.getAllIngredients()
      .then((ingredients: IngredientDTO[]) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return ingredients;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public createIngredient(ingredient: IngredientDTO): Promise<IngredientDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.ingredientService.createIngredient(ingredient)
      .then((newIngredient: IngredientDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return newIngredient;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public updateIngredient(ingredient: IngredientDTO): Promise<IngredientDTO> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.ingredientService.updateIngredient(ingredient)
      .then((newIngredient: IngredientDTO) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        return newIngredient;
      })
      .catch((error) => {
        this.eventsService.broadcast(Event.SYSTEM.LOADING, false);
        this.eventsService.broadcast(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

  public deleteIngredient(ingredientId: string): Promise<void> {
    this.eventsService.broadcast(Event.SYSTEM.LOADING, true);

    return this.ingredientService.deleteIngredient(ingredientId)
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
