"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const _ = require("lodash");
const TransformOperationExecutor_1 = require("class-transformer/TransformOperationExecutor");
class DateUtil {
    static firebaseFirestoreDateToDate(date) {
        if (date) {
            return new Date(date);
        }
        else {
            return null;
        }
    }
    static dateToFirebaseFirestoreDate(date) {
        if (date) {
            return new Date(date);
        }
        else {
            // Firestore cannot have the date stored as null or undefined, it has to be a valid date, so we're using the earliest one (Date(0) - Jan 1, 1970) as 'null'
            return new Date(0);
        }
    }
    static firebaseCloudFunctionISOStringToDate(dateIsoString) {
        if (!_.isNil(dateIsoString)) {
            return moment(dateIsoString).toDate();
        }
        else {
            return null;
        }
    }
    static dateToFirebaseCloudFunctionISOString(date) {
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
    static firebaseFirestoreDateConversion(value, obj, transformationType) {
        if (transformationType === TransformOperationExecutor_1.TransformationType.CLASS_TO_PLAIN) {
            return DateUtil.dateToFirebaseFirestoreDate(value);
        }
        else if (transformationType === TransformOperationExecutor_1.TransformationType.PLAIN_TO_CLASS) {
            return DateUtil.firebaseFirestoreDateToDate(value);
        }
    }
    static firebaseCloudFunctionDateConversion(value, obj, transformationType) {
        if (transformationType === TransformOperationExecutor_1.TransformationType.CLASS_TO_PLAIN) {
            return DateUtil.dateToFirebaseCloudFunctionISOString(value);
        }
        else if (transformationType === TransformOperationExecutor_1.TransformationType.PLAIN_TO_CLASS) {
            return DateUtil.firebaseCloudFunctionISOStringToDate(value);
        }
    }
}
exports.DateUtil = DateUtil;
//# sourceMappingURL=DateUtil.js.map