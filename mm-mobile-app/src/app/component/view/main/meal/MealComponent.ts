import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { MealModel } from "../../../../model/MealModel";
import { UserModel } from "../../../../model/UserModel";
import { UserDTO } from "../../../../data/dto/user/UserDTO";
import { WeeklyPlanDTO } from "../../../../data/dto/menu/WeeklyPlanDTO";
import { WeeklyPlanModel } from "../../../../model/WeeklyPlanModel";
import { MealDTO } from "../../../../data/dto/menu/MealDTO";
import { IngredientDTO } from "../../../../data/dto/menu/IngredientDTO";
import { IngredientModel } from "../../../../model/IngredientModel";
import { Meal } from "../../../../data/local/menu/Meal";
import * as _ from "lodash";
import * as Reveal from "reveal.js/js/reveal.js";
import { StatusBar } from "@ionic-native/status-bar";
import { PlatformUtil } from "../../../../util/PlatformUtil";

@Component({
  selector: 'meal',
  templateUrl: 'MealComponent.html'
})
export class MealComponent {

  mealId: string;
  meal: Meal;

  public currentUser: UserDTO;

  public isFavorite: boolean;
  public isInCurrentPlan: boolean;

  weeklyPlan: WeeklyPlanDTO;

  public isFirstSlide: boolean = true;

  constructor(public viewCtrl: ViewController,
              public statusBar: StatusBar,
              public navParams: NavParams,
              public platformUtil: PlatformUtil,
              public weeklyPlanModel: WeeklyPlanModel,
              public mealModel: MealModel,
              public ingredientModel: IngredientModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
    this.mealId = this.navParams.data.mealId;
  }

  ionViewDidLoad() {
    this.init();
  }

  ionViewDidLeave() {
    if (this.platformUtil.isCordova()) {
      this.statusBar.backgroundColorByHexString('#A2B3D2');
    }
  }

  init() {
    let mealLoaded: boolean = false;
    let weeklyPlanLoaded: boolean = false;

    this.getMeal()
      .then(() => {
        mealLoaded = true;

        if (mealLoaded && weeklyPlanLoaded) {
          this.initSlides();
        }
      })
      .catch(() => {});
    this.getCurrentWeeklyPlan()
      .then(() => {
        weeklyPlanLoaded = true;

        if (mealLoaded && weeklyPlanLoaded) {
          this.initSlides();
        }
      })
      .catch(() => {});
  }

  getMeal(): Promise<Meal> {
    return this.mealModel.getMeal(this.mealId)
      .then((meal: MealDTO) => {
        return this.ingredientModel.getIngredients(meal.ingredientIds)
          .then((ingredients: IngredientDTO[]) => {
            let mealWithIngredients: Meal = Meal.fromDTO(meal);
            mealWithIngredients.ingredients = ingredients;

            this.meal = mealWithIngredients;

            this.calculateFavorite(this.meal.id);

            if (this.weeklyPlan && this.meal) {
              this.calculateInCurrentPlan(this.meal.id, this.weeklyPlan.mealIds);
            }

            return this.meal;
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  getCurrentWeeklyPlan(): Promise<WeeklyPlanDTO> {
    return this.weeklyPlanModel.getCurrentWeeklyPlan(this.currentUser.id)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlan = weeklyPlan;

        if (this.weeklyPlan && this.meal) {
          this.calculateInCurrentPlan(this.meal.id, this.weeklyPlan.mealIds);
        }

        return this.weeklyPlan;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  calculateFavorite(mealId: string) {
    if (_.includes(this.currentUser.favoriteMealIds, mealId)) {
      this.isFavorite = true;
    }
    else {
      this.isFavorite = false;
    }
  }

  calculateInCurrentPlan(mealId, weeklyPlanMealIds: string[]) {
    if (_.includes(weeklyPlanMealIds, mealId)) {
      this.isInCurrentPlan = true;
    }
    else {
      this.isInCurrentPlan = false;
    }
  }

  toggleFavorite(isFavorite: boolean) {
    this.userModel.toggleFavoriteMeal(this.meal.id, isFavorite)
      .then((user: UserDTO) => {
        this.currentUser = user;
        this.calculateFavorite(this.meal.id);
      })
      .catch((error) => {});
  }

  addMealToCurrentWeeklyPlan() {
    this.weeklyPlanModel.addMealToWeeklyPlan(this.weeklyPlan, this.meal.id)
      .then((weeklyPlan: WeeklyPlanDTO) => {
        this.weeklyPlan = weeklyPlan;

        this.calculateInCurrentPlan(this.meal.id, this.weeklyPlan.mealIds);
      })
      .catch((error) => {});
  }

  initSlides() {
    setTimeout(() => {
      if (this.platformUtil.isCordova()) {
        this.statusBar.backgroundColorByHexString('#000000');
      }

      Reveal.initialize({
        width: '100%',
        height: '100%',
        margin: 0,
        minScale: 1,
        maxScale: 1,
        overview: false,
        embedded: true,
        progress: true,
        transition: 'fade',
        backgroundTransition: 'fade',
        controlsBackArrows: 'visible'
      });

      Reveal.slide(-1, -1, -1);

      Reveal.addEventListener( 'slidechanged', (event) => {
        let index = event.indexh;

        if (index == 0) {
          this.isFirstSlide = true;

          if (this.platformUtil.isCordova()) {
            this.statusBar.backgroundColorByHexString('#000000');
          }
        }
        else {
          this.isFirstSlide = false;

          if (this.platformUtil.isCordova()) {
            this.statusBar.backgroundColorByHexString('#A2B3D2');
          }
        }
      });
    }, 100);
  }

  startCooking() {
    Reveal.navigateNext();
  }

  openSource() {
    window.open(this.meal.sourceUrl, '_system');
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
