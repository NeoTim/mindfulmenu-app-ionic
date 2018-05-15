import { Component, ViewChild } from '@angular/core';
import { Navbar, NavController } from 'ionic-angular';
import { MealModel } from "../../../../../model/MealModel";
import { MealDTO } from "../../../../../data/dto/menu/MealDTO";
import { UserDTO } from "../../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../../model/UserModel";
import { WeeklyPlanDTO } from "../../../../../data/dto/menu/WeeklyPlanDTO";
import { WeeklyPlanModel } from "../../../../../model/WeeklyPlanModel";
import * as _ from "lodash";

@Component({
  selector: 'favorites',
  templateUrl: 'FavoritesComponent.html'
})
export class FavoritesComponent {

  @ViewChild(Navbar)
  navbar: Navbar;

  favoriteMeals: MealDTO[];

  private weeklyPlanDto: WeeklyPlanDTO;

  public currentUser: UserDTO;

  inCurrentPlanMealsMap: { [key: string]: boolean };

  constructor(public navCtrl: NavController,
              public mealModel: MealModel,
              public weeklyPlanModel: WeeklyPlanModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
    this.init();

    this.navbar.backButtonClick = (event: UIEvent) => {
      this.navCtrl.pop({ animation: 'ios-transition'} );
    }
  }

  init() {
    this.getFavoriteMeals();
    this.getCurrentWeeklyPlan();
  }

  getFavoriteMeals() {
    this.mealModel.getMeals(this.currentUser.favoriteMealIds)
      .then((meals: MealDTO[]) => {
        this.favoriteMeals = meals;

        if (this.favoriteMeals && this.weeklyPlanDto) {
          this.calculateInCurrentPlanMealsMap(_.map(this.favoriteMeals, 'id'), this.weeklyPlanDto.mealIds);
        }
      })
      .catch((error) => {});
  }

  getCurrentWeeklyPlan() {
    this.weeklyPlanModel.getCurrentWeeklyPlan(this.currentUser.id)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlanDto = weeklyPlan;

        if (this.favoriteMeals && this.weeklyPlanDto) {
          this.calculateInCurrentPlanMealsMap(_.map(this.favoriteMeals, 'id'), this.weeklyPlanDto.mealIds);
        }
      })
      .catch((error) => {});
  }

  calculateInCurrentPlanMealsMap(mealIds: string[], weeklyPlanMealIds: string[]) {
    let inCurrentPlanMealsMap: { [key: string]: boolean } = {};

    _.forEach(mealIds, (mealId: string) => {
      inCurrentPlanMealsMap[mealId] = false;
    });

    _.forEach(weeklyPlanMealIds, (weeklyPlanMealId: string) => {
      inCurrentPlanMealsMap[weeklyPlanMealId] = true;
    });

    this.inCurrentPlanMealsMap = inCurrentPlanMealsMap;
  }

  toggleFavorite(meal: MealDTO, isFavorite: boolean) {
    this.userModel.toggleFavoriteMeal(meal.id, isFavorite)
      .then((user: UserDTO) => {
        this.currentUser = user;
        this.getFavoriteMeals();
      })
      .catch((error) => {});
  }

  addMealToCurrentWeeklyPlan(meal: MealDTO) {
    this.weeklyPlanModel.addMealToWeeklyPlan(this.weeklyPlanDto, meal.id)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlanDto = weeklyPlan;

        if (this.favoriteMeals && this.weeklyPlanDto) {
          this.calculateInCurrentPlanMealsMap(_.map(this.favoriteMeals, 'id'), this.weeklyPlanDto.mealIds);
        }
      })
      .catch((error) => {});
  }

  showMeal(meal: MealDTO) {
    console.log(meal);
  }

}
