import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';
import { WeeklyMenuDTO } from '../data/dto/menu/WeeklyMenuDTO';
import * as firebase from 'firebase';
import { FirestoreManager } from '../util/FirestoreManager';
import * as _ from 'lodash';

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

  public getAllWeeklyMenus(): Promise<WeeklyMenuDTO[]> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyMenus').get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: object = this.firestoreManager.queryToObjectArray(querySnapshot);
          let data: WeeklyMenuDTO[] = plainToClass(WeeklyMenuDTO, result as object[]);
          data = _.sortBy(data, o => o.weekNumber).reverse();
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public createWeeklyMenu(weeklyMenu: WeeklyMenuDTO): Promise<WeeklyMenuDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyMenus').add(classToPlain(weeklyMenu))
        .then((documentReference: firebase.firestore.DocumentReference) => {
          resolve(this.getWeeklyMenu(documentReference.id));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public updateWeeklyMenu(weeklyMenu: WeeklyMenuDTO): Promise<WeeklyMenuDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyMenus').doc(weeklyMenu.id).update(classToPlain(weeklyMenu))
        .then(() => {
          resolve(this.getWeeklyMenu(weeklyMenu.id));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public deleteWeeklyMenu(weeklyMenuId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyMenus').doc(weeklyMenuId).delete()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}
