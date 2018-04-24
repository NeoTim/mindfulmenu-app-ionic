import { IdentifiableDTO } from "../IdentifiableDTO";

export class MealDTO extends IdentifiableDTO {

  name: string;

  imageUrl: string;

  prepTime: number;

  cookTime: number;

  sourceName: string;

  sourceUrl: string;

  tip: string;

  cookInstructions: string[];

  prepInstructions: string[];

  ingredientIds: string[];

}
