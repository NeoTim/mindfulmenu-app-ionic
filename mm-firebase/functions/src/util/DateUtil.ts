import * as moment from 'moment';
import * as _ from "lodash";
import { TransformationType } from "class-transformer/TransformOperationExecutor";

export class DateUtil {

    public static firebaseFirestoreDateToDate(date: Date): Date {
        if (date) {
            return new Date(date);
        }
        else {
            return null;
        }
    }

    public static dateToFirebaseFirestoreDate(date: Date): Date {
        if (date) {
            return new Date(date);
        }
        else {
            // Firestore cannot have the date stored as null or undefined, it has to be a valid date, so we're using the earliest one (Date(0) - Jan 1, 1970) as 'null'
            return new Date(0);
        }
    }

    public static firebaseCloudFunctionISOStringToDate(dateIsoString: string): Date {
        if (!_.isNil(dateIsoString)) {
            return moment(dateIsoString).toDate();
        }
        else {
            return null;
        }
    }

    public static dateToFirebaseCloudFunctionISOString(date: Date): string {
        if (date) {
            return date.toISOString();
        }
        else {
            // Firestore cannot have the date stored as null or undefined, it has to be a valid date, so we're using the earliest one (Date(0) - Jan 1, 1970) as 'null'
            return new Date(0).toISOString();
        }
    }

    // unlike firestore client api, firebase admin api doesn't treat timestamps as separate type, but still uses Date for manipulation (super weird)
    // so this conversion is just Date to Date, but it's here for consistency (and null/undefined checking, see above)
    public static firebaseFirestoreDateConversion(value: any, obj: any, transformationType: TransformationType): any {
        if (transformationType === TransformationType.CLASS_TO_PLAIN) {
            return DateUtil.dateToFirebaseFirestoreDate(value);
        }
        else if (transformationType === TransformationType.PLAIN_TO_CLASS) {
            return DateUtil.firebaseFirestoreDateToDate(value);
        }
    }

    public static firebaseCloudFunctionDateConversion(value: any, obj: any, transformationType: TransformationType): any {
        if (transformationType === TransformationType.CLASS_TO_PLAIN) {
            return DateUtil.dateToFirebaseCloudFunctionISOString(value);
        }
        else if (transformationType === TransformationType.PLAIN_TO_CLASS) {
            return DateUtil.firebaseCloudFunctionISOStringToDate(value);
        }
    }

}
