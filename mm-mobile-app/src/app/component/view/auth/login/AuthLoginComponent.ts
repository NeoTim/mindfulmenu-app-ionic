import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApplicationConfig } from '../../../../config/ApplicationConfig';
import { ViewUtil } from '../../../../util/ViewUtil';
import { AuthModel } from '../../../../model/AuthModel';
import { FirebaseCredentialsDTO } from "../../../../data/dto/auth/FirebaseCredentialsDTO";

@Component({
    selector: 'auth-login',
    templateUrl: 'AuthLoginComponent.html',
})
export class AuthLoginComponent {

    loginData = {
        username: 'u1@example.com',
        password: 'chpwd!'
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
        this.authModel.login(this.loginData.username, this.loginData.password)
            .then((auth: FirebaseCredentialsDTO) => {
                // handled globally
            })
            .catch((error) => {
                if (error.code && ((error.code === 'auth/wrong-password') || (error.code === 'auth/user-not-found'))) {
                    this.viewUtil.showToast('Incorrect email or password!');
                }
                else if (error.message) {
                  this.viewUtil.showToast(error.message);
                }
                else {
                    this.viewUtil.showToast('Error! Login unsuccessful!');
                }
            });
    }

}
