"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const FirestoreManager_1 = require("./util/FirestoreManager");
const UserDTO_1 = require("./data/dto/UserDTO");
const UserFDTO_1 = require("./data/dto/UserFDTO");
admin.initializeApp(functions.config().firebase).firestore();
const firestoreManager = new FirestoreManager_1.FirestoreManager();
const corsHandler = cors({
    origin: true
});
/**
 * Get the user object in Firestore
 *
 * @param userId ID of the User document (same as UID of Auth User object)
 */
const getUser = (userId) => {
    return admin.firestore().collection('users').doc(userId).get()
        .then((documentSnapshot) => {
        let result = firestoreManager.documentToObject(documentSnapshot);
        let data = class_transformer_1.plainToClass(UserDTO_1.UserDTO, result);
        return data;
    })
        .catch((error) => {
        return Promise.reject(error);
    });
};
exports.syncLoggedUser = functions.https.onCall((data, context) => {
    const userId = context.auth.uid;
    const now = new Date();
    return getUser(userId)
        .then((user) => {
        user.lastLoginDate = now;
        return user;
    })
        .then((user) => {
        if (user.automaticUpdateEnabled) {
            return admin.auth().getUser(userId)
                .then((userRecord) => {
                user.emailVerified = userRecord.emailVerified;
                return user;
            })
                .catch((error) => {
                return Promise.reject(error);
            });
        }
        else {
            return user;
        }
    })
        // here you would inject own logic for checking if user paid (similar to the block above) and update a property (new one, probably)
        // then, in the next .then block (or use the one below), you could update isEnabled basing on gathered data (set in user)
        .then((user) => {
        if (user.automaticUpdateEnabled) {
            user.lastAutomaticUpdateDate = now;
        }
        return user;
    })
        .then((user) => {
        return admin.firestore().collection('users').doc(userId).update({
            'emailVerified': user.emailVerified,
            'lastLoginDate': user.lastLoginDate,
            'lastAutomaticUpdateDate': user.lastAutomaticUpdateDate
        });
    })
        .then(() => {
        return getUser(userId);
    })
        .then((user) => {
        return class_transformer_1.classToPlain(UserFDTO_1.UserFDTO.fromDTO(user));
    })
        .catch((error) => {
        return Promise.reject(error);
    });
});
exports.syncUser = functions.https.onCall((data, context) => {
    const userId = data.userId;
    const now = new Date();
    return getUser(userId)
        .then((user) => {
        if (user.automaticUpdateEnabled) {
            return admin.auth().getUser(userId)
                .then((userRecord) => {
                user.emailVerified = userRecord.emailVerified;
                return user;
            })
                .catch((error) => {
                return Promise.reject(error);
            });
        }
        else {
            return user;
        }
    })
        // here you would inject own logic for checking if user paid (similar to the block above) and update a property (new one, probably)
        // then, in the next .then block (or use the one below), you could update isEnabled basing on gathered data (set in user)
        .then((user) => {
        if (user.automaticUpdateEnabled) {
            user.lastAutomaticUpdateDate = now;
        }
        return user;
    })
        .then((user) => {
        return admin.firestore().collection('users').doc(userId).update({
            'emailVerified': user.emailVerified,
            'lastAutomaticUpdateDate': user.lastAutomaticUpdateDate
        });
    })
        .then(() => {
        return getUser(userId);
    })
        .then((user) => {
        return class_transformer_1.classToPlain(UserFDTO_1.UserFDTO.fromDTO(user));
    })
        .catch((error) => {
        return Promise.reject(error);
    });
});
exports.updateUserFavoriteMealIds = functions.https.onCall((data, context) => {
    const userId = data.userId;
    const favoriteMealIds = data.favoriteMealIds;
    return admin.firestore().collection('users').doc(userId).update({ 'favoriteMealIds': favoriteMealIds })
        .then(() => {
        return getUser(userId);
    })
        .then((user) => {
        return class_transformer_1.classToPlain(UserFDTO_1.UserFDTO.fromDTO(user));
    })
        .catch((error) => {
        return Promise.reject(error);
    });
});
exports.createUser = functions.https.onCall((data, context) => {
    const userFDTO = class_transformer_1.plainToClass(UserFDTO_1.UserFDTO, data.user);
    const userDTO = UserFDTO_1.UserFDTO.toDTO(userFDTO);
    const userId = data.userId;
    if (userId) {
        return admin.firestore().collection('users').doc(userId).set(class_transformer_1.classToPlain({
            'firstName': userDTO.firstName,
            'lastName': userDTO.lastName,
            'email': userDTO.email,
            'favoriteMealIds': userDTO.favoriteMealIds,
            'emailVerified': false,
            'lastLoginDate': userDTO.lastLoginDate,
            'lastAutomaticUpdateDate': userDTO.lastAutomaticUpdateDate,
            'automaticUpdateEnabled': userDTO.automaticUpdateEnabled,
            'isAdmin': userDTO.isAdmin,
            'isEnabled': false
        }))
            .then(() => {
            return getUser(userId);
        })
            .then((user) => {
            return class_transformer_1.classToPlain(UserFDTO_1.UserFDTO.fromDTO(user));
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
    else {
        return admin.firestore().collection('users').add(class_transformer_1.classToPlain({
            'firstName': userDTO.firstName,
            'lastName': userDTO.lastName,
            'email': userDTO.email,
            'favoriteMealIds': userDTO.favoriteMealIds,
            'emailVerified': false,
            'lastLoginDate': userDTO.lastLoginDate,
            'lastAutomaticUpdateDate': userDTO.lastAutomaticUpdateDate,
            'automaticUpdateEnabled': userDTO.automaticUpdateEnabled,
            'isAdmin': userDTO.isAdmin,
            'isEnabled': false
        }))
            .then((documentReference) => {
            return getUser(documentReference.id);
        })
            .then((user) => {
            return class_transformer_1.classToPlain(UserFDTO_1.UserFDTO.fromDTO(user));
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
});
// This handles SDK calls as well as direct HTTP calls, but doesn't provide auth info.
/*
export const syncLoggedUserHttp = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, () => {
        if (req.param('uid')) {
            getUserById(req.param('uid'))
                .then((user) => {
                    let now = new Date();
                    user.lastLoginDate = now;

                    // Update this user object, async.
                    admin.firestore().collection('users').doc(user.id).set({ lastLoginDate: now }, { merge: true })
                        .then((result) => { return })
                        .catch((error) => { return })

                    res.status(200).json(user);
                }).catch((error) => {
                    console.error(error);
                    res.status(400).send('There was an issue with database.');
                })
        } else {
            res.status(400).send('You must specify parameter `uid`.');
        }
    });
});
*/ 
//# sourceMappingURL=index.js.map