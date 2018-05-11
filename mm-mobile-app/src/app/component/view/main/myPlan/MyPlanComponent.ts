import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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
  public WEEK_RANGE: number = MyPlanComponent.WEEK_RANGE;

  constructor(public navCtrl: NavController,
              public weeklyMenuModel: WeeklyMenuModel,
              public weeklyPlanModel: WeeklyPlanModel,
              public mealModel: MealModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
    this.init();
  }

  init() {
    this.getWeeklyPlan(this.currentWeekRelation);
  }

  // todo: I need to map custom ingredients too, to not lose data when converting to dto

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
    this.mealModel.getMeals(weeklyPlan.mealIds)
      .then((meals: MealDTO[]) => {
        let weeklyPlanWithMeals: WeeklyPlan = WeeklyPlan.fromDTO(weeklyPlan);
        weeklyPlanWithMeals.meals = meals;

        let favoriteMealsMap: { [key: string]: boolean } = {};

        _.forEach(weeklyPlanWithMeals.meals, (meal: MealDTO) => {
          favoriteMealsMap[meal.id] = false;
        });

        _.forEach(this.currentUser.favoriteMealIds, (id: string) => {
          favoriteMealsMap[id] = true;
        });

        this.favoriteMealsMap = favoriteMealsMap;
        this.weeklyPlan = weeklyPlanWithMeals;
      })
      .catch((error) => {});
  }

  getPreviousWeeklyPlan() {
    if (this.currentWeekRelation > -MyPlanComponent.WEEK_RANGE) {
      this.currentWeekRelation--;
      this.getWeeklyPlan(this.currentWeekRelation);
    }
  }

  getNextWeeklyPlan() {
    if (this.currentWeekRelation < 0) {
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
        this.weeklyPlanModel.setMeals(this.weeklyPlan.id, weeklyMenu.mealIds)
          .then((weeklyPlan: WeeklyPlanDTO) => {
            this.process(weeklyPlan);
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  }

  removeFromPlan(meal: MealDTO) {
    console.log('remove');
  }

  showMeal(meal: MealDTO) {
    console.log(meal);
  }
}
