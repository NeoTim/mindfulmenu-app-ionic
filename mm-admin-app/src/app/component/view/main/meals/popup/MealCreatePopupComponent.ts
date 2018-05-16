import { Component, OnInit, ViewChild } from '@angular/core';
import { WeeklyMenuModel } from '../../../../../model/WeeklyMenuModel';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WeeklyMenuDTO } from '../../../../../data/dto/menu/WeeklyMenuDTO';
import { MealModel } from '../../../../../model/MealModel';
import { MealDTO } from '../../../../../data/dto/menu/MealDTO';
import { IngredientModel } from '../../../../../model/IngredientModel';
import { IngredientDTO } from '../../../../../data/dto/menu/IngredientDTO';
import { WeeklyMenu } from '../../../../../data/local/menu/WeeklyMenu';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NgForm, NgModel } from '@angular/forms';
import * as _ from 'lodash';
import { Meal } from '../../../../../data/local/menu/Meal';

@Component({
  selector: 'meal-create-popup',
  templateUrl: 'MealCreatePopupComponent.html',
  styleUrls: ['MealCreatePopupComponent.css']
})
export class MealCreatePopupComponent implements OnInit {

  meal: MealDTO;

  mealWithIngredients: Meal = new Meal();

  isSaving: boolean = false;

  @ViewChild('mealForm')
  private mealForm: NgForm;

  constructor(public activeModal: NgbActiveModal,
    public mealModel: MealModel,
    public ingredientModel: IngredientModel) {

    this.mealWithIngredients.ingredients = [];
    this.mealWithIngredients.cookInstructions = [];
    this.mealWithIngredients.prepInstructions = [];
  }

  ngOnInit() {

  }

  // This is used for trackByFn in ngFor, to keep focus on element when typing.
  identify(index, item) {
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
      this.isSaving = true;
      var p = Promise.resolve(); // Start with a resolved promise, so saves and updates happen synchonously

      // Create ingredients that don't have IDs, and update those that do
      this.mealWithIngredients.ingredients.forEach((ingredient, index) => {
        p = p.then((res) => {
          if (ingredient.id == null) {
            return this.ingredientModel.createIngredient(ingredient)
              .then((newIngredient: IngredientDTO) => {
                this.mealWithIngredients.ingredients.push(newIngredient);
              })
              .catch((error) => { })
          } else {
            return this.ingredientModel.updateIngredient(ingredient)
              .then((newIngredient: IngredientDTO) => { })
              .catch((error) => { })
          }
        })
      })

      // Now, ready to save the new meal
      p = p.then((res) => {
        const dto: MealDTO = Meal.toDTO(this.mealWithIngredients);

        return this.mealModel.createMeal(dto)
          .then((newMeal: MealDTO) => {
            this.mealWithIngredients.id = newMeal.id;
            this.meal = newMeal;
          })
          .catch((error) => { });
      })

      // Finally, go back and set the mealId for the new ingredients
      p = p.then((res) => {
        this.mealWithIngredients.ingredients.forEach((ingredient) => {
          if (ingredient.id != null) {
            ingredient.mealId = this.mealWithIngredients.id;
            this.ingredientModel.updateIngredient(ingredient)
              .then((newIngredient: IngredientDTO) => { })
              .catch((error) => { })
          }
        })
      })

      p = p.then((res) => {
        this.activeModal.close(this.meal);
      })
    }
  }

  addIngredient() {
    var ingredient = new IngredientDTO();
    this.mealWithIngredients.ingredients.push(ingredient);
  }

  removeIngredient(index: number) {
    this.mealWithIngredients.ingredients.splice(index, 1)
  }

  addCookInstruction() {
    if (this.mealWithIngredients.cookInstructions == null) {
      this.mealWithIngredients.cookInstructions = [];
    }
    this.mealWithIngredients.cookInstructions.push("Add new instruction...");
  }

  removeCookInstruction() {
    this.mealWithIngredients.cookInstructions.pop();
  }

  addPrepInstruction() {
    if (this.mealWithIngredients.prepInstructions == null) {
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

  getFormControl(name: string) {
    return this.mealForm.form.controls[name];
  }
}
