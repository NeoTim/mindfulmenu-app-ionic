import { Component, ViewChild } from '@angular/core';
import { Navbar, NavController, NavParams } from 'ionic-angular';
import { WeeklyMenuModel } from "../../../../../model/WeeklyMenuModel";
import { WeeklyMenuDTO } from "../../../../../data/dto/menu/WeeklyMenuDTO";
import { MealModel } from "../../../../../model/MealModel";
import { MealDTO } from "../../../../../data/dto/menu/MealDTO";
import { UserDTO } from "../../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../../model/UserModel";
import { WeeklyMenu } from "../../../../../data/local/menu/WeeklyMenu";
import * as _ from "lodash";

@Component({
  selector: 'weekly-menu',
  templateUrl: 'WeeklyMenuComponent.html'
})
export class WeeklyMenuComponent {

  @ViewChild(Navbar)
  navbar: Navbar;

  weeklyMenuId: string;
  weeklyMenu: WeeklyMenu;

  public currentUser: UserDTO;

  favoriteMealsMap: { [key: string]: boolean } = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public weeklyMenuModel: WeeklyMenuModel,
              public mealModel: MealModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
    this.weeklyMenuId = this.navParams.data.weeklyMenuId;
  }

  ionViewDidLoad() {
    this.init();

    this.navbar.backButtonClick = (event: UIEvent) => {
      this.navCtrl.pop({ animation: 'ios-transition'} );
    }
  }

  init() {
    this.getWeeklyMenuWithMeals();
  }

  getWeeklyMenuWithMeals() {
    this.weeklyMenuModel.getWeeklyMenu(this.weeklyMenuId)
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.mealModel.getMeals(weeklyMenu.mealIds)
          .then((meals: MealDTO[]) => {
            let weeklyMenuWithMeals: WeeklyMenu = WeeklyMenu.fromDTO(weeklyMenu);
            weeklyMenuWithMeals.meals = meals;

            let favoriteMealsMap: { [key: string]: boolean } = {};

            _.forEach(weeklyMenuWithMeals.meals, (meal: MealDTO) => {
              favoriteMealsMap[meal.id] = false;
            });

            _.forEach(this.currentUser.favoriteMealIds, (id: string) => {
              favoriteMealsMap[id] = true;
            });

            this.weeklyMenu = weeklyMenuWithMeals;
            this.favoriteMealsMap = favoriteMealsMap;
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  }

  toggleFavorite(meal: MealDTO, isFavorite: boolean) {
    this.userModel.toggleFavoriteMeal(meal.id, isFavorite)
      .then((user: UserDTO) => {
        this.currentUser = user;
        this.getWeeklyMenuWithMeals();
      })
      .catch((error) => {});
  }

  addToPlan(meal: MealDTO) {
    console.log('add');
  }

  removeFromPlan(meal: MealDTO) {
    console.log('remove');
  }

  showMeal(meal: MealDTO) {
    console.log(meal);
  }

}
