import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'auth-offline',
    templateUrl: 'AuthOfflineComponent.html',
})
export class AuthOfflineComponent {

    constructor(public navCtrl: NavController) {
    }

    ionViewDidLoad() {
        this.init();
    }

    init() {
    }

}
