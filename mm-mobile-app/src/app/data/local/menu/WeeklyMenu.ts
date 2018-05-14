import { MealDTO } from '../../dto/menu/MealDTO';
import { WeeklyMenuDTO } from '../../dto/menu/WeeklyMenuDTO';
import * as _ from 'lodash';

export class WeeklyMenu {

  id: string;

  weekNumber: number;

  startDate: Date;

  endDate: Date;

  publishDate: Date;

  meals: MealDTO[];

  imageUrl: string;

  // --

  public static fromDTO(dto: WeeklyMenuDTO): WeeklyMenu {
    let weeklyMenu = new WeeklyMenu();

    const copiedProperties: string[] = ['id', 'weekNumber', 'startDate', 'endDate', 'publishDate', 'imageUrl'];

    for (let copiedProperty of copiedProperties) {
      if (_.has(dto, copiedProperty)) {
        weeklyMenu[copiedProperty] = _.cloneDeep(dto[copiedProperty]);
      }
    }

    return weeklyMenu;
  }

  public static toDTO(weeklyMenu: WeeklyMenu): WeeklyMenuDTO {
    let dto = new WeeklyMenuDTO();

    const copiedProperties: string[] = ['id', 'weekNumber', 'startDate', 'endDate', 'publishDate', 'imageUrl'];

    for (let copiedProperty of copiedProperties) {
      if (_.has(weeklyMenu, copiedProperty)) {
        dto[copiedProperty] = _.cloneDeep(weeklyMenu[copiedProperty]);
      }
    }

    if (weeklyMenu.meals && _.isArray(weeklyMenu.meals)) {
      dto.mealIds = [];

      if (weeklyMenu.meals.length > 0) {
        for (let meal of weeklyMenu.meals) {
          if (meal && meal.id) {
            dto.mealIds.push(meal.id);
          }
        }
      }
    }

    return dto;
  }

}
