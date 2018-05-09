import { Injectable } from '@angular/core';
import { Alert, AlertController, LoadingController, Toast, ToastController } from 'ionic-angular';
import { Loading } from 'ionic-angular/components/loading/loading';

@Injectable()
export class ViewUtil {

    private loader: Loading;
    private toast: Toast;
    private alert: Alert;

    constructor(private toastCtrl: ToastController,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController) {
    }

    showToast(text: string = 'Please wait ...', dismissOnPageChange: boolean = true, forceShow: boolean = true): void {
        if (this.toast && forceShow) {
            this.toast.dismiss(null, null, {
                animate: false,
                duration: 0,
                progressAnimation: false
            });
            this.toast = null;
        }

        if (!this.toast) {
            this.toast = this.toastCtrl.create({
                message: text,
                duration: 5000,
                position: 'bottom',
                dismissOnPageChange: dismissOnPageChange
            });

            this.toast.present();
            this.toast.onDidDismiss((data: any, role: string) => {
                this.toast = null;
            })
        }
    }

    showLoader(text: string = 'Please wait ...'): void {
        this.loader = this.loadingCtrl.create({
            content: text
        });

        this.loader.present();
    }

    hideLoader(): void {
        if (this.loader) {
            this.loader.dismiss();
            this.loader = null;
        }
    }

    showConfirmation(title: string = 'Please confirm', text: string = 'Are you sure?') {
      return new Promise((resolve, reject) => {
        this.alert = this.alertCtrl.create({
          title: title,
          message: text,
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
                this.alert = null;
                reject();
              }
            },
            {
              text: 'OK',
              handler: () => {
                this.alert = null;
                resolve();
              }
            }
          ]
        });

        this.alert.present();
      });
    }
}
