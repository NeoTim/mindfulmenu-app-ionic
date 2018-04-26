import { Component, OnInit } from '@angular/core';
import { MealDTO } from '../../../../data/dto/menu/MealDTO';
import { WeeklyMenuDTO } from '../../../../data/dto/menu/WeeklyMenuDTO';
import { MealModel } from '../../../../model/MealModel';
import { ToastrService } from 'ngx-toastr';
import { WeeklyMenuModel } from '../../../../model/WeeklyMenuModel';

@Component({
  selector: 'home',
  templateUrl: './HomeComponent.html',
  styleUrls: ['./HomeComponent.css']
})
export class HomeComponent implements OnInit {

  newMeal: MealDTO = new MealDTO();
  meals: MealDTO[];
  menus: WeeklyMenuDTO[];

  constructor(public toastrService: ToastrService,
              public mealModel: MealModel,
              public weeklyMenuModel: WeeklyMenuModel) {

    this.newMeal = new MealDTO();
  }

  ngOnInit() {
      this.getAllMeals();
      this.getAllWeeklyMenus();
  }

  getAllMeals() {
    this.mealModel.getAllMeals()
      .then((meals: MealDTO[]) => {
        this.meals = meals;
      })
      .catch((error) => {});
  }

  getAllWeeklyMenus() {
    this.weeklyMenuModel.getAllWeeklyMenus()
      .then((weeklyMenus: WeeklyMenuDTO[]) => {
        this.menus = weeklyMenus;
      })
      .catch((error) => {});
  }

  addMeal() {
    this.mealModel.createMeal(this.newMeal)
      .then((newMeal: MealDTO) => {
        this.toastrService.success('Meal added!', 'Success');
        this.newMeal = new MealDTO();
      })
      .catch((error) => {});
  }

  deleteMeal(meal: MealDTO) {
    this.mealModel.deleteMeal(meal.id)
      .then(() => {
        this.toastrService.success('Meal removed!', 'Success');
        this.getAllMeals();
      })
      .catch((error) => {});
  }
}
