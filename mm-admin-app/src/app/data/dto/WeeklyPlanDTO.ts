import { CustomShoppingItemDTO } from "./CustomShoppingItemDTO";

export class WeeklyPlanDTO {
    userId: string;
    weekNumber: number;
    mealIds: string[];
    customShoppingItems: CustomShoppingItemDTO[];
    checkedIngredientIds: string[];

    constructor() {

    }
}