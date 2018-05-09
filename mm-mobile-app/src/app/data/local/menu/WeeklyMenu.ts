import { MealDTO } from '../../dto/menu/MealDTO';
import { WeeklyMenuDTO } from '../../dto/menu/WeeklyMenuDTO';

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

    weeklyMenu.id = dto.id;
    weeklyMenu.weekNumber = dto.weekNumber;
    if (dto.startDate) {
      weeklyMenu.startDate = new Date(dto.startDate.getTime());
    }
    if (dto.endDate) {
      weeklyMenu.endDate = new Date(dto.endDate.getTime());
    }
    if (dto.publishDate) {
      weeklyMenu.publishDate = new Date(dto.publishDate.getTime());
    }
    weeklyMenu.imageUrl = dto.imageUrl;

    return weeklyMenu;
  }

  public static toDTO(weeklyMenu: WeeklyMenu): WeeklyMenuDTO {
    let dto = new WeeklyMenuDTO();

    dto.id = weeklyMenu.id;
    dto.weekNumber = weeklyMenu.weekNumber;
    if (weeklyMenu.startDate) {
      dto.startDate = new Date(weeklyMenu.startDate.getTime());
    }
    if (weeklyMenu.endDate) {
      dto.endDate = new Date(weeklyMenu.endDate.getTime());
    }
    if (weeklyMenu.publishDate) {
      dto.publishDate = new Date(weeklyMenu.publishDate.getTime());
    }
    dto.imageUrl = weeklyMenu.imageUrl;

    if (weeklyMenu.meals && (weeklyMenu.meals.length > 0)) {
      dto.mealIds = [];

      for (let meal of weeklyMenu.meals) {
        if (meal && meal.id) {
          dto.mealIds.push(meal.id);
        }
      }
    }

    return dto;
  }

}
