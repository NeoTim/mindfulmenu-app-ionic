import { MealDTO } from '../../dto/menu/MealDTO';
import { WeeklyMenuDTO } from '../../dto/menu/WeeklyMenuDTO';

export class WeeklyMenu {

  id: string;

  weekNumber: number;

  startDate: Date;

  endDate: Date;

  publishDate: Date;

  meals: MealDTO[];

  // --

  public static fromDTO(dto: WeeklyMenuDTO): WeeklyMenu {
    let weeklyMenu = new WeeklyMenu();

    weeklyMenu.id = dto.id;
    weeklyMenu.weekNumber = dto.weekNumber;
    weeklyMenu.startDate = new Date(dto.startDate.getTime());
    weeklyMenu.endDate = new Date(dto.endDate.getTime());
    weeklyMenu.publishDate = new Date(dto.publishDate.getTime());

    return weeklyMenu;
  }

  public static toDTO(weeklyMenu: WeeklyMenu): WeeklyMenuDTO {
    let dto = new WeeklyMenuDTO();

    dto.id = weeklyMenu.id;
    dto.weekNumber = weeklyMenu.weekNumber;
    dto.startDate = new Date(weeklyMenu.startDate.getTime());
    dto.endDate = new Date(weeklyMenu.endDate.getTime());
    dto.publishDate = new Date(weeklyMenu.publishDate.getTime());

    if (weeklyMenu.meals && (weeklyMenu.meals.length > 0)) {
      dto.mealIds = [];
      for (let meal of weeklyMenu.meals) {
        dto.mealIds.push(meal.id);
      }
    }

    return dto;
  }

}
