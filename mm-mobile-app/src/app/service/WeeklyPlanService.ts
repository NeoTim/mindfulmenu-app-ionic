import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';
import firebase from "firebase";
import { FirestoreManager } from "../util/FirestoreManager";
import { WeeklyPlanDTO } from "../data/dto/menu/WeeklyPlanDTO";

@Injectable()
export class WeeklyPlanService {

  constructor(private firestoreManager: FirestoreManager) {
  }

  public getWeeklyPlan(weeklyPlanId: string): Promise<WeeklyPlanDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyPlans').doc(weeklyPlanId).get()
        .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
          let result: object = this.firestoreManager.documentToObject(documentSnapshot);
          let data: WeeklyPlanDTO = plainToClass(WeeklyPlanDTO, result as object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getWeeklyPlanByUserIdAndWeekNumber(userId: string, weekNumber: number): Promise<WeeklyPlanDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyPlans').where('weekNumber', '==', weekNumber).where('userId', '==', userId).get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: object = this.firestoreManager.queryToObject(querySnapshot);
          let data: WeeklyPlanDTO = plainToClass(WeeklyPlanDTO, result as object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public createWeeklyPlan(weeklyPlan: WeeklyPlanDTO): Promise<WeeklyPlanDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyPlans').add(classToPlain(weeklyPlan))
        .then((documentReference: firebase.firestore.DocumentReference) => {
          resolve(this.getWeeklyPlan(documentReference.id));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public updateWeeklyPlanMealIds(weeklyPlanId: string, mealIds: string[]): Promise<WeeklyPlanDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyPlans').doc(weeklyPlanId).update( { 'mealIds': mealIds })
        .then(() => {
          resolve(this.getWeeklyPlan(weeklyPlanId));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public updateWeeklyPlanCustomIngredientIds(weeklyPlanId: string, customIngredientIds: string[]): Promise<WeeklyPlanDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyPlans').doc(weeklyPlanId).update( { 'customIngredientIds': customIngredientIds })
        .then(() => {
          resolve(this.getWeeklyPlan(weeklyPlanId));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public updateWeeklyPlanCheckedIngredientIds(weeklyPlanId: string, checkedIngredientIds: string[]): Promise<WeeklyPlanDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('weeklyPlans').doc(weeklyPlanId).update( { 'checkedIngredientIds': checkedIngredientIds })
        .then(() => {
          resolve(this.getWeeklyPlan(weeklyPlanId));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}

