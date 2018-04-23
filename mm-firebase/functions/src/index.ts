import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

export const addTest = functions.https.onRequest((req, res) => {
    const original = req.query.text;

    admin.firestore().collection('test').add({"text": original})
    .then( (snapshot) => {
        res.status(200).send(snapshot);
    })
    .catch( () => {
        res.status(400).send();
    });
  });
