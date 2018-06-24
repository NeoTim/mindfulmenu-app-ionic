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
import { PrepListComponent } from "./prepList/PrepListComponent";
import { ShoppingListComponent } from "./shoppingList/ShoppingListComponent";
import { ApplicationModel } from "../../../../model/ApplicationModel";
import { MealComponent } from "../meal/MealComponent";
import { ViewUtil } from "../../../../util/ViewUtil";
import { GoogleAnalyticsModel } from "../../../../model/GoogleAnalyticsModel";

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

  private firstLoad: boolean;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private viewUtil: ViewUtil,
              public applicationModel: ApplicationModel,
              public weeklyMenuModel: WeeklyMenuModel,
              public weeklyPlanModel: WeeklyPlanModel,
              public mealModel: MealModel,
              public userModel: UserModel,
              public googleAnalyticsModel: GoogleAnalyticsModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
    this.init();

    this.googleAnalyticsModel.trackView('MY_PLAN');
  }

  ionViewDidEnter() {
    if (!this.firstLoad) {
     this.silentReload();
    }
  }

  init() {
    this.firstLoad = true;

    this.getWeeklyPlan(this.currentWeekRelation)
      .then(() => {
        this.firstLoad = false;
      })
      .catch((error) => {
        this.firstLoad = false;
      })
  }

  silentReload() {
    this.currentUser = this.userModel.currentUser;

    this.applicationModel.suppressLoading = true;

    this.getWeeklyPlan(this.currentWeekRelation)
      .then(() => {
        this.applicationModel.suppressLoading = false;
      })
      .catch((error) => {
        this.applicationModel.suppressLoading = false;
      })
  }

  getWeeklyPlan(weekRelation: number): Promise<WeeklyPlan> {
    if (weekRelation === 0) {
      return this.weeklyPlanModel.getCurrentWeeklyPlan(this.currentUser.id)
        .then((weeklyPlan: WeeklyPlanDTO) => {
          return this.process(weeklyPlan);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    else {
      return this.weeklyPlanModel.getWeeklyPlanInRelationToCurrent(this.currentUser.id, weekRelation)
        .then((weeklyPlan: WeeklyPlanDTO) => {
          if (weeklyPlan) {
            return this.process(weeklyPlan);
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
          return Promise.reject(error);
        });
    }
  }

  private process(weeklyPlan: WeeklyPlanDTO): Promise<WeeklyPlan> {
    return new Promise((resolve, reject) => {
      let weeklyPlanWithMeals: WeeklyPlan = WeeklyPlan.fromDTO(weeklyPlan);

      this.calculateFavoriteMealsMap(weeklyPlan.mealIds, this.currentUser.favoriteMealIds);

      this.mealModel.getMeals(weeklyPlan.mealIds)
        .then((meals: MealDTO[]) => {
          weeklyPlanWithMeals.meals = meals;

          this.weeklyPlan = weeklyPlanWithMeals;
          resolve(this.weeklyPlan);
        })
        .catch((error) => {
          reject(error);
        });

      // Technically, we should also load customIngredients here to completely fill WeeklyPlan, but we don't need them here so far
      // I've been loading them before, check repo history
    });
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
    this.googleAnalyticsModel.trackEvent('PLAN', 'PREV_WEEK');

    if (this.currentWeekRelation > -MyPlanComponent.WEEK_RANGE) {
      this.weeklyPlan = null;
      this.currentWeekRelation--;
      this.getWeeklyPlan(this.currentWeekRelation)
        .catch(() => {});
    }
  }

  getNextWeeklyPlan() {
    this.googleAnalyticsModel.trackEvent('PLAN', 'NEXT_WEEK');

    if (this.currentWeekRelation < 0) {
      this.weeklyPlan = null;
      this.currentWeekRelation++;
      this.getWeeklyPlan(this.currentWeekRelation)
        .catch(() => {});
    }
  }

  toggleFavorite(meal: MealDTO, isFavorite: boolean) {
    this.userModel.toggleFavoriteMeal(meal.id, isFavorite)
      .then((user: UserDTO) => {
        this.currentUser = user;

        this.calculateFavoriteMealsMap(_.map(this.weeklyPlan.meals, 'id'), this.currentUser.favoriteMealIds);
      })
      .catch((error) => {});
  }

  addCurrentWeekMenuMeals() {
    this.googleAnalyticsModel.trackEvent('PLAN', 'ADD_FULL_MENU');

    this.weeklyMenuModel.getCurrentWeeklyMenu()
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.weeklyPlanModel.setMealsForWeeklyPlan(WeeklyPlan.toDTO(this.weeklyPlan), weeklyMenu.mealIds)
          .then((weeklyPlan: WeeklyPlanDTO) => {
            this.process(weeklyPlan)
              .catch(() => {});
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  }

  removeFromPlan(meal: MealDTO) {
    this.googleAnalyticsModel.trackEvent('PLAN', 'RM_MEAL', meal.id);

    this.weeklyPlanModel.removeMealFromWeeklyPlan(WeeklyPlan.toDTO(this.weeklyPlan), meal.id)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        _.remove(this.weeklyPlan.meals, ['id', meal.id ]);
        this.calculateFavoriteMealsMap(weeklyPlan.mealIds, this.currentUser.favoriteMealIds);
      })
      .catch((error) => {});
  }

  showMeal(meal: MealDTO) {
    let modal = this.modalCtrl.create(MealComponent, { mealId: meal.id });
    modal.onDidDismiss(data => {
      this.silentReload();
    });
    modal.present();
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

  emailPlan() {
    this.googleAnalyticsModel.trackEvent('PLAN', 'EMAIL');

    this.weeklyPlanModel.emailPlan(WeeklyPlan.toDTO(this.weeklyPlan), this.currentUser.id)
      .then(() => {
        this.viewUtil.showToast('Check your email for printable version of the plan.');
      })
      .catch(() => {});
  }
}
