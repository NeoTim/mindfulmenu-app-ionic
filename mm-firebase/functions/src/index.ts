import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import { CallableContext } from "firebase-functions/lib/providers/https";

const corsHandler = cors({
	origin: true
});

admin.initializeApp(functions.config().firebase);

// This is called to get the proper user object after authentication
export const getUser = functions.https.onRequest((req, res) => {
	return corsHandler(req, res, () => {

		if (req.param('uid')) {
			// Find the user
			admin.firestore().collection('users').where('UID', '==', req.param('uid'))
				.limit(1).get()
				.then(results => {
					if (results.docs.length === 1) {
						let user = results.docs[0].data();
						console.log('User: ' + user.firstName + ' ' + user.lastName);
						res.status(200).json({ user: user });

						admin.firestore().collection('users').doc(results.docs[0].id).set({ lastAccessed: new Date() }, { merge: true })
							.then((result) => { return })
							.catch((error) => { return })
					} else {
						console.error('There are multiple users with the same UID: ' + req.body.data.uid);
						res.status(400).send('There are more than 1 user with this UID.');
					}
				}).catch(error => {
					console.error(error);
					res.sendStatus(500);
				})
		} else {
			res.status(400).send('You must specify parameter `uid`.');
		}

	});
});

// this handles SDK calls as well as direct HTTP calls
// export const addTest = functions.https.onRequest((req, res) => {
// 	return corsHandler(req, res, () => {
// 		let newText: string = '';

// 		// SDK call passing data json object with properties
// 		if (req.body.data && req.body.data.text) {
// 			newText = req.body.data.text;
// 		}
// 		// direct HTTP call passing data in http query parameter
// 		else if (req.query.text) {
// 			newText = req.query.text;
// 		}

// 		admin.firestore().collection('test').add({ 'text': newText })
// 			.then((snapshot) => {
// 				// you should return json object with data property and your result inside if you want to conform to Firebase SDK protocol
// 				res.status(200).json({ data: { result: 'OK', snapshot: snapshot } });
// 			})
// 			.catch(() => {
// 				res.sendStatus(500);
// 			});
// 	})
// });

// this handles SDK calls only, context already provides current auth state
// export const addTest2 = functions.https.onCall((data: any, context: CallableContext) => {
// 	let newText: string = data.text;

// 	return admin.firestore().collection('test').add({ 'text': newText })
// 		.then((snapshot) => {
// 			return { result: 'OK', snapshot: snapshot };
// 		})
// 		.catch(() => {
// 			return { result: 'ERROR' };
// 		});
// });
