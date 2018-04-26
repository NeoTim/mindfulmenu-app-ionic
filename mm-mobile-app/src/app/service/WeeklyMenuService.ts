import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { WeeklyMenuDTO } from "../data/dto/menu/WeeklyMenuDTO";
import firebase from "firebase";
import { FirestoreManager } from "../util/FirestoreManager";

@Injectable()
export class WeeklyMenuService {

  constructor(private firestoreManager: FirestoreManager) {
  }

  public getWeeklyMenu(weeklyMenuId: string): Promise<WeeklyMenuDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyMenus').doc(weeklyMenuId).get()
        .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
          let result: object = this.firestoreManager.documentToObject(documentSnapshot);
          let data: WeeklyMenuDTO = plainToClass(WeeklyMenuDTO, result as object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getWeeklyMenuByWeekNumber(weekNumber: number): Promise<WeeklyMenuDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyMenus').where('weekNumber', '==', weekNumber).get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: object = this.firestoreManager.queryToObject(querySnapshot);
          let data: WeeklyMenuDTO = plainToClass(WeeklyMenuDTO, result as object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}
