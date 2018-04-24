import firebase from "firebase";
import { TransformationType } from "class-transformer/TransformOperationExecutor";

export class DateUtil {

  constructor() {
  }

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

}
