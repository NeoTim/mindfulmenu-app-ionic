import { Environment } from "../data/local/Environment";
import { Injectable } from "@angular/core";

@Injectable()
export class ApplicationConfig {

    public static ENVIRONMENTS: { [key: string]: string } = {
        ENV_LIVE:       'ENV_LIVE',
        ENV_DEVELOP:    'ENV_DEVELOP'
    };

    private environmentConfigs: { [key: string]: Environment } = {
        ENV_LIVE: {
          firebase: {
            apiKey: 'AIzaSyB8eA24M8fnJajXZWH7HtuGnuCz4Nq0ZDE',
            authDomain: 'mindful-menu.firebaseapp.com',
            databaseURL: 'https://mindful-menu.firebaseio.com',
            projectId: 'mindful-menu',
            storageBucket: 'mindful-menu.appspot.com',
            messagingSenderId: '415539829999'
          },
          websiteUrl: 'https://www.ourmindfulmenu.com/'
        },
        ENV_DEVELOP: {
          firebase: {
            apiKey: 'AIzaSyB8eA24M8fnJajXZWH7HtuGnuCz4Nq0ZDE',
            authDomain: 'mindful-menu.firebaseapp.com',
            databaseURL: 'https://mindful-menu.firebaseio.com',
            projectId: 'mindful-menu',
            storageBucket: 'mindful-menu.appspot.com',
            messagingSenderId: '415539829999'
          },
          websiteUrl: 'https://www.ourmindfulmenu.com/'
        }
    };

    public ENV: Environment;
    public ENV_NAME: string;

    constructor() {
        this.setEnvironment(ApplicationConfig.ENVIRONMENTS.ENV_DEVELOP);
    }

    setEnvironment(environmentName: string) {
        if (this.environmentConfigs[environmentName]) {
            this.ENV = this.environmentConfigs[environmentName];
            this.ENV_NAME = environmentName;
        }
    }
}

