import firebase from "firebase";
import * as _ from "lodash";
import * as moment from 'moment';
import { Moment } from "moment";
import { TransformationType } from "class-transformer/TransformOperationExecutor";

export class DateUtil {

  public static firebaseFirestoreTimestampToDate(timestamp: firebase.firestore.Timestamp): Date {
    if (timestamp) {
      return timestamp.toDate();
    }
    else {
      return null;
    }
  }

  public static dateToFirebaseFirestoreTimestamp(date: Date): firebase.firestore.Timestamp {
    if (date) {
      return firebase.firestore.Timestamp.fromDate(date);
    }
    else {
      // Firestore cannot have the date stored as null or undefined, it has to be a valid date, so we're using the earliest one (Date(0) - Jan 1, 1970) as 'null'
      return firebase.firestore.Timestamp.fromDate(new Date(0));
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

  public static firebaseFirestoreDateConversion(value: any, obj: any, transformationType: TransformationType): any {
    if (transformationType === TransformationType.CLASS_TO_PLAIN) {
     return DateUtil.dateToFirebaseFirestoreTimestamp(value);
    }
    else if (transformationType === TransformationType.PLAIN_TO_CLASS) {
      return DateUtil.firebaseFirestoreTimestampToDate(value);
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

  /* "current" week for the app ends on Thursday 4pm - after that, the actual next week is considered "current" */
  public static getFirstDayOfCurrentWeek(): Moment {
    const now: Moment = moment();

    if (((now.day() == 4) && (moment().hour() >= 16)) || (now.day() > 4 || now.day() == 0)) {
      const firstDayOfNextWeek: Moment = moment().add(1, 'week').startOf('isoWeek');
      return firstDayOfNextWeek;
    }
    else {
      const firstDayOfCurrentWeek: Moment = moment().startOf('isoWeek');
      return firstDayOfCurrentWeek;
    }
  }

}
