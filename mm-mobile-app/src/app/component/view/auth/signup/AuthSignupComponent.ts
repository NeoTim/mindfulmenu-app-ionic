import { Component, ViewChild } from '@angular/core';
import { App, Events, Navbar, NavController } from 'ionic-angular';
import { ApplicationConfig } from '../../../../config/ApplicationConfig';
import { ViewUtil } from '../../../../util/ViewUtil';
import { AuthModel } from '../../../../model/AuthModel';
import { FirebaseCredentialsDTO } from "../../../../data/dto/auth/FirebaseCredentialsDTO";
import { NgForm } from "@angular/forms";
import { UserModel } from "../../../../model/UserModel";
import { UserDTO } from "../../../../data/dto/user/UserDTO";
import { InternalUrlBrowserComponent } from "../../../ui/internalUrlBrowser/InternalUrlBrowserComponent";
import { Event } from "../../../../common/Event";

@Component({
    selector: 'auth-signup',
    templateUrl: 'AuthSignupComponent.html',
})
export class AuthSignupComponent {

  @ViewChild(Navbar)
  navbar: Navbar;

  @ViewChild('signUpForm')
  private signUpForm: NgForm;

  signupData = {
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordRepeat: ''
  };

  signUpComplete: boolean = false;

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

  ionViewDidEnter() {
    if (this.signUpComplete) {
      this.back();
    }
  }

  init() {
  }

  signUp() {
    this.signUpForm.onSubmit(null);

    if (this.signUpForm.form.valid) {
      this.authModel.register(this.signupData.username, this.signupData.password)
        .then((credentials: FirebaseCredentialsDTO) => {

          let newUser: UserDTO = new UserDTO();
          newUser.firstName = this.signupData.firstName;
          newUser.lastName = this.signupData.lastName;
          newUser.email = credentials.email;
          newUser.favoriteMealIds = [];
          newUser.emailVerified = false;
          newUser.lastLoginDate = null;
          newUser.lastAutomaticUpdateDate = null;
          newUser.automaticUpdateEnabled = true;
          newUser.isAdmin = false;
          newUser.isEnabled = false;

          this.userModel.createUser(newUser, credentials.uid)
            .then((createdUser: UserDTO) => {
                this.signUpComplete = true;
                this.back();
            })
            .catch((error) => {});
        })
        .catch((error) => {
          if (error.code && ((error.code === 'auth/email-already-in-use'))) {
            this.viewUtil.showToast('This email is already in use!');
          }
          else if (error.code && ((error.code === 'auth/operation-not-allowed'))) {
            this.viewUtil.showToast('Registration currently disabled.');
          }
          else if (error.message) {
            this.viewUtil.showToast(error.message);
          }
          else {
            this.viewUtil.showToast('Error! Signup unsuccessful!');
          }
        });
    }
  }

  back() {
     this.navCtrl.pop({ animation: 'ios-transition' })
       .then(() => {
         if (this.signUpComplete) {
           this.events.publish(Event.SYSTEM.AUTO_LOGIN, { username: this.signupData.username, password: this.signupData.password });
         }
       })
       .catch((error) => {});
  }

  showSetupMonthlySubscription() {
    this.app.getRootNav().push(InternalUrlBrowserComponent, { url: this.config.subscriptionUrl.oneMonth });
  }

  showSetupSixMonthSubscription() {
    this.app.getRootNav().push(InternalUrlBrowserComponent, { url: this.config.subscriptionUrl.sixMonths });
  }

}
