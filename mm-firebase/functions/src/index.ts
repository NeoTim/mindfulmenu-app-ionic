import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import 'reflect-metadata';
import { classToPlain, plainToClass } from 'class-transformer';
import { FirestoreManager } from './util/FirestoreManager';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { UserDTO } from './data/dto/UserDTO';
import { UserFDTO } from "./data/dto/UserFDTO";

admin.initializeApp(functions.config().firebase).firestore();

const firestoreManager: FirestoreManager = new FirestoreManager();

const corsHandler = cors({
	origin: true
});

/**
 * Get the user object in Firestore
 * 
 * @param userId ID of the User document (same as UID of Auth User object)
 */
const getUser = (userId: string): Promise<UserDTO> => {
    return admin.firestore().collection('users').doc(userId).get()
        .then((documentSnapshot: FirebaseFirestore.DocumentSnapshot) => {
            let result: object = firestoreManager.documentToObject(documentSnapshot);
            let data: UserDTO = plainToClass(UserDTO, result);
            return data;
        })
        .catch((error) => {
            return Promise.reject(error);
        })
};

export const syncLoggedUser = functions.https.onCall((data: any, context: CallableContext) => {
    const userId: string = context.auth.uid;
    const now: Date = new Date();

	return getUser(userId)
		.then((user: UserDTO) => {
            user.lastLoginDate = now;

            return user;
        })
        .then((user: UserDTO) => {
            if (user.automaticUpdateEnabled) {
                return admin.auth().getUser(userId)
                    .then((userRecord: admin.auth.UserRecord) => {
                        user.emailVerified = userRecord.emailVerified;
                        return user;
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    })
            }
            else {
                return user;
            }
        })
        // here you would inject own logic for checking if user paid (similar to the block above) and update a property (new one, probably)
        // then, in the next .then block (or use the one below), you could update isEnabled basing on gathered data (set in user)
        .then((user: UserDTO) => {
            if (user.automaticUpdateEnabled) {
                user.lastAutomaticUpdateDate = now;
            }

            return user;
        })
        .then((user: UserDTO) => {
            return admin.firestore().collection('users').doc(userId).update({
                'emailVerified': user.emailVerified,
                'lastLoginDate': user.lastLoginDate,
                'lastAutomaticUpdateDate': user.lastAutomaticUpdateDate
            })
        })
        .then(() => {
            return getUser(userId)
        })
        .then((user: UserDTO) => {
            return classToPlain(UserFDTO.fromDTO(user));
        })
        .catch((error) => {
            return Promise.reject(error);
		})
});

export const syncUser = functions.https.onCall((data: any, context: CallableContext) => {
	const userId: string = data.userId;
    const now: Date = new Date();

    return getUser(userId)
        .then((user: UserDTO) => {
            if (user.automaticUpdateEnabled) {
                return admin.auth().getUser(userId)
                    .then((userRecord: admin.auth.UserRecord) => {
                        user.emailVerified = userRecord.emailVerified;
                        return user;
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    })
            }
            else {
                return user;
            }
        })
        // here you would inject own logic for checking if user paid (similar to the block above) and update a property (new one, probably)
        // then, in the next .then block (or use the one below), you could update isEnabled basing on gathered data (set in user)
        .then((user: UserDTO) => {
            if (user.automaticUpdateEnabled) {
                user.lastAutomaticUpdateDate = now;
            }

            return user;
        })
        .then((user: UserDTO) => {
            return admin.firestore().collection('users').doc(userId).update({
                'emailVerified': user.emailVerified,
                'lastAutomaticUpdateDate': user.lastAutomaticUpdateDate
            })
        })
        .then(() => {
            return getUser(userId)
        })
        .then((user: UserDTO) => {
            return classToPlain(UserFDTO.fromDTO(user));
        })
        .catch((error) => {
            return Promise.reject(error);
        });
});

export const updateUserFavoriteMealIds = functions.https.onCall((data: any, context: CallableContext) => {
    const userId: string = data.userId;
    const favoriteMealIds: string[] = data.favoriteMealIds;

    return admin.firestore().collection('users').doc(userId).update({ 'favoriteMealIds': favoriteMealIds })
		.then(() => {
            return getUser(userId)
        })
        .then((user: UserDTO) => {
            return classToPlain(UserFDTO.fromDTO(user));
		})
		.catch((error) => {
            return Promise.reject(error);
		});
});

export const createUser = functions.https.onCall((data: any, context: CallableContext) => {
    const userFDTO: UserFDTO = plainToClass(UserFDTO, data.user as object);
    const userDTO: UserDTO = UserFDTO.toDTO(userFDTO);
    const userId: string = data.userId;

    if (userId) {
        return admin.firestore().collection('users').doc(userId).set(classToPlain({
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
                return getUser(userId)
            })
            .then((user: UserDTO) => {
                return classToPlain(UserFDTO.fromDTO(user));
            })
            .catch((error) => {
                return Promise.reject(error);
            });
	}
    else {
    	return admin.firestore().collection('users').add(classToPlain({
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
            .then((documentReference: FirebaseFirestore.DocumentReference) => {
                return getUser(documentReference.id)
            })
            .then((user: UserDTO) => {
                return classToPlain(UserFDTO.fromDTO(user));
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