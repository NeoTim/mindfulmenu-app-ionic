import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import { CallableContext } from "firebase-functions/lib/providers/https";
import { UserDTO } from "./data/dto/UserDTO";
import { plainToClass } from 'class-transformer';

const corsHandler = cors({
	origin: true
});

admin.initializeApp(functions.config().firebase);

// This handles SDK calls as well as direct HTTP calls, but doesn't provide auth info.
export const syncUser = functions.https.onRequest((req, res) => {
	return corsHandler(req, res, () => {
		if (req.param('uid')) {
			this.getUserByUid(req.param('uid'))
				.then((user) => {
					res.status(200).json({ user: user });
				}).catch((error) => {
					console.error(error);
					res.status(400).send('There are more than 1 user with this UID.');
				})
		} else {
			res.status(400).send('You must specify parameter `uid`.');
		}
	});
});

// this handles SDK calls only, context already provides current auth state
export const syncLoggedUser = functions.https.onCall((data: any, context: CallableContext) => {

	this.getUserByUid(context.auth.uid)
		.then((user) => {
			return { user: user };
		}).catch((error) => {
			return { error: error };
		})
});

const getUserByUid = function (uid: String): Promise<UserDTO> {
	return new Promise((resolve, reject) => {
		admin.firestore().collection('users').where('UID', '==', uid)
			.limit(1).get()
			.then((querySnapshot) => {
				if (querySnapshot.docs.length === 1) {
					let user = querySnapshot.docs[0].data();
					console.log('User: ' + user.firstName + ' ' + user.lastName);

					resolve(plainToClass(UserDTO, user as object));

					admin.firestore().collection('users').doc(querySnapshot.docs[0].id).set({ lastAccessed: new Date() }, { merge: true })
						.then((result) => { return })
						.catch((error) => { return })
				} else {
					console.error('There are multiple users with the same UID: ' + uid);
					reject(new Error('There is more than 1 user with this UID.'));
				}
			}).catch(error => {
				console.error(error);
				reject(error);
			})
	})
}
