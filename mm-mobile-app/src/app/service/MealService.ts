import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { FirebaseManager } from "../util/FirebaseManager";
import * as _ from "lodash";
import firebase from "firebase";
import { MealDTO } from "../data/dto/meal/MealDTO";

@Injectable()
export class MealService {

  constructor(private firebaseManager: FirebaseManager) {
  }

  public getMeal(mealId: string): Promise<MealDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.firestore.collection('meals').doc(mealId).get()
        .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
          let result: Object = this.firebaseManager.documentToObject(documentSnapshot);
          let data: MealDTO = plainToClass(MealDTO, result as Object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getMeals(mealIds: string[]): Promise<MealDTO[]> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.getByIds(mealIds, this.firebaseManager.firestore.collection('meals'))
        .then((documentSnapshots: firebase.firestore.DocumentSnapshot[]) => {
          let result: Object[] = _.map(documentSnapshots, (documentSnapshot: firebase.firestore.DocumentSnapshot) => {
            return this.firebaseManager.documentToObject(documentSnapshot);
          });

          let data: MealDTO[] = plainToClass(MealDTO, result as Object[]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


}
