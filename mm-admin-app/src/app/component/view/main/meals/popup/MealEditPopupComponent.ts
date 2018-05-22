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
  styleUrls: ['MealEditPopupComponent.scss']
})
export class MealEditPopupComponent implements OnInit {

  meal: MealDTO; // This is the original object from DB, before editing

  mealWithIngredients: Meal; // This is the object being edited. It is reconciled against 'meal' on save.

  removedIngredientIds: string[] = [];

  isSaving: boolean = false;

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
      .catch((error) => { });

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
              .then((newIngredient: IngredientDTO) => {
              })
              .catch((error) => { })
          }
        })
      })

      p = p.then((res) => {
        // Async delete the ingredients that have been removed
        this.removedIngredientIds.forEach(id => {
          this.ingredientModel.deleteIngredient(id)
            .then(() => { })
            .catch(() => { })
        });

        // Now, ready to save the new meal
        const dto: MealDTO = Meal.toDTO(this.mealWithIngredients);

        return this.mealModel.updateMeal(dto)
          .then((updatedMeal: MealDTO) => {
            this.activeModal.close(updatedMeal);
          })
          .catch((error) => { });
      })
    }
  }

  addIngredient() {
    var ingredient = new IngredientDTO();
    ingredient.mealId = this.meal.id;
    this.mealWithIngredients.ingredients.push(ingredient);
  }

  removeIngredient(index: number) {
    var id = this.mealWithIngredients.ingredients[index].id;
    this.mealWithIngredients.ingredients.splice(index, 1)
    if (id != null) {
      this.removedIngredientIds.push(id);
    }
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
