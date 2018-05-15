import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformUtil } from "../util/PlatformUtil";
import { NetworkModel } from "../model/NetworkModel";
import { Event } from '../common/Event';
import { ViewUtil } from "../util/ViewUtil";
import { AuthLoginComponent } from "./view/auth/login/AuthLoginComponent";
import { MainComponent } from "./view/main/MainComponent";
import { AuthModel } from "../model/AuthModel";
import { FirebaseCredentialsDTO } from "../data/dto/auth/FirebaseCredentialsDTO";
import { AuthOfflineComponent } from "./view/auth/offline/AuthOfflineComponent";
import { UserDTO } from "../data/dto/user/UserDTO";
import { UserModel } from "../model/UserModel";
import { ApplicationConfig } from "../config/ApplicationConfig";
import dedent from "dedent";
import { ApplicationModel } from "../model/ApplicationModel";

@Component({
  templateUrl: 'ApplicationComponent.html'
})
export class ApplicationComponent implements OnInit {

  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = null;

  loaderVisible: boolean = false;
  loaderRequestCount: number = 0;
  loaderDebounceTime: number = 250; // ms

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              public platformUtil: PlatformUtil,
              public viewUtil: ViewUtil,
              public config: ApplicationConfig,
              public applicationModel: ApplicationModel,
              public networkModel: NetworkModel,
              public authModel: AuthModel,
              public userModel: UserModel) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.platform.ready()
      .then(() => {
        if (this.platformUtil.isCordova()) {
          this.networkModel.initializeNetworkCheck();
        }

        this.setupListeners();
        this.setupInterface();

        if (this.networkModel.isOnline) {
          this.authenticate();
        }
        else {
          this.goOffline();
        }

        if (!this.config.production) {
          console.log(dedent`
          ---------------------------------------------------------------------------
          Application "${this.config.applicationOwner} ${this.config.applicationName}" initialized.
          ---------------------------------------------------------------------------
          UI Version: ${this.config.version}
          ---------------------------------------------------------------------------`);
        }
      })
      .catch((reason) => {
      })
  }

  setupListeners() {
    this.events.subscribe(Event.AUTH.LOGIN.SUCCESS, (credentials) => {
      this.userModel.getUserByUID(credentials.uid)
        .then((user: UserDTO) => {
          this.userModel.currentUser = user;
          this.rootPage = MainComponent;
        })
        .catch((error) => {
          this.rootPage = AuthLoginComponent;
        });
    });

    this.events.subscribe(Event.AUTH.LOGOUT.SUCCESS, () => {
      this.rootPage = AuthLoginComponent;
    });

    this.events.subscribe(Event.NETWORK.ONLINE, () => {
      this.goOnline();
    });

    this.events.subscribe(Event.NETWORK.OFFLINE, () => {
      this.goOffline();
    });

    this.events.subscribe(Event.AUTH.ERROR.UNAUTHORIZED, (response: Response) => {
      this.rootPage = AuthLoginComponent;
      this.viewUtil.showToast('Authorization error! Please log in again.', false);
    });

    this.events.subscribe(Event.AUTH.ERROR.FORBIDDEN, (response: Response) => {
      this.viewUtil.showToast('You are not authorized for access!', false);
    });

    this.events.subscribe(Event.SYSTEM.GENERAL_ERROR, (error) => {
      let errorText: string;

      if (error instanceof Response) {
        const jsonError: any = error.json();

        if (jsonError.message) {
          errorText = jsonError.message;
        }
        else {
          if (error.status && error.statusText && error.url) {
            errorText = 'Server call error: ' + error.status + ' ' + error.statusText + ' - ' + error.url;
          }
          else if (error.url) {
            errorText =  'Server call error: ' + error.url;
          }
          else {
            errorText = 'Server call error.';
          }
        }
      }
      else {
        if (error) {
          errorText = 'Something went wrong. Details: ' + error.toString();
        }
        else {
          errorText = 'Something went wrong.';
        }
      }

      this.viewUtil.showToast(errorText, false, false);
    });

    this.events.subscribe(Event.SYSTEM.LOADING, (status) => {
      if (status) {
        this.loaderRequestCount++;

        setTimeout(() => {
          if ((this.loaderRequestCount > 0) && !this.loaderVisible) {
            if (!this.applicationModel.suppressLoading) {
              this.loaderVisible = true;
              this.viewUtil.showLoader();
            }
          }
        }, this.loaderDebounceTime);
      }
      else if (!status) {
        this.loaderRequestCount--;

        setTimeout(() => {
          if ((this.loaderRequestCount === 0) && this.loaderVisible) {
            this.loaderVisible = false;
            this.viewUtil.hideLoader();
          }
        }, this.loaderDebounceTime);
      }
    });
  }

  setupInterface() {
    if (this.platformUtil.isCordova()) {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }
  }

  authenticate() {
    this.authModel.recoverCredentials()
      .then((credentials: FirebaseCredentialsDTO) => {
        this.events.publish(Event.AUTH.LOGIN.SUCCESS, credentials);
      })
      .catch((error) => {
        this.rootPage = AuthLoginComponent;
      });
  }

  goOffline() {
    if (this.rootPage === null) {
      this.rootPage = AuthOfflineComponent;
    }
    else {
      this.nav.push(AuthOfflineComponent);
    }
  }

  goOnline() {
    if (this.rootPage === AuthOfflineComponent) {
      this.authenticate();
    }
    else {
      this.nav.pop();
    }
  }
}
