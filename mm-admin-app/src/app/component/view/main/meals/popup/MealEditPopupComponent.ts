import { Component, OnInit, ViewChild } from '@angular/core';
import { WeeklyMenuModel } from '../../../../../model/WeeklyMenuModel';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WeeklyMenuDTO } from '../../../../../data/dto/menu/WeeklyMenuDTO';
import { MealModel } from '../../../../../model/MealModel';
import { MealDTO } from '../../../../../data/dto/menu/MealDTO';
import { WeeklyMenu } from '../../../../../data/local/menu/WeeklyMenu';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NgForm, NgModel } from '@angular/forms';
import * as _ from 'lodash';
import { Meal } from '../../../../../data/local/menu/Meal';
import { IngredientModel } from '../../../../../model/IngredientModel';
import { IngredientDTO } from '../../../../../data/dto/menu/IngredientDTO';

@Component({
  selector: 'meal-edit-popup',
  templateUrl: 'MealEditPopupComponent.html',
  styleUrls: ['MealEditPopupComponent.css']
})
export class MealEditPopupComponent implements OnInit {

  meal: MealDTO;

  mealWithIngredients: Meal;

  @ViewChild('mealForm')
  private mealForm: NgForm;

  constructor(public activeModal: NgbActiveModal,
              public mealModel: MealModel,
              public ingredientModel: IngredientModel) {
  }

  ngOnInit() {
    this.ingredientModel.getIngredients(this.meal.ingredientIds)
        .then((ingredients: IngredientDTO[]) => {
          const mealWithIngredients: Meal = Meal.fromDTO(this.meal);
          mealWithIngredients.ingredients = ingredients;

          this.mealWithIngredients = mealWithIngredients;
        })
        .catch((error) => {});
      
  }

  // This is used for trackByFn in ngFor, to keep focus on element when typing.
  identify(index, item){
    return index; 
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  save() {
    this.mealForm.onSubmit(null);

    if (this.mealForm.form.valid) {
      const dto: MealDTO = Meal.toDTO(this.mealWithIngredients);

      this.mealModel.updateMeal(dto)
        .then((updatedMeal: MealDTO) => {
          this.activeModal.close(updatedMeal);
        })
        .catch((error) => {
          //
        });
    }
  }

  addCookInstruction() {
    if(this.mealWithIngredients.cookInstructions == null){
      this.mealWithIngredients.cookInstructions = [];
    }
    this.mealWithIngredients.cookInstructions.push("Add new instruction...");
  }

  removeCookInstruction() {
    this.mealWithIngredients.cookInstructions.pop();
  }

  addPrepInstruction() {
    if(this.mealWithIngredients.prepInstructions == null){
      this.mealWithIngredients.prepInstructions = [];
    }
    this.mealWithIngredients.prepInstructions.push("Add new instruction...");
  }

  removePrepInstruction() {
    this.mealWithIngredients.prepInstructions.pop();
  }

  onNumberBlur(model: NgModel) {
    // when input type="number", underlying viewModel is always null, until it is a valid number, but the value in the html input is not cleared
    // so we're forcing that
    if (model.viewModel === null) {
      model.control.setValue(null);
    }
  }
}
