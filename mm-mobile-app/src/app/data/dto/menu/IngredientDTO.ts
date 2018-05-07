import { IdentifiableDTO } from "../IdentifiableDTO";

export class IngredientDTO extends IdentifiableDTO {

  mealId: string;

  userId: string;

  weekNumber: string;
  
  amount: number;

  unit: string;

  item: string;

  category: string;

}
