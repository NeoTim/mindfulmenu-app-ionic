import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthModel } from "../../../../model/AuthModel";

@Component({
  selector: 'more',
  templateUrl: 'MoreComponent.html'
})
export class MoreComponent {

  constructor(public navCtrl: NavController,
              public authModel: AuthModel) {

  }

  logout() {
    this.authModel.logout();
  }

}
