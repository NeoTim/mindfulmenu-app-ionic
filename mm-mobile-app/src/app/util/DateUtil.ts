import firebase from "firebase";
import * as moment from 'moment';
import { Moment } from "moment";
import { TransformationType } from "class-transformer/TransformOperationExecutor";

export class DateUtil {

  public static firebaseTimestampToDate(timestamp: firebase.firestore.Timestamp): Date {
    return timestamp.toDate();
  }

  public static dateToFirebaseTimestamp(date: Date): firebase.firestore.Timestamp {
    return firebase.firestore.Timestamp.fromDate(date);
  }

  public static firebaseDateConversion(value: any, obj: any, transformationType: TransformationType): Date | firebase.firestore.Timestamp {
    if (transformationType === TransformationType.CLASS_TO_PLAIN) {
     return DateUtil.dateToFirebaseTimestamp(value);
    }
    else if (transformationType === TransformationType.PLAIN_TO_CLASS) {
      return DateUtil.firebaseTimestampToDate(value);
    }
  }

  /* "current" week for the app ends on Thursday 4pm - after that, the actual next week is considered "current" */
  public static getFirstDayOfCurrentWeek(): Moment {
    const now: Moment = moment();

    if (((now.day() == 4) && (moment().hour() >= 16)) || (now.day() > 4)) {
      const firstDayOfNextWeek: Moment = moment().add(1, 'week').startOf('isoWeek');
      return firstDayOfNextWeek;
    }
    else {
      const firstDayOfCurrentWeek: Moment = moment().startOf('isoWeek');
      return firstDayOfCurrentWeek;
    }
  }

}
