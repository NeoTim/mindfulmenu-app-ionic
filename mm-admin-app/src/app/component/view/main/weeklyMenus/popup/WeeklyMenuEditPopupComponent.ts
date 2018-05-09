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

@Component({
  selector: 'weekly-menu-edit-popup',
  templateUrl: 'WeeklyMenuEditPopupComponent.html',
  styleUrls: ['WeeklyMenuEditPopupComponent.css']
})
export class WeeklyMenuEditPopupComponent implements OnInit {

  weeklyMenu: WeeklyMenuDTO;

  weeklyMenuWithMeals: WeeklyMenu;

  @ViewChild('weeklyMenuForm')
  private weeklyMenuForm: NgForm;

  constructor(public activeModal: NgbActiveModal,
              public weeklyMenuModel: WeeklyMenuModel,
              public mealModel: MealModel) {

    // typeahead doesn't pass this into the observable chain
    this.search = this.search.bind(this);
  }

  ngOnInit() {
      this.mealModel.getMeals(this.weeklyMenu.mealIds)
        .then((meals: MealDTO[]) => {
          const weeklyMenuWithMeals: WeeklyMenu = WeeklyMenu.fromDTO(this.weeklyMenu);
          weeklyMenuWithMeals.meals = meals;

          this.weeklyMenuWithMeals = weeklyMenuWithMeals;
        })
        .catch((error) => {});
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  save() {
    this.weeklyMenuForm.onSubmit(null);

    if (this.weeklyMenuForm.form.valid) {
      const dto: WeeklyMenuDTO = WeeklyMenu.toDTO(this.weeklyMenuWithMeals);

      this.weeklyMenuModel.updateWeeklyMenu(dto)
        .then((updatedWeeklyMenu: WeeklyMenuDTO) => {
          this.activeModal.close(updatedWeeklyMenu);
        })
        .catch((error) => {
          //
        });
    }
  }

  search(phrase$: Observable<string>) {
    return phrase$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((phrase: string) => {
        if (phrase && (phrase.length > 2)) {
          return Observable.fromPromise(this.getFilteredMeals(phrase));
        }
        else {
          return Observable.of([]);
        }
      }),
    );
  }

  getFilteredMeals(phrase: string): Promise<MealDTO[]> {
    return this.mealModel.getAllMeals()
      .then((meals: MealDTO[]) => {
        return _.filter(meals, (meal: MealDTO) => {
          return _.includes(meal.name, phrase);
        });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  mealFormatter(meal: MealDTO): string {
    return meal.name;
  }

  onNumberBlur(model: NgModel) {
    // when input type="number", underlying viewModel is always null, until it is a valid number, but the value in the html input is not cleared
    // so we're forcing that
    if (model.viewModel === null) {
      model.control.setValue(null);
    }
  }

  onMealBlur(model: NgModel) {
    // if something is typed by hand, but did not match any meal (nothing selected from typeahead), then clear the input
    if (!(model.viewModel && model.viewModel.id)) {
      model.control.setValue(null);
    }
  }

}
