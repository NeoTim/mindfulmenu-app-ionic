"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.addTest = functions.https.onRequest((req, res) => {
    const original = req.query.text;
    admin.firestore().collection('test').add({ "text": original })
        .then((snapshot) => {
        res.status(200).send(snapshot);
    })
        .catch(() => {
        res.status(400).send();
    });
});
//# sourceMappingURL=index.js.map