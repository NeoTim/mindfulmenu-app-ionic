import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Event } from '../common/Event';
import { IngredientDTO } from "../data/dto/menu/IngredientDTO";
import { IngredientService } from "../service/IngredientService";

@Injectable()
export class IngredientModel {

  constructor(private events: Events,
              private storage: Storage,
              private ingredientService: IngredientService) {

    this.setupListeners();
  }

  private setupListeners(): void {
      //
  }

  public getIngredient(ingredientId: string): Promise<IngredientDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.ingredientService.getIngredient(ingredientId)
      .then((ingredient: IngredientDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return ingredient;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

  public getIngredients(ingredientIds: string[]): Promise<IngredientDTO[]> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.ingredientService.getIngredients(ingredientIds)
      .then((ingredients: IngredientDTO[]) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return ingredients;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

  public createIngredient(ingredient: IngredientDTO): Promise<IngredientDTO> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.ingredientService.createIngredient(ingredient)
      .then((ingredient: IngredientDTO) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return ingredient;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      })
  }

  public deleteIngredient(ingredientId: string): Promise<void> {
    this.events.publish(Event.SYSTEM.LOADING, true);

    return this.ingredientService.deleteIngredient(ingredientId)
      .then(() => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        return;
      })
      .catch((error) => {
        this.events.publish(Event.SYSTEM.LOADING, false);
        this.events.publish(Event.SYSTEM.GENERAL_ERROR, error);
        return Promise.reject(error);
      });
  }

}
