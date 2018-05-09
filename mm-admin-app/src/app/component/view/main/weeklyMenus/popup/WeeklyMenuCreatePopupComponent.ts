import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { WeeklyMenuModel } from '../../../../../model/WeeklyMenuModel';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MealModel } from '../../../../../model/MealModel';
import { WeeklyMenu } from '../../../../../data/local/menu/WeeklyMenu';
import { Observable } from 'rxjs/Observable';
import { MealDTO } from '../../../../../data/dto/menu/MealDTO';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { WeeklyMenuDTO } from '../../../../../data/dto/menu/WeeklyMenuDTO';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'weekly-menu-create-popup',
  templateUrl: 'WeeklyMenuCreatePopupComponent.html',
  styleUrls: ['WeeklyMenuCreatePopupComponent.css']
})
export class WeeklyMenuCreatePopupComponent implements OnInit {

  weeklyMenuWithMeals: WeeklyMenu = new WeeklyMenu();

  @ViewChild('weeklyMenuForm')
  private weeklyMenuForm: NgForm;

  currentWeekNumber: number = Number(moment().startOf('isoWeek').format('YYYYMMDD'));

  constructor(public activeModal: NgbActiveModal,
              public weeklyMenuModel: WeeklyMenuModel,
              public mealModel: MealModel) {

    this.weeklyMenuWithMeals.meals = [];

    for (let i = 0; i < 7; i++) {
      this.weeklyMenuWithMeals.meals.push(null);
    }

    // typeahead doesn't pass this into the observable chain
    this.search = this.search.bind(this);
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
    this.weeklyMenuForm.onSubmit(null);

    if (this.weeklyMenuForm.form.valid) {
      const dto: WeeklyMenuDTO = WeeklyMenu.toDTO(this.weeklyMenuWithMeals);

      this.weeklyMenuModel.createWeeklyMenu(dto)
        .then((newWeeklyMenu: WeeklyMenuDTO) => {
          this.activeModal.close(newWeeklyMenu);
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
