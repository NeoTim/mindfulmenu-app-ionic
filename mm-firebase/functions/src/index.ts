import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import 'reflect-metadata';
import { classToPlain, plainToClass } from 'class-transformer';
import { FirestoreManager } from './util/FirestoreManager';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { UserDTO } from './data/dto/UserDTO';
import { UserFDTO } from "./data/dto/UserFDTO";
import * as nodemailer from 'nodemailer';

admin.initializeApp(functions.config().firebase).firestore();

const firestoreManager: FirestoreManager = new FirestoreManager();

const corsHandler = cors({
    origin: true
});

/**
 *      START EMAIL CONFIG
 */

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

// Sends a welcome email to the given user.
const sendWelcomeEmail = (email, displayName) => {
    const mailOptions = {
        from: `Mindful Menu Team <` + gmailEmail + `>`,
        to: email,
        subject: `Welcome to Mindful Menu!`,
        text: `Hey ${displayName || ''}! Welcome to Mindful Menu. I hope you will enjoy our service.`
    };

    return mailTransport.sendMail(mailOptions)
    .then(() => {
        console.log('New welcome email sent to:', email);
        return;
    })
    .catch((error) => {
        return Promise.reject(error);
    });
}

// Sends a notification email to admin, that new user has registered
const sendAdminNewUserEmail = (userName, userEmail) => {
    const mailOptions = {
        from: `Mindful Menu Team <` + gmailEmail + `>`,
        to: `ourmindfulmenu@gmail.com`,
        subject: `New user registered`,
        text: `${userName || ''} (${userEmail || ''}) has just registered a new account through the Mindful Menu app.`
    };

    return mailTransport.sendMail(mailOptions)
    .then(() => {
        return;
    })
    .catch((error) => {
        return Promise.reject(error);
    });
}

/**
 * This handles SDK calls as well as direct HTTP calls
 * 
 * GET sample: 
 *   https://us-central1-mindful-menu.cloudfunctions.net/testEmail?email=jared%40chanlhealth.com&name=Jared
 */
export const testEmail = functions.https.onRequest((req, res) => {
	return corsHandler(req, res, () => {
        sendWelcomeEmail(req.query.email, req.query.name)
        .then(() => {
            res.status(200).send("Email successfully sent.");
        }).catch((error) => {
            res.status(500).send(error);
        })
	})
});

/**
 *      START USER MANAGEMENT
 */

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
                if (user.emailVerified /* && and other logic, like, if user paid, etc. */) {
                    user.isEnabled = true;
                }
                else {
                    user.isEnabled = false;
                }
            }

            return user;
        })
        .then((user: UserDTO) => {
            if (user.automaticUpdateEnabled) {
                user.lastAutomaticUpdateDate = now;
            }

            return user;
        })
        .then((user: UserDTO) => {
            return admin.firestore().collection('users').doc(userId).update({
                'isEnabled': user.isEnabled,
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
                if (user.emailVerified /* && and other logic, like, if user paid, etc. */) {
                    user.isEnabled = true;
                }
                else {
                    user.isEnabled = false;
                }
            }

            return user;
        })
        .then((user: UserDTO) => {
            if (user.automaticUpdateEnabled) {
                user.lastAutomaticUpdateDate = now;
            }

            return user;
        })
        .then((user: UserDTO) => {
            return admin.firestore().collection('users').doc(userId).update({
                'isEnabled': user.isEnabled,
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
                sendAdminNewUserEmail(user.firstName + " " + user.lastName, user.email)
                .then(() => {return;})
                .catch((error) => {return;})
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
                sendAdminNewUserEmail(user.firstName + " " + user.lastName, user.email)
                .then(() => {return;})
                .catch((error) => {return;})
                return classToPlain(UserFDTO.fromDTO(user));
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }
});

export const updateUser = functions.https.onCall((data: any, context: CallableContext) => {
    const userFDTO: UserFDTO = plainToClass(UserFDTO, data.user as object);
    const userDTO: UserDTO = UserFDTO.toDTO(userFDTO);
    const userId: string = data.userId;

    return getUser(userId)
        .then((user: UserDTO) => {
            if (user.isEnabled !== userDTO.isEnabled) {
                userDTO.automaticUpdateEnabled = false;
            }
            else {
                userDTO.automaticUpdateEnabled = true;
            }

            return userDTO;
        })
        .then((user: UserDTO) => {
            return admin.firestore().collection('users').doc(userId).update(classToPlain({
                'firstName': userDTO.firstName,
                'lastName': userDTO.lastName,
                'automaticUpdateEnabled': userDTO.automaticUpdateEnabled,
                'isAdmin': userDTO.isAdmin,
                'isEnabled': userDTO.isEnabled
            }))
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

export const enableAutomaticUpdateForUser = functions.https.onCall((data: any, context: CallableContext) => {
    const userId: string = data.userId;

    return admin.firestore().collection('users').doc(userId).update(classToPlain({ 'automaticUpdateEnabled': true }))
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
