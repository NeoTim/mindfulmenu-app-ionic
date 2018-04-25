import { CustomShoppingItemDTO } from "./CustomShoppingItemDTO";

export class WeeklyPlanDTO {
    weekNumber: number;
    mealIds: string[];
    customShoppingItems: CustomShoppingItemDTO[];
    checkedIngredientIds: string[];

    constructor() {

    }
}