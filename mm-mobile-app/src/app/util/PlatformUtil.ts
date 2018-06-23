import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class PlatformUtil {

    public platforms: string[] = [];

    constructor(private platform: Platform) {
      this.platforms = platform.platforms();
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
