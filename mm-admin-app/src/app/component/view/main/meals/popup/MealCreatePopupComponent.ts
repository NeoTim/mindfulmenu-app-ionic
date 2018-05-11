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

@Component({
  selector: 'meal-create-popup',
  templateUrl: 'MealCreatePopupComponent.html',
  styleUrls: ['MealCreatePopupComponent.css']
})
export class MealCreatePopupComponent implements OnInit {

  meal: MealDTO;

  mealWithIngredients: Meal = new Meal();

  @ViewChild('mealForm')
  private mealForm: NgForm;

  constructor(public activeModal: NgbActiveModal,
              public mealModel: MealModel) {
  }

  ngOnInit() {
      
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

      this.activeModal.close();
    }
  }

  onNumberBlur(model: NgModel) {
    // when input type="number", underlying viewModel is always null, until it is a valid number, but the value in the html input is not cleared
    // so we're forcing that
    if (model.viewModel === null) {
      model.control.setValue(null);
    }
  }
}
