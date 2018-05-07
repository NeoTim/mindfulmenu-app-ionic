import { IdentifiableDTO } from '../IdentifiableDTO';

export class WeeklyPlanDTO extends IdentifiableDTO {

  userId: string;

  weekNumber: number;

  mealIds: string[];

  customIngredientIds: string[];

  checkedIngredientIds: string[];

}



