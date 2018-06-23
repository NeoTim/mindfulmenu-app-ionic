import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { ApplicationConfig } from "../config/ApplicationConfig";
import { Event } from "../common/Event";
import { FirebaseCredentialsDTO } from "../data/dto/auth/FirebaseCredentialsDTO";
import { PlatformUtil } from "../util/PlatformUtil";

@Injectable()
export class GoogleAnalyticsModel {

  public googleAnalyticsInitializing: boolean = false;
  public googleAnalyticsReady: boolean = false;

  constructor(private events: Events,
              private storage: Storage,
              private config: ApplicationConfig,
              private platformUtil: PlatformUtil,
              private googleAnalytics: GoogleAnalytics) {

    this.setupListeners();

    if (platformUtil.isCordova()) {
      this.googleAnalyticsInitializing = true;

      this.googleAnalytics.startTrackerWithId(config.googleAnalyticsId)
        .then(() => {
          return this.googleAnalytics.setAppVersion(config.version);
        })
        .then(() => {
          // not sure if you want this
          return this.googleAnalytics.setAllowIDFACollection(true)
        })
        .then(() => {
          this.googleAnalyticsInitializing = false;
          this.googleAnalyticsReady = true;
        })
        .catch((error) => {
          this.googleAnalyticsInitializing = false;
          this.googleAnalyticsReady = false;

          console.log('Error starting Google Analytics', error)
        });
    }
  }

  private setupListeners(): void {
    this.events.subscribe(Event.AUTH.LOGIN.SUCCESS, (credentials: FirebaseCredentialsDTO) => {
      this.waitForGoogleAnalytics()
        .then(() => {
          this.googleAnalytics.setUserId(credentials.uid)
            .then(() => {})
            .catch((error) => { console.log(error) });
        })
        .catch((error) => {})
    });
    this.events.subscribe(Event.AUTH.LOGOUT.SUCCESS, () => {
      this.waitForGoogleAnalytics()
        .then(() => {
          this.googleAnalytics.setUserId(null)
            .then(() => {})
            .catch((error) => { console.log(error) });
        })
        .catch((error) => {})
    });
  }

  public waitForGoogleAnalytics(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.googleAnalyticsInitializing) {
        if (this.googleAnalyticsReady) {
          resolve();
        }
        else {
          reject();
        }
      }
      else {
        const googleAnalyticsWaitIntervalId: any = setInterval(() => {
          if (!this.googleAnalyticsInitializing) {
            clearInterval(googleAnalyticsWaitIntervalId);

            if (this.googleAnalyticsReady) {
              resolve();
            }
            else {
              reject();
            }
          }
        }, 10);
      }
    });
  }

  public trackView(title: string, campaignUrl: string = null, newSession: boolean = false) {
    this.waitForGoogleAnalytics()
      .then(() => {
        this.googleAnalytics.trackView(title, campaignUrl, newSession)
          .then(() => {})
          .catch((error) => { console.log(error) });
      })
      .catch((error) => {})
  }

  public trackEvent(category: string, action: string, label: string = null, value: number = null, newSession: boolean = false) {
    this.waitForGoogleAnalytics()
      .then(() => {
        this.googleAnalytics.trackEvent(category, action, label, value, newSession)
          .then(() => {})
          .catch((error) => { console.log(error) });
      })
      .catch((error) => {})
  }

  public trackMetric(key: number, value: any) {
    this.waitForGoogleAnalytics()
      .then(() => {
        this.googleAnalytics.trackMetric(key, value)
          .then(() => {})
          .catch((error) => { console.log(error) });
      })
      .catch((error) => {})
  }

}
