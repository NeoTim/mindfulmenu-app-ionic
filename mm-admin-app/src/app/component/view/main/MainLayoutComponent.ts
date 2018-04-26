import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ApplicationModel } from '../../../model/ApplicationModel';

@Component({
  selector: 'main-layout',
  templateUrl: 'MainLayoutComponent.html',
  styleUrls: ['MainLayoutComponent.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  constructor(private applicationModel: ApplicationModel) {
    // first view of the app is Home which instantly loads data, changing the isLoading flag in applicationModel (by broadcasting events)
    // since it's all happening doing initial render and state initialization, give angular time to resolve stable state
    setTimeout(() => {
      this.isLoadingSubscription = applicationModel.isLoading.subscribe((value: boolean) => {
        this.isLoading = value;
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.isLoadingSubscription.unsubscribe();
  }


}
