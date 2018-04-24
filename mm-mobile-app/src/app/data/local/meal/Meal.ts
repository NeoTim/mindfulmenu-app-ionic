import { IngredientDTO } from "../../dto/ingredient/IngredientDTO";
import { MealDTO } from "../../dto/meal/MealDTO";
import * as _ from "lodash";

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

    meal.id = dto.id;
    meal.name = dto.name;
    meal.imageUrl = dto.imageUrl;
    meal.prepTime = dto.prepTime;
    meal.cookTime = dto.cookTime;
    meal.sourceName = dto.sourceName;
    meal.sourceUrl = dto.sourceUrl;
    meal.tip = dto.tip;
    meal.cookInstructions = _.cloneDeep(dto.cookInstructions);
    meal.prepInstructions = _.cloneDeep(dto.prepInstructions);

    return meal;
  }

  public static toDTO(meal: Meal): MealDTO {
    let dto = new MealDTO();

    dto.id = meal.id;
    dto.name = meal.name;
    dto.imageUrl = meal.imageUrl;
    dto.prepTime = meal.prepTime;
    dto.cookTime = meal.cookTime;
    dto.sourceName = meal.sourceName;
    dto.sourceUrl = meal.sourceUrl;
    dto.tip = meal.tip;
    dto.cookInstructions = _.cloneDeep(meal.cookInstructions);
    dto.prepInstructions = _.cloneDeep(meal.prepInstructions);

    if (meal.ingredients && (meal.ingredients.length > 0)) {
      dto.ingredientIds = [];
      for (let ingredient of meal.ingredients) {
        dto.ingredientIds.push(ingredient.id);
      }
    }

    return dto;
  }

}
