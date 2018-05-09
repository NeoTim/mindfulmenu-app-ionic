import { Component, ViewChild } from '@angular/core';
import { Navbar, NavController } from 'ionic-angular';

@Component({
  selector: 'about',
  templateUrl: 'AboutComponent.html'
})
export class AboutComponent {

  @ViewChild(Navbar)
  navbar: Navbar;

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    this.navbar.backButtonClick = (event: UIEvent) => {
      this.navCtrl.pop({ animation: 'ios-transition'} );
    }
  }

}
