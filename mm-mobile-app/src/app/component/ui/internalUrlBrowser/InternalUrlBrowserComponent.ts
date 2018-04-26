import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'internal-url-browser',
    templateUrl: 'InternalUrlBrowserComponent.html',
})
export class InternalUrlBrowserComponent {

    private url: string;
    private desanitizedURI: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public sanitizer: DomSanitizer) {

        this.url = navParams.data.url;

        if (this.url) {
            this.desanitizedURI = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        }
    }

    close() {
        this.navCtrl.pop();
    }

}