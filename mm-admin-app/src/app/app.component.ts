import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


interface Meal {
  name: string;
  prepTime: number;
  cookTime: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mealCol: AngularFirestoreCollection<Meal>;
  meals: Observable<Meal[]>;
  newMeal: Meal;

  constructor(private afs: AngularFirestore) {
    this.newMeal = {name: "", prepTime: null, cookTime: null};
  }

  ngOnInit() {
    this.mealCol = this.afs.collection('meals');
    this.meals = this.mealCol.valueChanges();
  }

  addMeal() {
    this.mealCol.add(this.newMeal);
  }
}
