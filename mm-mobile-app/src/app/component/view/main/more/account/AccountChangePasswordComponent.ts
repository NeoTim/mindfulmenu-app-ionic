import { Component, ViewChild } from '@angular/core';
import { Navbar, NavController } from 'ionic-angular';
import { AuthModel } from "../../../../../model/AuthModel";
import { NgForm } from "@angular/forms";
import { ViewUtil } from "../../../../../util/ViewUtil";
import { UserDTO } from "../../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../../model/UserModel";

@Component({
  selector: 'account-change-password',
  templateUrl: 'AccountChangePasswordComponent.html'
})
export class AccountChangePasswordComponent {

  @ViewChild(Navbar)
  navbar: Navbar;

  @ViewChild('passwordForm')
  private passwordForm: NgForm;

  public currentUser: UserDTO;

  passwordData = {
    currentPassword: '',
    newPassword: '',
    newPasswordRepeat: ''
  };

  constructor(public navCtrl: NavController,
              public viewUtil: ViewUtil,
              public userModel: UserModel,
              public authModel: AuthModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
    this.navbar.backButtonClick = (event: UIEvent) => {
      this.navCtrl.pop({ animation: 'ios-transition'} );
    }
  }

  change() {
    this.passwordForm.onSubmit(null);

    if (this.passwordForm.form.valid) {
      this.authModel.changePassword(this.currentUser.email, this.passwordData.currentPassword, this.passwordData.newPassword)
        .then(() => {
          this.navCtrl.pop({ animation: 'ios-transition'} );
        })
        .catch((error) => {
          if (error.code && (error.code === 'auth/weak-password')) {
            this.viewUtil.showToast('Use stronger password!');
          }
          else if (error.code && (error.code === 'auth/wrong-password')) {
            this.viewUtil.showToast('Incorrect current password!');
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

}
