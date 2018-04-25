import { IngredientDTO } from './IngredientDTO'

export class MealDTO {
    id?: string;
    name: string;
    imageUrl?: string;
    prepTime: number;
    cookTime: number;
    sourceName?: string;
    sourceUrl?: string;
    tip?: string;
    cookInstructions?: Array<string>;
    prepInstructions?: Array<string>;
    ingredients?: Array<IngredientDTO>;

    constructor() {
    }
}