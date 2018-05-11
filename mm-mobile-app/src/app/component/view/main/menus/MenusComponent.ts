import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeeklyMenuModel } from "../../../../model/WeeklyMenuModel";
import { WeeklyMenuDTO } from "../../../../data/dto/menu/WeeklyMenuDTO";
import { MealModel } from "../../../../model/MealModel";
import { MealDTO } from "../../../../data/dto/menu/MealDTO";
import { UserDTO } from "../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../model/UserModel";
import * as _ from "lodash";
import { WeeklyMenuComponent } from "./weeklyMenu/WeeklyMenuComponent";

@Component({
  selector: 'menus',
  templateUrl: 'MenusComponent.html'
})
export class MenusComponent {

  currentWeeklyMenu: WeeklyMenuDTO;
  previousWeeklyMenus: WeeklyMenuDTO[];
  upcomingWeeklyMenus: WeeklyMenuDTO[];

  favoriteMeals: MealDTO[];

  public currentUser: UserDTO;

  public static readonly WEEK_RANGE: number = 6;

  constructor(public navCtrl: NavController,
              public weeklyMenuModel: WeeklyMenuModel,
              public mealModel: MealModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
    this.init();
  }

  ionViewDidEnter() {
    this.currentUser = this.userModel.currentUser;
    this.getFavoriteMeals();
  }

  init() {
    this.getCurrentWeeklyMenu();
    this.getPreviousWeeklyMenus();

    if (this.currentUser.isAdmin) {
      this.getUpcomingWeeklyMenus();
    }
  }

  getCurrentWeeklyMenu() {
    this.weeklyMenuModel.getCurrentWeeklyMenu()
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.currentWeeklyMenu = weeklyMenu;
      })
      .catch((error) => {});
  }

  getPreviousWeeklyMenus() {
    let previousWeeklyMenus: WeeklyMenuDTO[] = [];

    for (let i = -1; i > (-1 - MenusComponent.WEEK_RANGE); i--) {
      this.weeklyMenuModel.getWeeklyMenuInRelationToCurrent(i)
        .then((weeklyMenu: WeeklyMenuDTO) => {
          previousWeeklyMenus.push(weeklyMenu);

          if (previousWeeklyMenus.length === MenusComponent.WEEK_RANGE) {
            this.previousWeeklyMenus = _.orderBy(_.compact(previousWeeklyMenus), ['weekNumber'], ['desc']);
          }
        })
        .catch((error) => {});
    }
  }

  getUpcomingWeeklyMenus() {
    let upcomingWeeklyMenus: WeeklyMenuDTO[] = [];

    for (let i = 1; i < (1 + MenusComponent.WEEK_RANGE); i++) {
      this.weeklyMenuModel.getWeeklyMenuInRelationToCurrent(i)
        .then((weeklyMenu: WeeklyMenuDTO) => {
          upcomingWeeklyMenus.push(weeklyMenu);

          if (upcomingWeeklyMenus.length === MenusComponent.WEEK_RANGE) {
            this.upcomingWeeklyMenus = _.orderBy(_.compact(upcomingWeeklyMenus), ['weekNumber'], ['asc']);
          }
        })
        .catch((error) => {
        });
    }
  }

  getFavoriteMeals() {
    this.mealModel.getMeals(this.currentUser.favoriteMealIds)
      .then((meals: MealDTO[]) => {
        this.favoriteMeals = meals;
      })
      .catch((error) => {});
  }

  showWeeklyMenu(weeklyMenu: WeeklyMenuDTO) {
    this.navCtrl.push(WeeklyMenuComponent, { weeklyMenuId: weeklyMenu.id },{ animation: 'ios-transition'} )
  }

  showMeal(meal: MealDTO) {
    console.log(meal);
  }

  toggleFavorite(meal: MealDTO, isFavorite: boolean) {
    this.userModel.toggleFavoriteMeal(meal.id, isFavorite)
      .then((user: UserDTO) => {
        this.currentUser = user;
        this.getFavoriteMeals();
      })
      .catch((error) => {});
  }

}

