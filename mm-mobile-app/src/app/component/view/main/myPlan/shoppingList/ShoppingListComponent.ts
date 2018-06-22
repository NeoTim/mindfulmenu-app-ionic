import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { MealModel } from "../../../../../model/MealModel";
import { UserModel } from "../../../../../model/UserModel";
import { UserDTO } from "../../../../../data/dto/user/UserDTO";
import { WeeklyPlanModel } from "../../../../../model/WeeklyPlanModel";
import { IngredientModel } from "../../../../../model/IngredientModel";
import { WeeklyPlanDTO } from "../../../../../data/dto/menu/WeeklyPlanDTO";
import { IngredientDTO } from "../../../../../data/dto/menu/IngredientDTO";
import { MealDTO } from "../../../../../data/dto/menu/MealDTO";
import * as _ from "lodash";
import { ShoppingList } from "../../../../../data/local/shoppingList/ShoppingList";
import { ShoppingListCategory } from "../../../../../data/local/shoppingList/ShoppingListCategory";
import { ShoppingListItem } from "../../../../../data/local/shoppingList/ShoppingListItem";
import { IngredientCategory } from "../../../../../data/enum/menu/IngredientCategory";
import { ApplicationModel } from "../../../../../model/ApplicationModel";
import { ViewUtil } from "../../../../../util/ViewUtil";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'shopping-list',
  templateUrl: 'ShoppingListComponent.html',
  animations: [
    trigger('toggle', [
      transition(':enter', [
        style({ height: 0 }),
        animate('350ms ease-out', style({ height: '*' }))
      ]),
      transition(':leave', [
        animate('350ms ease-in', style({ height: 0 }))
      ])
    ])
  ]
})
export class ShoppingListComponent {

  weeklyPlanId: string;

  weeklyPlan: WeeklyPlanDTO;
  shoppingList: ShoppingList;

  // keep them, so that the model can be recreated from them, when needed. mealIngredients, once loaded, won't change. customIngredients might
  mealIngredients: IngredientDTO[];
  customIngredients: IngredientDTO[];

  public currentUser: UserDTO;

  public IngredientCategory: any = IngredientCategory;

  private categories: IngredientCategory[] = [
    IngredientCategory.PRODUCE,
    IngredientCategory.MEAT_SEAFOOD,
    IngredientCategory.EGGS_DAIRY,
    IngredientCategory.FROZEN,
    IngredientCategory.BAKING_CONDIMENTS,
    IngredientCategory.DRY_CANNED,
    IngredientCategory.SPICES,
    IngredientCategory.OTHER
  ];

  public showEmptyCategories: boolean = false;

  private toggleCheckedInProgress: boolean = false;
  private toggleCheckedQueueRunning: boolean = false;
  private toggleCheckedQueue: ShoppingListItem[] = [];
  private toggleCheckedQueueLastWeeklyPlan: WeeklyPlanDTO;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public viewUtil: ViewUtil,
              public applicationModel: ApplicationModel,
              public weeklyPlanModel: WeeklyPlanModel,
              public mealModel: MealModel,
              public ingredientModel: IngredientModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
    this.weeklyPlanId = this.navParams.data.weeklyPlanId;
  }

  ionViewDidLoad() {
    this.init();
  }

  init() {
    this.getWeeklyPlan()
      .then((weeklyPlan: WeeklyPlanDTO) => {
        return this.getMeals(weeklyPlan);
      })
      .then((meals: MealDTO[]) => {
        // we can load these together, firestore should combine the request
        return new Promise((resolve, reject) => {
          this.getMealIngredients(meals)
            .then((ingredients: IngredientDTO[]) => {
              if (this.mealIngredients && this.customIngredients) {
                let allIngredients: IngredientDTO[] = this.mealIngredients.concat(this.customIngredients);
                resolve(allIngredients);
              }
            })
            .catch((error) => {
              reject(error);
            });

          this.getCustomIngredients()
            .then((ingredients: IngredientDTO[]) => {
              if (this.mealIngredients && this.customIngredients) {
                let allIngredients: IngredientDTO[] = this.mealIngredients.concat(this.customIngredients);
                resolve(allIngredients);
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
      })
      .then((allIngredients: IngredientDTO[]) => {
        // build initial model
        this.buildModel(allIngredients);
        // sync weeklyPlan.checkedIngredientIds with model
        this.dtoToModel();
      })
      .catch((error) => {})
  }

  getWeeklyPlan(): Promise<WeeklyPlanDTO> {
    return this.weeklyPlanModel.getWeeklyPlan(this.weeklyPlanId)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlan = weeklyPlan;

        return weeklyPlan;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  getMeals(weeklyPlan: WeeklyPlanDTO): Promise<MealDTO[]> {
    return this.mealModel.getMeals(weeklyPlan.mealIds)
      .then((meals: MealDTO[]) => {
        return meals;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  getMealIngredients(meals: MealDTO[]): Promise<IngredientDTO[]> {
    let ingredientIds: string[] = [];

    _.forEach(meals,(meal: MealDTO) => {
      ingredientIds = ingredientIds.concat(meal.ingredientIds);
    });

    return this.ingredientModel.getIngredients(ingredientIds)
      .then((ingredients: IngredientDTO[]) => {
        this.mealIngredients = ingredients;
        return ingredients;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  getCustomIngredients(): Promise<IngredientDTO[]> {
    return this.ingredientModel.getIngredients(this.weeklyPlan.customIngredientIds)
      .then((ingredients: IngredientDTO[]) => {
        this.customIngredients = ingredients;
        return ingredients;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  buildModel(ingredients: IngredientDTO[]) {
    let shoppingList: ShoppingList = new ShoppingList();
    shoppingList.categories = [];

    let ingredientCategories = _.groupBy(ingredients, 'category');

    _.forEach(this.categories, (categoryName: IngredientCategory) => {
      if (_.has(ingredientCategories, categoryName)) {
        let category: ShoppingListCategory = new ShoppingListCategory();
        category.name = categoryName;
        category.items = [];

        _.forEach(ingredientCategories[categoryName], (ingredient: IngredientDTO) => {
          let item: ShoppingListItem = new ShoppingListItem();
          item.checked = false;
          item.ingredient = _.cloneDeep(ingredient);
          item.identicalItems = [];
          item.expanded = false;

          // lots of additional spaces shows up here during editing, I'm removing them from display
          // ideally, of course, they should not be there in the first place
          item.ingredient.item = _.trim(item.ingredient.item);
          item.ingredient.amount = _.trim(item.ingredient.amount);

          category.items.push(item);
        });

        category.items = _.sortBy(category.items, (item: ShoppingListItem) => {
          return item.ingredient.item.toLowerCase();
        });

        shoppingList.categories.push(category);
      }
      else {
        let category: ShoppingListCategory = new ShoppingListCategory();
        category.name = categoryName;
        category.items = [];

        shoppingList.categories.push(category);
      }
    });

    // filter out duplicates and hide them "under" first item of those with duplicated name

    _.forEach(shoppingList.categories, (category: ShoppingListCategory) => {
      let newItemList: ShoppingListItem[] = [];

      let itemsGroupedByName: { [key: string]: ShoppingListItem[] } = _.groupBy(category.items, (item: ShoppingListItem) => {
        return item.ingredient.item.toLowerCase();
      });

      _.forEach(itemsGroupedByName, (value: ShoppingListItem[], index: string) => {
        // let's sort them by id, to always have a predictable order (_.groupBy results could be randomly ordered)
        value = _.sortBy(value, ['ingredient.id']);

        let firstItem: ShoppingListItem = value[0]; // guaranteed to be there, as a result of _.groupBy function
        newItemList.push(firstItem);

        if (value.length > 1) {
          // add the rest as identical items under first item
          firstItem.identicalItems = _.slice(value, 1, value.length);
        }
      });

      category.items = newItemList;

      // let's sort by name again (before this transformation, in 190), to always have predictable order
      // probably not needed, but just to be sure
      category.items = _.sortBy(category.items, (item: ShoppingListItem) => {
        return item.ingredient.item.toLowerCase();
      });
    });

    // copy the "expanded" state from previous model, if there was any

    if (this.shoppingList) {
      _.forEach(this.shoppingList.categories, (category: ShoppingListCategory, index: any) => {
        _.forEach(category.items, (item: ShoppingListItem) => {
          if (item.expanded) {
            let foundItem: ShoppingListItem = _.find(shoppingList.categories[index].items, ['ingredient.id', item.ingredient.id]);
            if (foundItem) {
              foundItem.expanded = true;
            }
          }
        });
      });
    }

    this.shoppingList = shoppingList;
  }

  dtoToModel() {
    _.forEach(this.shoppingList.categories, (category: ShoppingListCategory) => {
      _.forEach(category.items, (item: ShoppingListItem) => {
        if (_.includes(this.weeklyPlan.checkedIngredientIds, item.ingredient.id)) {
          item.checked = true;
        }
        else {
          item.checked = false;
        }

        _.forEach(item.identicalItems, (identicalItem: ShoppingListItem) => {
          if (_.includes(this.weeklyPlan.checkedIngredientIds, identicalItem.ingredient.id)) {
            identicalItem.checked = true;
          }
          else {
            identicalItem.checked = false;
          }
        });
      })
    });
  }

  // not used for now
  modelToDto() {
    let checkedIngredientIds: string[] = [];

    _.forEach(this.shoppingList.categories, (category: ShoppingListCategory) => {
      _.forEach(category.items, (item: ShoppingListItem) => {
        if (item.checked) {
          checkedIngredientIds.push(item.ingredient.id);
        }

        _.forEach(item.identicalItems, (identicalItem: ShoppingListItem) => {
          if (identicalItem.checked) {
            checkedIngredientIds.push(identicalItem.ingredient.id);
          }
        })
      })
    });

    this.weeklyPlan.checkedIngredientIds = checkedIngredientIds;
  }


  // queue all the check "actions" and execute them one by one, initializing a query that would tick every 100ms and
  // check if there's something to process. If not, shutdown.
  onShoppingListItemChecked(item: ShoppingListItem, value: boolean) {
    // item is just a reference for queue purpose. We don't want the connection to the ShoppingList.
    this.toggleCheckedQueue.push(_.cloneDeep(item));

    _.forEach(item.identicalItems, (identicalItem: ShoppingListItem) => {
      if (value) {
        identicalItem.checked = true;
      }
      else {
        identicalItem.checked = false;
      }

      this.toggleCheckedQueue.push(_.cloneDeep(identicalItem));
    });

    if (!this.toggleCheckedQueueRunning) {
      this.toggleCheckedQueueRunning = true;

      // for the purpose of chained actions, we store a reference to a "recently obtained from the call result" weekly plan
      // initializing it with the current object
      this.toggleCheckedQueueLastWeeklyPlan = this.weeklyPlan;

      let intervalId = setInterval(() => {
        if (this.toggleCheckedQueue.length > 0) {
          this.processToggleCheckedQueue();
        }
        else {
          clearInterval(intervalId);
          intervalId = null;
          this.toggleCheckedQueueRunning = false;
        }
      }, 100);
    }
  }

  processToggleCheckedQueue() {
    if (!this.toggleCheckedInProgress) {
      this.toggleCheckedInProgress = true;

      const item: ShoppingListItem = this.toggleCheckedQueue.shift();

      this.applicationModel.suppressLoading = true;

      // we want to perform operations on the toggleCheckedQueueLastWeeklyPlan, because this reference will have the updated fields
      // (as a result of recent calls), while the current weeklyPlan, will not, until we finally update it
      this.weeklyPlanModel.toggleIngredientCheck(this.toggleCheckedQueueLastWeeklyPlan, item.ingredient.id, item.checked)
        .then((weeklyPlan: WeeklyPlanDTO) => {
          this.applicationModel.suppressLoading = false;
          this.toggleCheckedInProgress = false;

          this.toggleCheckedQueueLastWeeklyPlan = weeklyPlan;

          // If this is the last call, then update the model with whatever recent weeklyPlan state we have
          // it could be not from this call, if this call failed (it does the same thing in catch() below).
          // Only now sync the model. The expected recent WeeklyPlan and its state should be exactly the same as current local ShoppingList model
          // so syncing it should yield no visual changes (things that were checked, will be checked again, things that weren't checked, remain unchecked)
          // but if there were errors, the model after sync will reflect the actual server state
          if (this.toggleCheckedQueue.length === 0) {
            this.weeklyPlan = this.toggleCheckedQueueLastWeeklyPlan;
            this.toggleCheckedQueueLastWeeklyPlan = null;
            this.dtoToModel();
          }
        })
        .catch((error) => {
          this.applicationModel.suppressLoading = false;
          this.toggleCheckedInProgress = false;

          // see above
          if (this.toggleCheckedQueue.length === 0) {
            this.weeklyPlan = this.toggleCheckedQueueLastWeeklyPlan;
            this.toggleCheckedQueueLastWeeklyPlan = null;
            this.dtoToModel();
          }

          return Promise.reject(error);
        });
    }
  }

  toggleItem(item: ShoppingListItem) {
    item.expanded = !item.expanded;
  }

  addItemToCategory(category: ShoppingListCategory) {
    this.viewUtil.showValuePrompt('Add Item', 'Please enter the name of the new item.')
      .then((data: any) => {
        let ingredient: IngredientDTO = new IngredientDTO();
        ingredient.isCustomItem = true;
        ingredient.weeklyPlanId = this.weeklyPlan.id;
        ingredient.category = IngredientCategory[category.name];
        ingredient.item = data;

        return this.ingredientModel.createIngredient(ingredient);
      })
      .then((ingredient: IngredientDTO) => {
        return this.weeklyPlanModel.addCustomIngredientToWeeklyPlan(this.weeklyPlan, ingredient.id);
      })
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlan = weeklyPlan;

        // We've added an ingredient to DB and then assigned it to weekly plan
        // weekly plan customIngredientIds is updated and we have the newly created Ingredient.
        // At this stage, we could manipulate model (ShoppingList) directly (using that new Ingredient), so that we would "fake" sync with the server
        // or we could add that new Ingredient to customIngredients and sync the model.
        // But I want to avoid managing local data and exposing the app to potential corner-case errors (i.e. with order in display, most probably),
        // so I'm just reloading custom ingredients and building model from scratch.
        // Less code, less potential for errors. But - yes - that is one additional, potentially "unnecessary", call.
        return this.getCustomIngredients();
      })
      .then((customIngredients: IngredientDTO[]) => {
        let allIngredients: IngredientDTO[] = this.mealIngredients.concat(this.customIngredients);
        this.buildModel(allIngredients);
        this.dtoToModel();
      })
      .catch((error) => {});
  }

  removeItemFromCategory(item: ShoppingListItem, category: ShoppingListCategory) {
    this.ingredientModel.deleteIngredient(item.ingredient.id)
      .then((data: any) => {
        return this.weeklyPlanModel.removeCustomIngredientFromWeeklyPlan(this.weeklyPlan, item.ingredient.id);
      })
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlan = weeklyPlan;
        // we also need to remove it from checkedIngredientIds
        return this.weeklyPlanModel.toggleIngredientCheck(this.weeklyPlan, item.ingredient.id, false);
      })
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlan = weeklyPlan;

        // see the note in addItemToCategory above
        return this.getCustomIngredients();
      })
      .then((customIngredients: IngredientDTO[]) => {
        let allIngredients: IngredientDTO[] = this.mealIngredients.concat(this.customIngredients);
        this.buildModel(allIngredients);
        this.dtoToModel();
      })
      .catch((error) => {});
  }

  toggleEmptyCategories() {
    this.showEmptyCategories = !this.showEmptyCategories;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}


