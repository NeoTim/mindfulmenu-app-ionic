import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { MealModel } from "../../../../../model/MealModel";
import { UserModel } from "../../../../../model/UserModel";
import { UserDTO } from "../../../../../data/dto/user/UserDTO";
import { WeeklyPlanDTO } from "../../../../../data/dto/menu/WeeklyPlanDTO";
import { WeeklyPlanModel } from "../../../../../model/WeeklyPlanModel";
import { WeeklyPlan } from "../../../../../data/local/menu/WeeklyPlan";
import { MealDTO } from "../../../../../data/dto/menu/MealDTO";

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

    this.mealModel.getMeals(weeklyPlan.mealIds)
      .then((meals: MealDTO[]) => {
        weeklyPlanWithMeals.meals = meals;

        this.weeklyPlan = weeklyPlanWithMeals;

      })
      .catch((error) => {});

    // Technically, we should also load customIngredients here to completely fill WeeklyPlan, but we don't need them here so far
    // I've been loading them before, check repo history
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
