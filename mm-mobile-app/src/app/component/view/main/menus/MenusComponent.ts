import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'menus',
  templateUrl: 'MenusComponent.html'
})
export class MenusComponent {

  ingredients: Observable<any[]>;

  constructor(public navCtrl: NavController,
              public db: AngularFirestore) {
  }

  ionViewDidLoad() {
    this.init();
  }

  init() {
    this.ingredients = this.db.collection('ingredients').valueChanges();
    this.ingredients.subscribe(value => {
      console.log(value);

      let meal = this.db.collection('meals', (ref) => ref.where('id', '==', value[0].mealId)).valueChanges();
      meal.subscribe(value => {
        console.log(value);
      })
    });

    let test = this.db.collection('test').valueChanges();
    test.subscribe(value => {
      console.log(value[2]['testDate'].toDate());
    })
  }
}
