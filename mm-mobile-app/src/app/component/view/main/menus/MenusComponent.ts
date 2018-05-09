import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeeklyMenuModel } from "../../../../model/WeeklyMenuModel";
import { WeeklyMenuDTO } from "../../../../data/dto/menu/WeeklyMenuDTO";
import { MealModel } from "../../../../model/MealModel";
import { MealDTO } from "../../../../data/dto/menu/MealDTO";
import { UserDTO } from "../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../model/UserModel";
import * as _ from "lodash";

@Component({
  selector: 'menus',
  templateUrl: 'MenusComponent.html'
})
export class MenusComponent {

  weeklyMenu: WeeklyMenuDTO;
  previousWeeklyMenus: WeeklyMenuDTO[];

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

  init() {
    this.weeklyMenuModel.getCurrentWeeklyMenu()
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.weeklyMenu = weeklyMenu;
      })
      .catch((error) => {});

    this.previousWeeklyMenus = [];

    for (let i = -1; i > (-1 - MenusComponent.WEEK_RANGE); i--) {
      this.weeklyMenuModel.getWeeklyMenuInRelationToCurrent(i)
        .then((weeklyMenu: WeeklyMenuDTO) => {
          this.previousWeeklyMenus.push(weeklyMenu);

          if (this.previousWeeklyMenus.length === MenusComponent.WEEK_RANGE) {
            this.previousWeeklyMenus = _.orderBy(_.compact(this.previousWeeklyMenus), ['weekNumber'], ['desc']);
          }
        })
        .catch((error) => {});
    }

    this.mealModel.getMeals(this.currentUser.favoriteMealIds)
      .then((meals: MealDTO[]) => {
        this.favoriteMeals = meals;
      })
      .catch((error) => {});
  }
}
