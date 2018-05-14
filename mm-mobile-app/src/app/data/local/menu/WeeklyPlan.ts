import { MealDTO } from '../../dto/menu/MealDTO';
import { IngredientDTO } from "../../dto/menu/IngredientDTO";
import { WeeklyPlanDTO } from "../../dto/menu/WeeklyPlanDTO";
import * as moment from 'moment';
import * as _ from 'lodash';

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

    const copiedProperties: string[] = ['id', 'userId', 'weekNumber', 'checkedIngredientIds'];

    for (let copiedProperty of copiedProperties) {
      if (_.has(dto, copiedProperty)) {
        weeklyPlan[copiedProperty] = _.cloneDeep(dto[copiedProperty]);
      }
    }

    return weeklyPlan;
  }

  public static toDTO(weeklyPlan: WeeklyPlan): WeeklyPlanDTO {
    let dto = new WeeklyPlanDTO();

    const copiedProperties: string[] = ['id', 'userId', 'weekNumber', 'checkedIngredientIds'];

    for (let copiedProperty of copiedProperties) {
      if (_.has(weeklyPlan, copiedProperty)) {
        dto[copiedProperty] = _.cloneDeep(weeklyPlan[copiedProperty]);
      }
    }

    if (weeklyPlan.meals && _.isArray(weeklyPlan.meals)) {
      dto.mealIds = [];

      if (weeklyPlan.meals.length > 0) {
        for (let meal of weeklyPlan.meals) {
          if (meal && meal.id) {
            dto.mealIds.push(meal.id);
          }
        }
      }
    }

    if (weeklyPlan.customIngredients && _.isArray(weeklyPlan.customIngredients)) {
      dto.customIngredientIds = [];

      if (weeklyPlan.customIngredients.length > 0) {
        for (let customIngredient of weeklyPlan.customIngredients) {
          if (customIngredient && customIngredient.id) {
            dto.customIngredientIds.push(customIngredient.id);
          }
        }
      }
    }

    return dto;
  }

}
