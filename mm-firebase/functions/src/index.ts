import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import { CallableContext } from "firebase-functions/lib/providers/https";

const corsHandler = cors({
	origin: true 
});

admin.initializeApp(functions.config().firebase);

// this handles SDK calls as well as direct HTTP calls
export const addTest = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, () => {
    	let newText: string = '';

    	// SDK call passing data json object with properties
    	if (req.body.data && req.body.data.text) {
    		newText = req.body.data.text;
		}
		// direct HTTP call passing data in http query parameter
		else if (req.query.text) {
    		newText = req.query.text;
		}

	    admin.firestore().collection('test').add( {'text': newText } )
			.then( (snapshot) => {
				// you should return json object with data property and your result inside if you want to conform to Firebase SDK protocol
				res.status(200).json({ data: { result: 'OK', snapshot: snapshot } });
			})
			.catch( () => {
				res.sendStatus(500);
			});
   })
});

// this handles SDK calls only, context already provides current auth state
export const addTest2 = functions.https.onCall((data: any, context: CallableContext) => {
	let newText: string = data.text;

	return admin.firestore().collection('test').add( {'text': newText } )
		.then( (snapshot) => {
			return { result: 'OK', snapshot: snapshot };
		})
		.catch( () => {
			return { result: 'ERROR' };
		});
});
