import { ShoppingListCategory } from "./ShoppingListCategory";
import { ShoppingListItem } from "./ShoppingListItem";
import * as _ from "lodash";

export class ShoppingList {

  categories: ShoppingListCategory[];

  get total(): number {
    let total: number = 0;

    _.forEach(this.categories, (category: ShoppingListCategory) => {
      total = total + category.items.length;
    });

    return total;
  }

  get totalChecked(): number {
    let totalChecked: number = 0;

    _.forEach(this.categories, (category: ShoppingListCategory) => {
      _.forEach(category.items, (item: ShoppingListItem) => {
        if (item.checked) {
          totalChecked++;
        }
      })
    });

    return totalChecked;
  }

  get hasEmptyCategories(): boolean {
    let empty: boolean = false;

    _.forEach(this.categories, (category: ShoppingListCategory) => {
      if (category.isEmpty) {
        empty = true;
        return false; // escape lodash's forEach
      }
    });

    return empty;
  }
}
