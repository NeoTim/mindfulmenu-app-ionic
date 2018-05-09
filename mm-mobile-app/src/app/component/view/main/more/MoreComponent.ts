import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthModel } from "../../../../model/AuthModel";
import { UserDTO } from "../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../model/UserModel";
import { ViewUtil } from "../../../../util/ViewUtil";
import { AccountComponent } from "./account/AccountComponent";
import { AboutComponent } from "./about/AboutComponent";
import { ApplicationConfig } from "../../../../config/ApplicationConfig";

@Component({
  selector: 'more',
  templateUrl: 'MoreComponent.html'
})
export class MoreComponent {

  public currentUser: UserDTO;

  constructor(public navCtrl: NavController,
              public viewUtil: ViewUtil,
              public config: ApplicationConfig,
              public authModel: AuthModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
  }

  showAccount() {
    this.navCtrl.push(AccountComponent, null,{ animation: 'ios-transition'} )
  }

  showAbout() {
    this.navCtrl.push(AboutComponent, null,{ animation: 'ios-transition'} )
  }

  showContact() {
    window.open(`mailto:${this.config.contactEmail}?subject=Regarding Mindful Menu App`, '_system');
  }

  logout() {
    this.viewUtil.showConfirmation('Please confirm', 'Are you sure you want to log out?')
      .then(() => {
        this.authModel.logout()
          .then((result) => {})
          .catch((error) => {});
      })
      .catch(() => {

      });
  }

}
