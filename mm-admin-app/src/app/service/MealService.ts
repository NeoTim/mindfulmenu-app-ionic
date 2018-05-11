import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';
import * as firebase from 'firebase';
import { MealDTO } from '../data/dto/menu/MealDTO';
import { FirestoreManager } from '../util/FirestoreManager';
import * as _ from 'lodash';

@Injectable()
export class MealService {

  constructor(private firestoreManager: FirestoreManager) {
  }

  public getMeal(mealId: string): Promise<MealDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('meals').doc(mealId).get()
        .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
          let result: object = this.firestoreManager.documentToObject(documentSnapshot);
          let data: MealDTO = plainToClass(MealDTO, result as object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getMeals(mealIds: string[]): Promise<MealDTO[]> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.getByIds(mealIds, this.firestoreManager.firestore.collection('meals'))
        .then((documentSnapshots: firebase.firestore.DocumentSnapshot[]) => {
          let result: object[] = this.firestoreManager.documentArrayToObjectArray(documentSnapshots);
          let data: MealDTO[] = plainToClass(MealDTO, result as object[]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getAllMeals(): Promise<MealDTO[]> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('meals').get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: object = this.firestoreManager.queryToObjectArray(querySnapshot);
          let data: MealDTO[] = plainToClass(MealDTO, result as object[]);
          data = _.sortBy(data, o => o.name);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public createMeal(meal: MealDTO): Promise<MealDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('meals').add(classToPlain(meal))
        .then((documentReference: firebase.firestore.DocumentReference) => {
          resolve(this.getMeal(documentReference.id));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public updateMeal(meal: MealDTO): Promise<MealDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('meals').doc(meal.id).update(classToPlain(meal))
        .then(() => {
          resolve(this.getMeal(meal.id));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public deleteMeal(mealId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('meals').doc(mealId).delete()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


}
