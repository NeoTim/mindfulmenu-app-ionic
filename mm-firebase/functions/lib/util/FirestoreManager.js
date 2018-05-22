"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class FirestoreManager {
    queryToObjectArray(querySnapshot) {
        let result = _.map(querySnapshot.docs, (queryDocumentSnapshot) => {
            let obj = queryDocumentSnapshot.data();
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
    queryToObject(querySnapshot) {
        let result = this.queryToObjectArray(querySnapshot);
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
    documentArrayToObjectArray(documentSnapshots) {
        let result = _.map(documentSnapshots, (documentSnapshot) => {
            return this.documentToObject(documentSnapshot);
        });
        return _.without(result, null);
    }
    documentToObject(documentSnapshot) {
        let obj = documentSnapshot.data();
        if (!_.isNil(obj)) {
            obj['id'] = documentSnapshot.id;
            return obj;
        }
        else {
            return null;
        }
    }
    stripUndefined(obj) {
        return _.omitBy(obj, _.isUndefined);
    }
    getByIds(idArray, collection) {
        return new Promise((resolve, reject) => {
            if (_.isNil(idArray)) {
                reject(null);
            }
            else if (idArray.length === 0) {
                resolve([]);
            }
            else {
                let successCount = 0;
                let errorCount = 0;
                let totalCount = idArray.length;
                let items = [];
                for (let id of idArray) {
                    collection.doc(id).get()
                        .then((documentSnapshot) => {
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
exports.FirestoreManager = FirestoreManager;
//# sourceMappingURL=FirestoreManager.js.map