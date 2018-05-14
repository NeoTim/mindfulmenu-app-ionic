import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { FirestoreManager } from "../util/FirestoreManager";
import firebase from "firebase";
import { IngredientDTO } from "../data/dto/menu/IngredientDTO";

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

}
