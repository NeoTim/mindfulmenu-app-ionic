import { IdentifiableDTO } from "../IdentifiableDTO";
import { CustomShoppingItemDTO } from "./CustomShoppingItemDTO";

export class WeeklyPlanDTO extends IdentifiableDTO {

  userId: string;

  weekNumber: number;

  mealIds: string[];

  customShoppingItems: CustomShoppingItemDTO[];

  checkedIngredientIds: string[];

}



