import { MealDTO } from '../../dto/menu/MealDTO';
import { IngredientDTO } from "../../dto/menu/IngredientDTO";
import { WeeklyPlanDTO } from "../../dto/menu/WeeklyPlanDTO";
import * as moment from 'moment';

export class WeeklyPlan {

  id: string;

  userId: string;

  weekNumber: number;

  meals: MealDTO[];

  customIngredients: IngredientDTO[];

  checkedIngredientIds: string[];

  // --

  get startDate(): Date {
    return moment(this.weekNumber.toString(), 'YYYYMMDD').toDate();
  }

  get endDate(): Date {
    return moment(this.weekNumber.toString(), 'YYYYMMDD').add(6, 'day').toDate();
  }

  // --

  public static fromDTO(dto: WeeklyPlanDTO): WeeklyPlan {
    let weeklyPlan = new WeeklyPlan();

    weeklyPlan.id = dto.id;
    weeklyPlan.userId = dto.userId;
    weeklyPlan.weekNumber = dto.weekNumber;
    weeklyPlan.checkedIngredientIds = dto.checkedIngredientIds;

    return weeklyPlan;
  }

  public static toDTO(weeklyPlan: WeeklyPlan): WeeklyPlanDTO {
    let dto = new WeeklyPlanDTO();

    dto.id = weeklyPlan.id;
    dto.userId = weeklyPlan.userId;
    dto.weekNumber = weeklyPlan.weekNumber;
    dto.checkedIngredientIds = weeklyPlan.checkedIngredientIds;

    if (weeklyPlan.meals && (weeklyPlan.meals.length > 0)) {
      dto.mealIds = [];

      for (let meal of weeklyPlan.meals) {
        if (meal && meal.id) {
          dto.mealIds.push(meal.id);
        }
      }
    }

    if (weeklyPlan.customIngredients && (weeklyPlan.customIngredients.length > 0)) {
      dto.customIngredientIds = [];

      for (let ingredient of weeklyPlan.customIngredients) {
        if (ingredient && ingredient.id) {
          dto.customIngredientIds.push(ingredient.id);
        }
      }
    }

    return dto;
  }

}
