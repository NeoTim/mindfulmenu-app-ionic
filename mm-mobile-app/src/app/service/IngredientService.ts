import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { FirebaseManager } from "../util/FirebaseManager";
import * as _ from "lodash";
import firebase from "firebase";
import { IngredientDTO } from "../data/dto/ingredient/IngredientDTO";

@Injectable()
export class IngredientService {

  constructor(private firebaseManager: FirebaseManager) {
  }

  public getIngredient(ingredientId: string): Promise<IngredientDTO> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.firestore.collection('ingredients').doc(ingredientId).get()
        .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
          let result: Object = this.firebaseManager.documentToObject(documentSnapshot);
          let data: IngredientDTO = plainToClass(IngredientDTO, result as Object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getIngredients(ingredientIds: string[]): Promise<IngredientDTO[]> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.getByIds(ingredientIds, this.firebaseManager.firestore.collection('meals'))
        .then((documentSnapshots: firebase.firestore.DocumentSnapshot[]) => {
          let result: Object[] = _.map(documentSnapshots, (documentSnapshot: firebase.firestore.DocumentSnapshot) => {
            return this.firebaseManager.documentToObject(documentSnapshot);
          });

          let data: IngredientDTO[] = plainToClass(IngredientDTO, result as Object[]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getAllIngredients(): Promise<IngredientDTO[]> {
    return new Promise((resolve, reject) => {
      this.firebaseManager.firestore.collection('ingredients').get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: Object[] = this.firebaseManager.queryToObjectArray(querySnapshot);
          let data: IngredientDTO[] = plainToClass(IngredientDTO, result as Object[]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


}
