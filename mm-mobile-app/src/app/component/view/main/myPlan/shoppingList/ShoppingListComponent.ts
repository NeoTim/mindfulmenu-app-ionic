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

@Component({
  selector: 'shopping-list',
  templateUrl: 'ShoppingListComponent.html'
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
          item.ingredient = ingredient;

          category.items.push(item);
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
      })
    });

    this.weeklyPlan.checkedIngredientIds = checkedIngredientIds;
  }


  // queue all the check "actions" and execute them one by one, initializing a query that would tick every 100ms and
  // check if there's something to process. If not, shutdown.
  onShoppingListItemChecked(item: ShoppingListItem, value: boolean) {
    // item is just a reference for queue purpose. We don't want the connection to the ShoppingList.
    this.toggleCheckedQueue.push(_.cloneDeep(item));

    // immediately after checking, revert to previous state. The actual check state should come from the server.
    // this way we avoid displaying intermediate item states to the user
    // (no weird flickering of items that are going to be changed, but the actual change is further in the queue)
    setTimeout(() => {
      item.checked = !item.checked;
    });

    if (!this.toggleCheckedQueueRunning) {
      this.toggleCheckedQueueRunning = true;

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

      this.weeklyPlanModel.toggleIngredientCheck(this.weeklyPlan, item.ingredient.id, item.checked)
        .then((weeklyPlan: WeeklyPlanDTO) => {
          this.applicationModel.suppressLoading = false;

          this.weeklyPlan = weeklyPlan;
          // always sync model
          this.dtoToModel();

          this.toggleCheckedInProgress = false;
        })
        .catch((error) => {
          this.applicationModel.suppressLoading = false;

          this.toggleCheckedInProgress = false;
          return Promise.reject(error);
        });
    }
  }

  addItemToCategory(category: ShoppingListCategory) {
    this.viewUtil.showValuePrompt('Add Ingredient', 'Please enter the name of the new ingredient.')
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


