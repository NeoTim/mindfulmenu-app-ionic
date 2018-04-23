import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Event } from '../common/Event';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class NetworkModel {

    public isOnline: boolean = true;

    private onlineSubscription: Subscription;
    private offlineSubscription: Subscription;

    constructor(private events: Events,
                private network: Network) {

        this.setupListeners();
    }

    private setupListeners(): void {
        //
    }

    public initializeNetworkCheck() {
        this.isOnline = !(this.network.type === 'none');

        if (this.isOnline) {
            this.events.publish(Event.NETWORK.ONLINE);
        }
        else {
            this.events.publish(Event.NETWORK.OFFLINE);
        }

        this.stopNetworkCheck();

        this.onlineSubscription = this.network.onConnect().subscribe(data => {
            this.isOnline = true;
            this.events.publish(Event.NETWORK.ONLINE);
        }, (error) =>{
            // nothing
        });

        this.offlineSubscription = this.network.onDisconnect().subscribe(data => {
            this.isOnline = true;
            this.events.publish(Event.NETWORK.OFFLINE);
        }, (error) =>{
            // nothing
        });
    }

    public stopNetworkCheck() {
        if (this.onlineSubscription) {
            this.onlineSubscription.unsubscribe();
            this.onlineSubscription = null;
        }
        if (this.offlineSubscription) {
            this.offlineSubscription.unsubscribe();
            this.offlineSubscription = null;
        }
    }
}