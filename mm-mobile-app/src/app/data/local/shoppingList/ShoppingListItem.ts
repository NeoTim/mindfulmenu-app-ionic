import { IngredientDTO } from '../../dto/menu/IngredientDTO';

export class ShoppingListItem {

  ingredient: IngredientDTO;

  checked: boolean;

  identicalItems: ShoppingListItem[];

  expanded: boolean;

}
