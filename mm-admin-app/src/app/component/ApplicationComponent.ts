import { Component } from '@angular/core';
import { MealDTO } from '../data/dto/MealDTO'
import { WeeklyMenuDTO } from '../data/dto/WeeklyMenuDTO';

@Component({
  selector: 'app-root',
  templateUrl: './ApplicationComponent.html',
  styleUrls: ['./ApplicationComponent.css']
})
export class AppComponent {
  newMeal: MealDTO;
  meals: MealDTO[] = [];
  menus: WeeklyMenuDTO[] = [];

  constructor() {
    this.newMeal = {name: "", prepTime: null, cookTime: null};
    this.meals.push({name: "Chicken Marsala", prepTime: 5, cookTime: 25});
    this.menus.push({weekNumber: 20180423, startDate: new Date(), endDate: new Date(), publishDate: new Date(), mealIds: []});
  }

  ngOnInit() {
    
  }

  addMeal() {
    
  }
}
