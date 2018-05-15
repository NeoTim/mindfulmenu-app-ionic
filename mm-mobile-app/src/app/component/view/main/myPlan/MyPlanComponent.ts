import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { MealModel } from "../../../../model/MealModel";
import { UserModel } from "../../../../model/UserModel";
import { UserDTO } from "../../../../data/dto/user/UserDTO";
import { WeeklyPlanDTO } from "../../../../data/dto/menu/WeeklyPlanDTO";
import { WeeklyPlanModel } from "../../../../model/WeeklyPlanModel";
import { WeeklyPlan } from "../../../../data/local/menu/WeeklyPlan";
import { MealDTO } from "../../../../data/dto/menu/MealDTO";
import { Moment } from "moment";
import { DateUtil } from "../../../../util/DateUtil";
import * as _ from "lodash";
import { WeeklyMenuDTO } from "../../../../data/dto/menu/WeeklyMenuDTO";
import { WeeklyMenuModel } from "../../../../model/WeeklyMenuModel";
import { IngredientModel } from "../../../../model/IngredientModel";
import { IngredientDTO } from "../../../../data/dto/menu/IngredientDTO";
import { PrepListComponent } from "./prepList/PrepListComponent";
import { ShoppingListComponent } from "./shoppingList/ShoppingListComponent";

@Component({
  selector: 'my-plan',
  templateUrl: 'MyPlanComponent.html'
})
export class MyPlanComponent {

  weeklyPlan: WeeklyPlan;
  currentWeekRelation: number = 0;

  favoriteMealsMap: { [key: string]: boolean } = {};

  public currentUser: UserDTO;

  public static readonly WEEK_RANGE: number = 6;
  public WEEK_RANGE: number = MyPlanComponent.WEEK_RANGE; /* exposed separately, just for template usage */

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public weeklyMenuModel: WeeklyMenuModel,
              public weeklyPlanModel: WeeklyPlanModel,
              public ingredientModel: IngredientModel,
              public mealModel: MealModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.currentUser = this.userModel.currentUser;
    this.init();
  }

  init() {
    this.getWeeklyPlan(this.currentWeekRelation);
  }

  getWeeklyPlan(weekRelation: number) {
    if (weekRelation === 0) {
      this.weeklyPlanModel.getCurrentWeeklyPlan(this.currentUser.id)
        .then((weeklyPlan: WeeklyPlanDTO) => {
          this.process(weeklyPlan);
        })
        .catch((error) => {});
    }
    else {
      this.weeklyPlanModel.getWeeklyPlanInRelationToCurrent(this.currentUser.id, weekRelation)
        .then((weeklyPlan: WeeklyPlanDTO) => {
          if (weeklyPlan) {
            this.process(weeklyPlan);
          }
          else {
            // 'fake' weekly plan, just to show date range
            let weeklyPlan = new WeeklyPlan();
            const firstDayOfTargetWeek: Moment = DateUtil.getFirstDayOfCurrentWeek().add(weekRelation, 'week').startOf('isoWeek');
            const targetWeekNumber: number = Number(firstDayOfTargetWeek.format('YYYYMMDD'));
            weeklyPlan.weekNumber = targetWeekNumber;

            this.weeklyPlan = weeklyPlan;
          }
        })
        .catch((error) => {
        });
    }
  }

  private process(weeklyPlan: WeeklyPlanDTO) {
    let weeklyPlanWithMeals: WeeklyPlan = WeeklyPlan.fromDTO(weeklyPlan);

    let mealsLoaded: boolean = false;
    let ingredientsLoaded: boolean = false;

    this.calculateFavoriteMealsMap(weeklyPlan.mealIds, this.currentUser.favoriteMealIds);

    this.mealModel.getMeals(weeklyPlan.mealIds)
      .then((meals: MealDTO[]) => {
        weeklyPlanWithMeals.meals = meals;

        mealsLoaded = true;

        if (mealsLoaded && ingredientsLoaded) {
          this.weeklyPlan = weeklyPlanWithMeals;
        }
      })
      .catch((error) => {});

    this.ingredientModel.getIngredients(weeklyPlan.customIngredientIds)
      .then((ingredients: IngredientDTO[]) => {
        weeklyPlanWithMeals.customIngredients = ingredients;

        ingredientsLoaded = true;

        if (mealsLoaded && ingredientsLoaded) {
          this.weeklyPlan = weeklyPlanWithMeals;
        }
      })
      .catch((error) => {});
  }

  calculateFavoriteMealsMap(mealIds: string[], favoriteMealIds: string[]) {
    let favoriteMealsMap: { [key: string]: boolean } = {};

    _.forEach(mealIds, (mealId: string) => {
      favoriteMealsMap[mealId] = false;
    });

    _.forEach(favoriteMealIds, (favoriteMealId: string) => {
      favoriteMealsMap[favoriteMealId] = true;
    });

    this.favoriteMealsMap = favoriteMealsMap;
  }

  getPreviousWeeklyPlan() {
    if (this.currentWeekRelation > -MyPlanComponent.WEEK_RANGE) {
      this.weeklyPlan = null;
      this.currentWeekRelation--;
      this.getWeeklyPlan(this.currentWeekRelation);
    }
  }

  getNextWeeklyPlan() {
    if (this.currentWeekRelation < 0) {
      this.weeklyPlan = null;
      this.currentWeekRelation++;
      this.getWeeklyPlan(this.currentWeekRelation);
    }
  }

  toggleFavorite(meal: MealDTO, isFavorite: boolean) {
    this.userModel.toggleFavoriteMeal(meal.id, isFavorite)
      .then((user: UserDTO) => {
        this.currentUser = user;
        this.getWeeklyPlan(this.currentWeekRelation);
      })
      .catch((error) => {});
  }

  addCurrentWeekMenuMeals() {
    this.weeklyMenuModel.getCurrentWeeklyMenu()
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.weeklyPlanModel.setMealsForWeeklyPlan(WeeklyPlan.toDTO(this.weeklyPlan), weeklyMenu.mealIds)
          .then((weeklyPlan: WeeklyPlanDTO) => {
            this.process(weeklyPlan);
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  }

  removeFromPlan(meal: MealDTO) {
    this.weeklyPlanModel.removeMealFromWeeklyPlan(WeeklyPlan.toDTO(this.weeklyPlan), meal.id)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.process(weeklyPlan);
      })
      .catch((error) => {});
  }

  showMeal(meal: MealDTO) {
    console.log(meal);
  }

  showPrepList() {
    let modal = this.modalCtrl.create(PrepListComponent, { weeklyPlanId: this.weeklyPlan.id });
    modal.onDidDismiss(data => {
      //
    });
    modal.present();
  }

  showShoppingList() {
    let modal = this.modalCtrl.create(ShoppingListComponent, { weeklyPlanId: this.weeklyPlan.id });
    modal.onDidDismiss(data => {
      //
    });
    modal.present();
  }
}
