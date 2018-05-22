import { Component, ViewChild } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { ApplicationConfig } from '../../../../config/ApplicationConfig';
import { ViewUtil } from '../../../../util/ViewUtil';
import { AuthModel } from '../../../../model/AuthModel';
import { FirebaseCredentialsDTO } from "../../../../data/dto/auth/FirebaseCredentialsDTO";
import { NgForm } from "@angular/forms";
import { AuthSignupComponent } from "../signup/AuthSignupComponent";

@Component({
    selector: 'auth-login',
    templateUrl: 'AuthLoginComponent.html',
})
export class AuthLoginComponent {

  @ViewChild('loginForm')
  private loginForm: NgForm;

  loginData = {
      username: 'u1@example.com',
      password: 'chpwd!'
  };

  constructor(public app: App,
              public navCtrl: NavController,
              public config: ApplicationConfig,
              private viewUtil: ViewUtil,
              public authModel: AuthModel) {
  }

  ionViewDidLoad() {
      this.init();
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

  signUp() {
    this.navCtrl.push(AuthSignupComponent, null,{ animation: 'ios-transition'} )
  }

}
