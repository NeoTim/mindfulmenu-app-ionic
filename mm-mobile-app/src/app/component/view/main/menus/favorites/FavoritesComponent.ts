import { Component, ViewChild } from '@angular/core';
import { ModalController, Navbar, NavController } from 'ionic-angular';
import { MealModel } from "../../../../../model/MealModel";
import { MealDTO } from "../../../../../data/dto/menu/MealDTO";
import { UserDTO } from "../../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../../model/UserModel";
import { WeeklyPlanDTO } from "../../../../../data/dto/menu/WeeklyPlanDTO";
import { WeeklyPlanModel } from "../../../../../model/WeeklyPlanModel";
import * as _ from "lodash";
import { MealComponent } from "../../meal/MealComponent";
import { ApplicationModel } from "../../../../../model/ApplicationModel";
import { GoogleAnalyticsModel } from "../../../../../model/GoogleAnalyticsModel";

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
              public modalCtrl: ModalController,
              public applicationModel: ApplicationModel,
              public mealModel: MealModel,
              public weeklyPlanModel: WeeklyPlanModel,
              public userModel: UserModel,
              public googleAnalyticsModel: GoogleAnalyticsModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
    this.init();

    this.googleAnalyticsModel.trackView('FAVORITES');

    this.navbar.backButtonClick = (event: UIEvent) => {
      this.navCtrl.pop({ animation: 'ios-transition'} );
    }
  }

  init() {
    this.getFavoriteMeals()
      .catch(() => {});
    this.getCurrentWeeklyPlan()
      .catch(() => {});
  }

  silentReload() {
    this.currentUser = this.userModel.currentUser;

    this.applicationModel.suppressLoading = true;

    let getFavoriteMealsFinished: boolean = false;
    let getCurrentWeeklyPlanFinished: boolean = false;

    this.getFavoriteMeals()
      .then(() => {
        getFavoriteMealsFinished = true;

        if (getFavoriteMealsFinished && getCurrentWeeklyPlanFinished) {
          this.applicationModel.suppressLoading = false;
        }
      })
      .catch(() => {
        getFavoriteMealsFinished = true;

        if (getFavoriteMealsFinished && getCurrentWeeklyPlanFinished) {
          this.applicationModel.suppressLoading = false;
        }
      });

    this.getCurrentWeeklyPlan()
      .then(() => {
        getCurrentWeeklyPlanFinished = true;

        if (getFavoriteMealsFinished && getCurrentWeeklyPlanFinished) {
          this.applicationModel.suppressLoading = false;
        }
      })
      .catch(() => {
        getCurrentWeeklyPlanFinished = true;

        if (getFavoriteMealsFinished && getCurrentWeeklyPlanFinished) {
          this.applicationModel.suppressLoading = false;
        }
      });
  }

  getFavoriteMeals(): Promise<MealDTO[]> {
    return this.mealModel.getMeals(this.currentUser.favoriteMealIds)
      .then((meals: MealDTO[]) => {
        this.favoriteMeals = meals;

        if (this.favoriteMeals && this.weeklyPlanDto) {
          this.calculateInCurrentPlanMealsMap(_.map(this.favoriteMeals, 'id'), this.weeklyPlanDto.mealIds);
        }

        return this.favoriteMeals;
      })
      .catch((error) => {
        return Promise.reject(error);
      })
  }

  getCurrentWeeklyPlan(): Promise<WeeklyPlanDTO>  {
    return this.weeklyPlanModel.getCurrentWeeklyPlan(this.currentUser.id)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlanDto = weeklyPlan;

        if (this.favoriteMeals && this.weeklyPlanDto) {
          this.calculateInCurrentPlanMealsMap(_.map(this.favoriteMeals, 'id'), this.weeklyPlanDto.mealIds);
        }

        return this.weeklyPlanDto;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
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

        _.remove(this.favoriteMeals, ['id', meal.id ]);
        this.calculateInCurrentPlanMealsMap(_.map(this.favoriteMeals, 'id'), this.weeklyPlanDto.mealIds);
      })
      .catch((error) => {});
  }

  addMealToCurrentWeeklyPlan(meal: MealDTO) {
    this.weeklyPlanModel.addMealToWeeklyPlan(this.weeklyPlanDto, meal.id)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlanDto = weeklyPlan;

        this.calculateInCurrentPlanMealsMap(_.map(this.favoriteMeals, 'id'), this.weeklyPlanDto.mealIds);
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

}
