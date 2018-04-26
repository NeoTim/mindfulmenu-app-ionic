import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeeklyMenuModel } from "../../../../model/WeeklyMenuModel";
import { WeeklyMenuDTO } from "../../../../data/dto/menu/WeeklyMenuDTO";
import { classToPlain } from "class-transformer";
import { MealModel } from "../../../../model/MealModel";
import { MealDTO } from "../../../../data/dto/menu/MealDTO";
import { WeeklyMenu } from "../../../../data/local/menu/WeeklyMenu";

@Component({
  selector: 'menus',
  templateUrl: 'MenusComponent.html'
})
export class MenusComponent {

  weeklyMenu: WeeklyMenu;

  constructor(public navCtrl: NavController,
              public weeklyMenuModel: WeeklyMenuModel,
              public mealModel: MealModel) {
  }

  ionViewDidLoad() {
    this.init();
  }

  init() {
    this.weeklyMenuModel.getWeeklyMenuInRelationToCurrent(-1)
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.mealModel.getMeals(weeklyMenu.mealIds)
          .then((meals: MealDTO[]) => {
            let weeklyMenuWithMeals: WeeklyMenu = WeeklyMenu.fromDTO(weeklyMenu);
            weeklyMenuWithMeals.meals = meals;

            this.weeklyMenu = weeklyMenuWithMeals;

            let wm2: WeeklyMenuDTO = WeeklyMenu.toDTO(weeklyMenuWithMeals);
            console.log('weekly menu DTO converted back from local weekly menu');
            console.log(wm2);

            let plain = classToPlain(wm2);
            console.log('weekly menu DTO before send to server');
            console.log(plain);
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  }
}
