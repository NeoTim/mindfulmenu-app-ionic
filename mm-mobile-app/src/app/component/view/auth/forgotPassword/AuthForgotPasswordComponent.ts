import { Component, ViewChild } from '@angular/core';
import { App, Events, Navbar, NavController } from 'ionic-angular';
import { ApplicationConfig } from '../../../../config/ApplicationConfig';
import { ViewUtil } from '../../../../util/ViewUtil';
import { AuthModel } from '../../../../model/AuthModel';
import { NgForm } from "@angular/forms";
import { UserModel } from "../../../../model/UserModel";

@Component({
    selector: 'auth-forgot-password',
    templateUrl: 'AuthForgotPasswordComponent.html',
})
export class AuthForgotPasswordComponent {

  @ViewChild(Navbar)
  navbar: Navbar;

  @ViewChild('forgotPasswordForm')
  private forgotPasswordForm: NgForm;

  formData = {
      username: ''
  };

  forgotPasswordCompleted: boolean = false;

  constructor(public app: App,
              public navCtrl: NavController,
              private events: Events,
              public config: ApplicationConfig,
              private viewUtil: ViewUtil,
              public authModel: AuthModel,
              public userModel: UserModel) {
  }

  ionViewDidLoad() {
    this.init();

    this.navbar.backButtonClick = (event: UIEvent) => {
      this.back();
    }
  }

  init() {
  }

  forgotPassword() {
    this.forgotPasswordForm.onSubmit(null);

    if (this.forgotPasswordForm.form.valid) {
      this.authModel.forgotPassword(this.formData.username)
        .then(() => {
          this.forgotPasswordCompleted = true;
          this.back();
        })
        .catch((error) => {
          this.forgotPasswordCompleted = false;

          if (error.code && ((error.code === 'auth/invalid-email'))) {
            this.viewUtil.showToast('Invalid email!');
          }
          else if (error.code && ((error.code === 'auth/user-not-found'))) {
            this.viewUtil.showToast('User not found.');
          }
          else if (error.message) {
            this.viewUtil.showToast(error.message);
          }
          else {
            this.viewUtil.showToast('Error!');
          }
        });
    }
  }

  back() {
     this.navCtrl.pop({ animation: 'ios-transition' })
       .then(() => {
         if (this.forgotPasswordCompleted) {
           this.viewUtil.showToast('Check your email for further instructions.');
         }
       })
       .catch((error) => {});
  }

}
