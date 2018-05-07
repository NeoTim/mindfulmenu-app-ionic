import { IdentifiableDTO } from '../IdentifiableDTO';

export class IngredientDTO extends IdentifiableDTO {

  /**
   * Ingredients will either have a mealId OR and userId and weekNumber.
   */
  mealId: string;

  userId: string;

  weekNumber: string;
  
  amount: number;

  unit: string;

  item: string;

  category: string;

}
