import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApplicationConfig } from '../../../../config/ApplicationConfig';
import { ViewUtil } from '../../../../util/ViewUtil';
import { AuthModel } from '../../../../model/AuthModel';
import { Token } from '../../../../data/local/auth/Token';

@Component({
    selector: 'auth-login',
    templateUrl: 'AuthLoginComponent.html',
})
export class AuthLoginComponent {

    loginData = {
        username: '',
        password: ''
    };

    constructor(public navCtrl: NavController,
                public config: ApplicationConfig,
                private viewUtil: ViewUtil,
                public authModel: AuthModel) {
    }

    ionViewDidLoad() {
        this.init();
    }

    init() {
    }

    submit() {
        this.viewUtil.showLoader();

        this.authModel.login(this.loginData.username, this.loginData.password)
            .then((token: Token) => {
                this.viewUtil.hideLoader();
            })
            .catch((error) => {
                this.viewUtil.hideLoader();

                if (error.status === 401) {
                    this.viewUtil.showToast('Incorrect email or password!');
                }
                else {
                    this.viewUtil.showToast('Error! Login unsuccessful!');
                }
            });
    }

}
