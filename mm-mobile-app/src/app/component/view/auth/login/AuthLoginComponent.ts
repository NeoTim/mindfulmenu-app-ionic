import { Component, ViewChild } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { ApplicationConfig } from '../../../../config/ApplicationConfig';
import { ViewUtil } from '../../../../util/ViewUtil';
import { AuthModel } from '../../../../model/AuthModel';
import { FirebaseCredentialsDTO } from "../../../../data/dto/auth/FirebaseCredentialsDTO";
import { NgForm } from "@angular/forms";
import { UserModel } from "../../../../model/UserModel";
import { UserDTO } from "../../../../data/dto/user/UserDTO";

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
              public authModel: AuthModel,
              public userModel: UserModel) {
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

  signup() {
   // this.app.getRootNav().push(InternalUrlBrowserComponent, { url: this.config.websiteUrl + 'monthly-menu-subscription' });
    this.authModel.register(this.loginData.username, this.loginData.password)
      .then((credentials: FirebaseCredentialsDTO) => {
        console.log(credentials);

        let newUser: UserDTO = new UserDTO();
        newUser.id = credentials.uid;
        newUser.firstName = '';
        newUser.lastName = '';
        newUser.email = credentials.email;
        newUser.emailVerified = credentials.emailVerified;
        newUser.lastLoginDate = credentials.lastSignInTime;
        newUser.favoriteMealIds = [];
        newUser.isAdmin = false;
        newUser.isEnabled = false;

        this.userModel.createUser(newUser)
          .then((createdUser: UserDTO) => {
              console.log(createdUser);
          })
          .catch((error) => {});
      })
      .catch((error) => {
        console.log(error);
        this.viewUtil.showToast(error.code);
      });
  }

/*
  auth/email-already-in-use
  Thrown if there already exists an account with the given email address.
  auth/invalid-email
  Thrown if the email address is not valid.
  auth/operation-not-allowed
  Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
  auth/weak-password
*/

}
