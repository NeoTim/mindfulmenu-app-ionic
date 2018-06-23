import { FirebaseConfig } from "./FirebaseConfig";

export class Environment {

    firebase: FirebaseConfig;

    websiteUrl: string;

    subscriptionUrl: { oneMonth: string, sixMonths: string };

    contactEmail: string;

    googleAnalyticsId: string;

    production: boolean;

}
