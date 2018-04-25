"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const corsHandler = cors({
    origin: true
});
admin.initializeApp(functions.config().firebase);
// this handles SDK calls as well as direct HTTP calls
exports.addTest = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, () => {
        let newText = '';
        // SDK call passing data json object with properties
        if (req.body.data && req.body.data.text) {
            newText = req.body.data.text;
        }
        // direct HTTP call passing data in http query parameter
        else if (req.query.text) {
            newText = req.query.text;
        }
        admin.firestore().collection('test').add({ 'text': newText })
            .then((snapshot) => {
            // you should return json object with data property and your result inside if you want to conform to Firebase SDK protocol
            res.status(200).json({ data: { result: 'OK', snapshot: snapshot } });
        })
            .catch(() => {
            res.sendStatus(500);
        });
    });
});
// this handles SDK calls only, context already provides current auth state
exports.addTest2 = functions.https.onCall((data, context) => {
    let newText = data.text;
    return admin.firestore().collection('test').add({ 'text': newText })
        .then((snapshot) => {
        return { result: 'OK', snapshot: snapshot };
    })
        .catch(() => {
        return { result: 'ERROR' };
    });
});
//# sourceMappingURL=index.js.map