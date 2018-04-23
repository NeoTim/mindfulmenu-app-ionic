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
import { AngularFirestore } from "angularfire2/firestore";

@Component({
  templateUrl: 'ApplicationComponent.html'
})
export class ApplicationComponent implements OnInit {

  @ViewChild(Nav)
  nav: Nav;

  rootPage: any = null;

  loaderVisible: boolean = false;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              public platformUtil: PlatformUtil,
              public viewUtil: ViewUtil,
              public networkModel: NetworkModel,
              public afs: AngularFirestore) {
  }

  ngOnInit() {
    this.afs.app.firestore().settings({
      timestampsInSnapshots: true
    });
    this.init();
  }

  init() {
    this.platform.ready().then(() => {
      if (this.platformUtil.isCordova()) {
        this.networkModel.initializeNetworkCheck();
      }

      this.rootPage = AuthLoginComponent;

      this.setupListeners();
      this.setupInterface();

      console.log('--- APP STARTED ---');
    });
  }

  setupListeners() {
    this.events.subscribe(Event.AUTH.LOGIN.SUCCESS, () => {
      this.rootPage = MainComponent;
    });

    this.events.subscribe(Event.AUTH.LOGOUT.SUCCESS, () => {
      this.rootPage = AuthLoginComponent;
    });

    this.events.subscribe(Event.NETWORK.ONLINE, () => {
      //
    });

    this.events.subscribe(Event.NETWORK.OFFLINE, () => {
      //
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
        errorText = 'Something went wrong. Details: ' + error.toString();
      }

      this.viewUtil.showToast(errorText, false, false);
    });

    this.events.subscribe(Event.SYSTEM.LOADING, (status) => {
      if (status && !this.loaderVisible) {
        this.loaderVisible = true;
        this.viewUtil.showLoader();
      }
      else if (!status && this.loaderVisible) {
        this.loaderVisible = false;
        this.viewUtil.hideLoader();
      }
    });
  }

  setupInterface() {
    if (this.platformUtil.isCordova()) {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }
  }
}
