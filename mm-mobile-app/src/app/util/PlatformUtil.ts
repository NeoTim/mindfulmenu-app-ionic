import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class PlatformUtil {

    constructor(public platform: Platform) {
    }

    public isCordova(): boolean {
        return this.platform.is('cordova');
    }

    public isMobile(): boolean {
        return this.platform.is('mobile');
    }

    public isIOS(): boolean {
        return this.platform.is('ios');
    }

    public isAndroid(): boolean {
        return this.platform.is('android');
    }
    
}
