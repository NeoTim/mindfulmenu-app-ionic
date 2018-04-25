import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthModel } from "../../../../model/AuthModel";
import { UserDTO } from "../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../model/UserModel";

@Component({
  selector: 'more',
  templateUrl: 'MoreComponent.html'
})
export class MoreComponent {

  public currentUser: UserDTO;

  constructor(public navCtrl: NavController,
              public authModel: AuthModel,
              public userModel: UserModel) {

    this.currentUser = userModel.currentUser;
  }

  logout() {
    this.authModel.logout()
      .then((result) => {})
      .catch((error) => {});
  }

}
