import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { ApplicationConfig } from "../config/ApplicationConfig";
import { Event } from "../common/Event";
import { FirebaseCredentialsDTO } from "../data/dto/auth/FirebaseCredentialsDTO";

@Injectable()
export class GoogleAnalyticsModel {

  public googleAnalyticsInitializing: boolean = false;
  public googleAnalyticsReady: boolean = false;

  constructor(private events: Events,
              private storage: Storage,
              private config: ApplicationConfig,
              private googleAnalytics: GoogleAnalytics) {

    this.setupListeners();
  }

  public initializeGoogleAnalytics() {
    this.googleAnalyticsInitializing = true;

    this.googleAnalytics.startTrackerWithId(this.config.googleAnalyticsId)
      .then(() => {
        return this.googleAnalytics.setAppVersion(this.config.version);
      })
      /* crashes GA on mobile currently, also not sure if you actually want to track this
      .then(() => {
        return this.googleAnalytics.setAllowIDFACollection(true);
      })
      */
      .then(() => {
        this.googleAnalyticsInitializing = false;
        this.googleAnalyticsReady = true;
      })
      .catch((error) => {
        this.googleAnalyticsInitializing = false;
        this.googleAnalyticsReady = false;

        this.events.publish(Event.SYSTEM.GENERAL_ERROR, 'Error starting Google Analytics!');
      });
  }

  private setupListeners(): void {
    this.events.subscribe(Event.AUTH.LOGIN.SUCCESS, (credentials: FirebaseCredentialsDTO) => {
      this.waitForGoogleAnalytics()
        .then(() => {
          this.googleAnalytics.setUserId(credentials.uid)
            .then(() => {})
            .catch((error) => { console.log(error) });
        })
        .catch(() => {})
    });
    this.events.subscribe(Event.AUTH.LOGOUT.SUCCESS, () => {
      this.waitForGoogleAnalytics()
        .then(() => {
          this.googleAnalytics.setUserId(null)
            .then(() => {})
            .catch((error) => { console.log(error) });
        })
        .catch(() => {})
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
      .catch(() => {})
  }

  public trackEvent(category: string, action: string, label: string = null, value: number = null, newSession: boolean = false) {
    this.waitForGoogleAnalytics()
      .then(() => {
        this.googleAnalytics.trackEvent(category, action, label, value, newSession)
          .then(() => {})
          .catch((error) => { console.log(error) });
      })
      .catch(() => {})
  }

  public trackMetric(key: number, value: any) {
    this.waitForGoogleAnalytics()
      .then(() => {
        this.googleAnalytics.trackMetric(key, value)
          .then(() => {})
          .catch((error) => { console.log(error) });
      })
      .catch(() => {})
  }

}
