import * as _ from 'lodash';

export class FirestoreManager {

  public queryToObjectArray(querySnapshot: FirebaseFirestore.QuerySnapshot): object[] {
    let result: object[] = _.map(querySnapshot.docs, (queryDocumentSnapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
      let obj: object = queryDocumentSnapshot.data();

      if (!_.isNil(obj)) {
        obj['id'] = queryDocumentSnapshot.id;
        return obj;
      }
      else {
        return null;
      }
    });

    return _.without(result, null);
  }

  // for queries from which you expect only one unique result (array with single object)
  public queryToObject(querySnapshot: FirebaseFirestore.QuerySnapshot): object {
    let result: object[] = this.queryToObjectArray(querySnapshot);

    if (result) {
      if (result.length === 1) {
        if (!_.isNil(result[0])) {
          return result[0];
        }
        else {
          return null;
        }
      }
      else {
        // if there's more than one or none at all, then it's unexpected result
        return null;
      }
    }
    else {
      return null;
    }
  }

  public documentArrayToObjectArray(documentSnapshots: FirebaseFirestore.DocumentSnapshot[]): object[] {
    let result: object[] = _.map(documentSnapshots, (documentSnapshot: FirebaseFirestore.DocumentSnapshot) => {
      return this.documentToObject(documentSnapshot);
    });

    return _.without(result, null);
  }

  public documentToObject(documentSnapshot: FirebaseFirestore.DocumentSnapshot): object {
    let obj: object = documentSnapshot.data();

    if (!_.isNil(obj)) {
      obj['id'] = documentSnapshot.id;
      return obj;
    }
    else {
      return null;
    }
  }

  public stripUndefined(obj: any): any {
    return _.omitBy(obj, _.isUndefined);
  }

  public getByIds(idArray: string[], collection: FirebaseFirestore.CollectionReference): Promise<FirebaseFirestore.DocumentSnapshot[]> {
    return new Promise((resolve, reject) => {
      if (_.isNil(idArray)) {
        reject(null);
      }
      else if (idArray.length === 0) {
        resolve([]);
      }
      else {
        let successCount: number = 0;
        let errorCount: number = 0;
        let totalCount: number = idArray.length;

        let items: FirebaseFirestore.DocumentSnapshot[] = [];

        for (let id of idArray) {
          collection.doc(id).get()
            .then((documentSnapshot: FirebaseFirestore.DocumentSnapshot) => {
              items.push(documentSnapshot);
              successCount++;

              if ((successCount + errorCount) === totalCount) {
                resolve(items);
              }
            })
            .catch((error) => {
              errorCount++;

              if (errorCount === totalCount) {
                reject(error);
              }
              else if ((successCount + errorCount) === totalCount) {
                resolve(items);
              }
            });
        }
      }
    });
  }

}
