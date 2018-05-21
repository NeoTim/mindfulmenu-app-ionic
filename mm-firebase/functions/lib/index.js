"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const UserDTO_1 = require("./data/dto/UserDTO");
const class_transformer_1 = require("class-transformer");
const corsHandler = cors({
    origin: true
});
admin.initializeApp(functions.config().firebase);
/**
 * Get the user object in Firestore, based on Auth UID.
 *
 * @param uid UID of the Auth account, linked to user.
 */
const getUserByUid = function (uid) {
    return new Promise((resolve, reject) => {
        admin.firestore().collection('users').doc(uid).get()
            .then((docSnapshot) => {
            let user = docSnapshot.data();
            user.id = docSnapshot.id;
            resolve(class_transformer_1.plainToClass(UserDTO_1.UserDTO, user));
        }).catch(error => {
            console.error(error);
            reject(error);
        });
    });
};
// This handles SDK calls as well as direct HTTP calls, but doesn't provide auth info.
exports.syncLoggedUserHttp = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, () => {
        if (req.param('uid')) {
            getUserByUid(req.param('uid'))
                .then((user) => {
                let now = new Date();
                user.lastLoginDate = now;
                // Update this user object, async.
                admin.firestore().collection('users').doc(user.id).set({ lastLoginDate: now }, { merge: true })
                    .then((result) => { return; })
                    .catch((error) => { return; });
                res.status(200).json(user);
            }).catch((error) => {
                console.error(error);
                res.status(400).send('There was an issue with database.');
            });
        }
        else {
            res.status(400).send('You must specify parameter `uid`.');
        }
    });
});
// this handles SDK calls only, context already provides current auth state
exports.syncLoggedUser = functions.https.onCall((data, context) => {
    getUserByUid(context.auth.uid)
        .then((user) => {
        let now = new Date();
        user.lastLoginDate = now;
        // Update this user object, async.
        admin.firestore().collection('users').doc(user.id).set({ lastLoginDate: now }, { merge: true })
            .then((result) => { return; })
            .catch((error) => { return; });
        return user;
    }).catch((error) => {
        return { error: error };
    });
});
//# sourceMappingURL=index.js.map