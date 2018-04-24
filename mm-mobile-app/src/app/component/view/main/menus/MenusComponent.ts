import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeeklyMenuModel } from "../../../../model/WeeklyMenuModel";
import { WeeklyMenuDTO } from "../../../../data/dto/weeklyMenu/WeeklyMenuDTO";
import { classToPlain } from "class-transformer";
import { MealModel } from "../../../../model/MealModel";
import { MealDTO } from "../../../../data/dto/meal/MealDTO";
import { WeeklyMenu } from "../../../../data/local/weeklyMenu/WeeklyMenu";
import { IngredientModel } from "../../../../model/IngredientModel";
import { IngredientDTO } from "../../../../data/dto/ingredient/IngredientDTO";

@Component({
  selector: 'menus',
  templateUrl: 'MenusComponent.html'
})
export class MenusComponent {

  ingredients: IngredientDTO[];

  constructor(public navCtrl: NavController,
              public weeklyMenuModel: WeeklyMenuModel,
              public mealModel: MealModel,
              public ingredientModel: IngredientModel) {
  }

  ionViewDidLoad() {
    this.init();
  }

  init() {
    this.ingredientModel.getAllIngredients()
      .then((ingredients: IngredientDTO[]) => {
        this.ingredients = ingredients;
      });

    this.weeklyMenuModel.getWeeklyMenu('9mEinmBGOEgxLUfH3hI9')
      .then((weeklyMenu: WeeklyMenuDTO) => {
        console.log('weekly menu DTO after receive from server');
        console.log(weeklyMenu);

        this.mealModel.getMeals(weeklyMenu.mealIds)
          .then((meals: MealDTO[]) => {
            console.log('weekly menu\'s meal DTOs after receive from server');
            console.log(meals);

            let wm: WeeklyMenu = WeeklyMenu.fromDTO(weeklyMenu);
            wm.meals = meals;
            console.log('local weekly menu object with meals');
            console.log(wm);

            let wm2: WeeklyMenuDTO = WeeklyMenu.toDTO(wm);
            console.log('weekly menu DTO converted back from local weekly menu');
            console.log(wm2);

            let plain = classToPlain(wm2);
            console.log('weekly menu DTO before send to server');
            console.log(plain);
          });
      });
  }
}
