import { IdentifiableDTO } from "../IdentifiableDTO";
import { IngredientCategory } from "../../enum/menu/IngredientCategory";

export class IngredientDTO extends IdentifiableDTO {

  /**
   * Ingredients will either have a mealId OR weeklyPlanId (if isCustomItem = true).
   */

  mealId: string;

  weeklyPlanId: string;

  isCustomItem: boolean;

  amount: string;

  item: string;

  category: IngredientCategory;

  note: string;

}
