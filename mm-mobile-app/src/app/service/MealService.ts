import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import firebase from "firebase";
import { MealDTO } from "../data/dto/menu/MealDTO";
import { FirestoreManager } from "../util/FirestoreManager";

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


}
