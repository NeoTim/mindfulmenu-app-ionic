import { Component } from '@angular/core';
import { App, Events, NavController } from 'ionic-angular';
import { AuthModel } from "../../../../model/AuthModel";
import { Event } from "../../../../common/Event";
import { InternalUrlBrowserComponent } from "../../../ui/internalUrlBrowser/InternalUrlBrowserComponent";
import { ApplicationConfig } from "../../../../config/ApplicationConfig";

@Component({
    selector: 'auth-purgatory',
    templateUrl: 'AuthPurgatoryComponent.html',
})
export class AuthPurgatoryComponent {

  subscriptionAttempted: boolean = false;

  constructor(public app: App,
              public navCtrl: NavController,
              public config: ApplicationConfig,
              private events: Events,
              public authModel: AuthModel) {
  }

  ionViewDidLoad() {
      this.init();
  }

  ionViewDidEnter() {
    if (this.subscriptionAttempted) {
      this.tryAgain();
    }
  }

  init() {
  }

  tryAgain() {
    this.events.publish(Event.AUTH.LOGIN.SUCCESS, this.authModel.credentials);
  }

  logout() {
    this.authModel.logout()
      .then((result) => {})
      .catch((error) => {});
  }

  showSetupMonthlySubscription() {
    this.app.getRootNav().push(InternalUrlBrowserComponent, { url: this.config.subscriptionUrl.oneMonth });
    this.subscriptionAttempted = true;
  }

  showSetupSixMonthSubscription() {
    this.app.getRootNav().push(InternalUrlBrowserComponent, { url: this.config.subscriptionUrl.sixMonths });
    this.subscriptionAttempted = true;
  }

}
