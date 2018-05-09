import { Component, ViewChild } from '@angular/core';
import { Navbar, NavController } from 'ionic-angular';
import { UserDTO } from "../../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../../model/UserModel";
import * as moment from 'moment';
import { ApplicationConfig } from "../../../../../config/ApplicationConfig";
import { AccountChangePasswordComponent } from "./AccountChangePasswordComponent";

@Component({
  selector: 'account',
  templateUrl: 'AccountComponent.html'
})
export class AccountComponent {

  @ViewChild(Navbar)
  navbar: Navbar;

  public currentUser: UserDTO;

  constructor(public navCtrl: NavController,
              public config: ApplicationConfig,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
    this.navbar.backButtonClick = (event: UIEvent) => {
      this.navCtrl.pop({ animation: 'ios-transition'} );
    }
  }

  showChangePassword() {
    this.navCtrl.push(AccountChangePasswordComponent, null,{ animation: 'ios-transition'} )
  }

  showCancelSubscription() {
    window.open(`mailto:${this.config.contactEmail}?subject=Cancel subscription&body=I would like to cancel my subscription, effective ${moment().format('YYYY-MM-DD')}.`, '_system');
  }

}
