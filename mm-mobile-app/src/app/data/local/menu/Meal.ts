import { IngredientDTO } from '../../dto/menu/IngredientDTO';
import { MealDTO } from '../../dto/menu/MealDTO';
import * as _ from 'lodash';

export class Meal {

  id: string;

  name: string;

  imageUrl: string;

  prepTime: number;

  cookTime: number;

  sourceName: string;

  sourceUrl: string;

  tip: string;

  cookInstructions: string[];

  prepInstructions: string[];

  ingredients: IngredientDTO[];

  // --

  public static fromDTO(dto: MealDTO): Meal {
    let meal = new Meal();

    const copiedProperties: string[] = ['id', 'name', 'imageUrl', 'prepTime', 'cookTime', 'sourceName', 'sourceUrl', 'tip', 'cookInstructions', 'prepInstructions'];

    for (let copiedProperty of copiedProperties) {
      if (_.has(dto, copiedProperty)) {
        meal[copiedProperty] = _.cloneDeep(dto[copiedProperty]);
      }
    }

    return meal;
  }

  public static toDTO(meal: Meal): MealDTO {
    let dto = new MealDTO();

    const copiedProperties: string[] = ['id', 'name', 'imageUrl', 'prepTime', 'cookTime', 'sourceName', 'sourceUrl', 'tip', 'cookInstructions', 'prepInstructions'];

    for (let copiedProperty of copiedProperties) {
      if (_.has(meal, copiedProperty)) {
        dto[copiedProperty] = _.cloneDeep(meal[copiedProperty]);
      }
    }

    if (meal.ingredients) {
      if (meal.ingredients.length === 0) {
        dto.ingredientIds = [];
      }
      else {
        for (let ingredient of meal.ingredients) {
          if (ingredient && ingredient.id) {
            dto.ingredientIds.push(ingredient.id);
          }
        }
      }
    }

    return dto;
  }

}
