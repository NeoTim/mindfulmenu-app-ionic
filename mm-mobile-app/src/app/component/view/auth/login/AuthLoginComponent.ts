import { Component, ViewChild } from '@angular/core';
import { App, Events, NavController } from 'ionic-angular';
import { ApplicationConfig } from '../../../../config/ApplicationConfig';
import { ViewUtil } from '../../../../util/ViewUtil';
import { AuthModel } from '../../../../model/AuthModel';
import { FirebaseCredentialsDTO } from "../../../../data/dto/auth/FirebaseCredentialsDTO";
import { NgForm } from "@angular/forms";
import { AuthSignupComponent } from "../signup/AuthSignupComponent";
import { Event } from "../../../../common/Event";
import { AuthForgotPasswordComponent } from "../forgotPassword/AuthForgotPasswordComponent";

@Component({
    selector: 'auth-login',
    templateUrl: 'AuthLoginComponent.html',
})
export class AuthLoginComponent {

  @ViewChild('loginForm')
  private loginForm: NgForm;

  private autoLoginBoundFunction: Function = this.autoLogin.bind(this);

  loginData = {
      username: '',
      password: ''
  };

  constructor(public app: App,
              public navCtrl: NavController,
              private events: Events,
              public config: ApplicationConfig,
              private viewUtil: ViewUtil,
              public authModel: AuthModel) {
  }

  ionViewDidLoad() {
      this.init();
  }

  ionViewDidEnter() {
    this.events.subscribe(Event.SYSTEM.AUTO_LOGIN, this.autoLoginBoundFunction);
  }

  ionViewDidLeave() {
    this.events.unsubscribe(Event.SYSTEM.AUTO_LOGIN, this.autoLoginBoundFunction);
  }

  init() {
  }

  login() {
    this.loginForm.onSubmit(null);

    if (this.loginForm.form.valid) {
      this.authModel.login(this.loginData.username, this.loginData.password)
        .then((credentials: FirebaseCredentialsDTO) => {
          // handled globally
        })
        .catch((error) => {
          if (error.code && ((error.code === 'auth/wrong-password') || (error.code === 'auth/user-not-found'))) {
            this.viewUtil.showToast('Incorrect email or password!');
          }
          else if (error.message) {
            this.viewUtil.showToast(error.message);
          }
          else {
            this.viewUtil.showToast('Error! Login unsuccessful!');
          }
        });
    }
  }

  autoLogin(loginData: { username: string, password: string }) {
    this.loginData = loginData;
    // give it time to sync validation state
    setTimeout(() => {
      this.login();
    });
  }

  forgotPassword() {
    this.navCtrl.push(AuthForgotPasswordComponent, null,{ animation: 'ios-transition'} )
  }

  signUp() {
    this.navCtrl.push(AuthSignupComponent, null,{ animation: 'ios-transition'} )
  }

}
