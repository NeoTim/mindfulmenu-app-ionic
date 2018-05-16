import { ShoppingListItem } from "./ShoppingListItem";

export class ShoppingListCategory {

  name: string;

  items: ShoppingListItem[];

  get isEmpty(): boolean {
    if (this.items.length === 0) {
      return true;
    }
    else {
      return false;
    }
  }

}
