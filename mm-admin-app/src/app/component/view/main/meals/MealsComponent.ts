import { Component, OnInit } from '@angular/core';
import { MealDTO } from '../../../../data/dto/menu/MealDTO';
import { MealModel } from '../../../../model/MealModel';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MealEditPopupComponent } from './popup/MealEditPopupComponent';
import { MealCreatePopupComponent } from './popup/MealCreatePopupComponent';
import { IngredientModel } from '../../../../model/IngredientModel';

@Component({
  selector: 'meals',
  templateUrl: 'MealsComponent.html',
  styleUrls: ['MealsComponent.scss']
})
export class MealsComponent implements OnInit {

  meals: MealDTO[];

  constructor(public toastrService: ToastrService,
    public mealModel: MealModel,
    public modalService: NgbModal,
    public ingredientModel: IngredientModel) {
  }

  ngOnInit() {
    this.getAllMeals();
  }

  getAllMeals() {
    this.mealModel.getAllMeals()
      .then((meals: MealDTO[]) => {
        this.meals = meals;
      })
      .catch((error) => { });
  }

  addMeal() {
    const modalRef = this.modalService.open(MealCreatePopupComponent, { size: 'lg', centered: true });

    modalRef.result
      .then((closeResult: any) => {
        if (closeResult instanceof MealDTO) {
          this.getAllMeals();
        }
      })
      .catch((dismissReason: any) => {

      });
  }

  editMeal(meal: MealDTO) {
    const modalRef = this.modalService.open(MealEditPopupComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.meal = meal;

    modalRef.result
      .then((closeResult: any) => {
        if (closeResult instanceof MealDTO) {
          this.getAllMeals();
        }
      })
      .catch((dismissReason: any) => {

      });
  }

  deleteMeal(meal: MealDTO) {
    meal.ingredientIds.forEach((id) => {
      this.ingredientModel.deleteIngredient(id)
        .then(() => { })
        .catch(() => { })
    })

    this.mealModel.deleteMeal(meal.id)
      .then(() => {
        this.toastrService.success('Meal removed!', 'Success');
        this.getAllMeals();
      })
      .catch((error) => { });
  }
}
