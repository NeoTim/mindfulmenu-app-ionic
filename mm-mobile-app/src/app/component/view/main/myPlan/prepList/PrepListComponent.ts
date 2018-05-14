import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { MealModel } from "../../../../../model/MealModel";
import { UserModel } from "../../../../../model/UserModel";
import { UserDTO } from "../../../../../data/dto/user/UserDTO";
import { WeeklyPlanDTO } from "../../../../../data/dto/menu/WeeklyPlanDTO";
import { WeeklyPlanModel } from "../../../../../model/WeeklyPlanModel";
import { WeeklyPlan } from "../../../../../data/local/menu/WeeklyPlan";
import { MealDTO } from "../../../../../data/dto/menu/MealDTO";
import { IngredientDTO } from "../../../../../data/dto/menu/IngredientDTO";
import { IngredientModel } from "../../../../../model/IngredientModel";

@Component({
  selector: 'prep-list',
  templateUrl: 'PrepListComponent.html'
})
export class PrepListComponent {

  weeklyPlanId: string;
  weeklyPlan: WeeklyPlan;

  public currentUser: UserDTO;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
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
    this.getWeeklyPlan();
  }

  getWeeklyPlan() {
    this.weeklyPlanModel.getWeeklyPlan(this.weeklyPlanId)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.process(weeklyPlan);
      })
      .catch((error) => {});
  }

  private process(weeklyPlan: WeeklyPlanDTO) {
    let weeklyPlanWithMeals: WeeklyPlan = WeeklyPlan.fromDTO(weeklyPlan);
    let mealsLoaded: boolean = false;
    let ingredientsLoaded: boolean = false;

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

  close() {
    this.viewCtrl.dismiss();
  }
}
