import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';
import { FirestoreManager } from '../util/FirestoreManager';
import * as firebase from 'firebase';
import { IngredientDTO } from '../data/dto/menu/IngredientDTO';

@Injectable()
export class IngredientService {

  constructor(private firestoreManager: FirestoreManager) {
  }

  public getIngredient(ingredientId: string): Promise<IngredientDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('ingredients').doc(ingredientId).get()
        .then((documentSnapshot: firebase.firestore.DocumentSnapshot) => {
          let result: object = this.firestoreManager.documentToObject(documentSnapshot);
          let data: IngredientDTO = plainToClass(IngredientDTO, result as object);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getIngredients(ingredientIds: string[]): Promise<IngredientDTO[]> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.getByIds(ingredientIds, this.firestoreManager.firestore.collection('ingredients'))
        .then((documentSnapshots: firebase.firestore.DocumentSnapshot[]) => {
          let result: object[] = this.firestoreManager.documentArrayToObjectArray(documentSnapshots);
          let data: IngredientDTO[] = plainToClass(IngredientDTO, result as object[]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getAllIngredients(): Promise<IngredientDTO[]> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('ingredients').get()
        .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
          let result: object[] = this.firestoreManager.queryToObjectArray(querySnapshot);
          let data: IngredientDTO[] = plainToClass(IngredientDTO, result as object[]);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public createIngredient(ingredient: IngredientDTO): Promise<IngredientDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('ingredients').add(classToPlain(ingredient))
        .then((documentReference: firebase.firestore.DocumentReference) => {
          resolve(this.getIngredient(documentReference.id));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public updateIngredient(ingredient: IngredientDTO): Promise<IngredientDTO> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('ingredients').doc(ingredient.id).update(classToPlain(ingredient))
        .then(() => {
          resolve(this.getIngredient(ingredient.id));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public deleteIngredient(ingredientId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firestoreManager.firestore.collection('ingredients').doc(ingredientId).delete()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}
