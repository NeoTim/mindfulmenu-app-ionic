import { Environment } from "../data/local/Environment";
import { Injectable } from "@angular/core";
import { FirebaseConfig } from "../data/local/FirebaseConfig";

@Injectable()
export class ApplicationConfig {

    public applicationOwner: string = 'OurMindfulMenu';
    public applicationName: string = 'OurMindfulMenu';
    public version: string = '0.9.7 (2018-05-17)';

    public production: boolean;
    public firebase: FirebaseConfig;
    public websiteUrl: string;
    public contactEmail: string;

    public environment: string;

    // --

    public static readonly ENVIRONMENT: { [key: string]: string } = {
        LIVE:       'LIVE',
        DEVELOP:    'DEVELOP'
    };

    private readonly environmentConfigs: { [key: string]: Environment } = {
        LIVE: {
          production: true,
          firebase: {
            apiKey: 'AIzaSyB8eA24M8fnJajXZWH7HtuGnuCz4Nq0ZDE',
            authDomain: 'mindful-menu.firebaseapp.com',
            databaseURL: 'https://mindful-menu.firebaseio.com',
            projectId: 'mindful-menu',
            storageBucket: 'mindful-menu.appspot.com',
            messagingSenderId: '415539829999'
          },
          websiteUrl: 'https://www.ourmindfulmenu.com/',
          contactEmail: 'ourmindfulmenu@gmail.com'

        },
        DEVELOP: {
          production: false,
          firebase: {
            apiKey: 'AIzaSyB8eA24M8fnJajXZWH7HtuGnuCz4Nq0ZDE',
            authDomain: 'mindful-menu.firebaseapp.com',
            databaseURL: 'https://mindful-menu.firebaseio.com',
            projectId: 'mindful-menu',
            storageBucket: 'mindful-menu.appspot.com',
            messagingSenderId: '415539829999'
          },
          websiteUrl: 'https://www.ourmindfulmenu.com/',
          contactEmail: 'ourmindfulmenu@gmail.com'
        }
    };

    constructor() {
        this.setEnvironment(ApplicationConfig.ENVIRONMENT.DEVELOP);
    }

    setEnvironment(environmentName: string) {
        if (this.environmentConfigs[environmentName]) {
          this.production = this.environmentConfigs[environmentName].production;
          this.firebase = this.environmentConfigs[environmentName].firebase;
          this.websiteUrl = this.environmentConfigs[environmentName].websiteUrl;
          this.contactEmail = this.environmentConfigs[environmentName].contactEmail;

          this.environment = environmentName;
        }
    }
}

