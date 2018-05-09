import { Component, OnInit } from '@angular/core';
import { MealDTO } from '../../../../data/dto/menu/MealDTO';
import { MealModel } from '../../../../model/MealModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'meals',
  templateUrl: 'MealsComponent.html',
  styleUrls: ['MealsComponent.css']
})
export class MealsComponent implements OnInit {

  newMeal: MealDTO = new MealDTO();
  meals: MealDTO[];

  constructor(public toastrService: ToastrService,
              public mealModel: MealModel) {

    this.newMeal = new MealDTO();
  }

  ngOnInit() {
      this.getAllMeals();
  }

  getAllMeals() {
    this.mealModel.getAllMeals()
      .then((meals: MealDTO[]) => {
        this.meals = meals;
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
