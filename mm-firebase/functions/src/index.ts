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

/**
 * Get the user object in Firestore, based on Auth UID.
 * 
 * @param uid UID of the Auth account, linked to user.
 */
const getUserByUid = function (uid: string): Promise<UserDTO> {
	return new Promise((resolve, reject) => {
		admin.firestore().collection('users').doc(uid).get()
			.then((docSnapshot) => {
				let user = docSnapshot.data();
				user.id = docSnapshot.id;

				resolve(plainToClass(UserDTO, user as object));
			}).catch(error => {
				console.error(error);
				reject(error);
			})
	})
}

// This handles SDK calls as well as direct HTTP calls, but doesn't provide auth info.
export const syncLoggedUserHttp = functions.https.onRequest((req, res) => {
	return corsHandler(req, res, () => {
		if (req.param('uid')) {
			getUserByUid(req.param('uid'))
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

// this handles SDK calls only, context already provides current auth state
export const syncLoggedUser = functions.https.onCall((data: any, context: CallableContext) => {

	getUserByUid(context.auth.uid)
		.then((user) => {

			let now = new Date();
			user.lastLoginDate = now;

			// Update this user object, async.
			admin.firestore().collection('users').doc(user.id).set({ lastLoginDate: now }, { merge: true })
				.then((result) => { return })
				.catch((error) => { return })

			return user;

		}).catch((error) => {
			return { error: error };
		})
});


