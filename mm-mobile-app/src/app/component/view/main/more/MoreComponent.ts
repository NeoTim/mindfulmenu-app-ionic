import { Component } from '@angular/core';
import { ActionSheetController, NavController } from 'ionic-angular';
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

  public applicationVersion: string = this.config.version;

  constructor(public navCtrl: NavController,
              public viewUtil: ViewUtil,
              public actionSheetCtrl: ActionSheetController,
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
    // popup version
    this.viewUtil.showConfirmation('Please confirm', 'Do you want to log out now?')
      .then(() => {
        this.authModel.logout()
          .then((result) => {})
          .catch((error) => {});
      })
      .catch(() => {

      });

    // actionsheet version
    /*
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Do you want to log out now?',
      buttons: [
        {
          text: 'Log out',
          role: 'destructive',
          handler: () => {
            actionSheet.dismiss();
            actionSheet = null;

            this.authModel.logout()
              .then((result) => {})
              .catch((error) => {});

            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            actionSheet = null;
          }
        }
      ]
    });

    actionSheet.present();
    */
  }

}
