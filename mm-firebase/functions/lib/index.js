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
const nodemailer = require("nodemailer");
const Email = require("email-templates");
admin.initializeApp(functions.config().firebase).firestore();
const firestoreManager = new FirestoreManager_1.FirestoreManager();
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
const sendWelcomeEmail = (address, displayName) => {
    const email = new Email({
        message: {
            from: `Mindful Menu Team <` + gmailEmail + `>`
        },
        send: true,
        transport: mailTransport
    });
    return email
        .send({
        template: 'welcome',
        message: {
            to: address
        },
        locals: {
            name: displayName
        }
    });
    // const mailOptions = {
    //     from: `Mindful Menu Team <` + gmailEmail + `>`,
    //     to: email,
    //     subject: `Welcome to Mindful Menu!`,
    //     text: `Hey ${displayName || ''}! Welcome to Mindful Menu. I hope you will enjoy our service.`
    // };
    // return mailTransport.sendMail(mailOptions)
    // .then(() => {
    //     console.log('New welcome email sent to:', email);
    //     return;
    // })
    // .catch((error) => {
    //     return Promise.reject(error);
    // });
};
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
};
/**
 * This handles SDK calls as well as direct HTTP calls
 *
 * GET sample:
 *   https://us-central1-mindful-menu.cloudfunctions.net/testEmail?email=jared%40chanlhealth.com&name=Jared
 */
exports.testEmail = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, () => {
        sendWelcomeEmail(req.query.email, req.query.name)
            .then((result) => {
            console.log('result.originalMessage', result.originalMessage);
            res.status(200).send("Email successfully sent.");
        }).catch((error) => {
            res.status(500).send(error);
        });
    });
});
/**
 *      START USER MANAGEMENT
 */
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
            if (user.emailVerified /* && and other logic, like, if user paid, etc. */) {
                user.isEnabled = true;
            }
            else {
                user.isEnabled = false;
            }
        }
        return user;
    })
        .then((user) => {
        if (user.automaticUpdateEnabled) {
            user.lastAutomaticUpdateDate = now;
        }
        return user;
    })
        .then((user) => {
        return admin.firestore().collection('users').doc(userId).update({
            'isEnabled': user.isEnabled,
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
            if (user.emailVerified /* && and other logic, like, if user paid, etc. */) {
                user.isEnabled = true;
            }
            else {
                user.isEnabled = false;
            }
        }
        return user;
    })
        .then((user) => {
        if (user.automaticUpdateEnabled) {
            user.lastAutomaticUpdateDate = now;
        }
        return user;
    })
        .then((user) => {
        return admin.firestore().collection('users').doc(userId).update({
            'isEnabled': user.isEnabled,
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
            sendAdminNewUserEmail(user.firstName + " " + user.lastName, user.email)
                .then(() => { return; })
                .catch((error) => { return; });
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
            sendAdminNewUserEmail(user.firstName + " " + user.lastName, user.email)
                .then(() => { return; })
                .catch((error) => { return; });
            return class_transformer_1.classToPlain(UserFDTO_1.UserFDTO.fromDTO(user));
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
});
exports.updateUser = functions.https.onCall((data, context) => {
    const userFDTO = class_transformer_1.plainToClass(UserFDTO_1.UserFDTO, data.user);
    const userDTO = UserFDTO_1.UserFDTO.toDTO(userFDTO);
    const userId = data.userId;
    return getUser(userId)
        .then((user) => {
        if (user.isEnabled !== userDTO.isEnabled) {
            userDTO.automaticUpdateEnabled = false;
        }
        else {
            userDTO.automaticUpdateEnabled = true;
        }
        return userDTO;
    })
        .then((user) => {
        return admin.firestore().collection('users').doc(userId).update(class_transformer_1.classToPlain({
            'firstName': userDTO.firstName,
            'lastName': userDTO.lastName,
            'automaticUpdateEnabled': userDTO.automaticUpdateEnabled,
            'isAdmin': userDTO.isAdmin,
            'isEnabled': userDTO.isEnabled
        }));
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
exports.enableAutomaticUpdateForUser = functions.https.onCall((data, context) => {
    const userId = data.userId;
    return admin.firestore().collection('users').doc(userId).update(class_transformer_1.classToPlain({ 'automaticUpdateEnabled': true }))
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
//# sourceMappingURL=index.js.map