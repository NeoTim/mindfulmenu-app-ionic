import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ApplicationModel } from '../../../model/ApplicationModel';
import { State } from '../../../common/State';

@Component({
  selector: 'main-layout',
  templateUrl: 'MainLayoutComponent.html',
  styleUrls: ['MainLayoutComponent.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  public State: any = State.values();

  constructor(private applicationModel: ApplicationModel,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isLoadingSubscription = this.applicationModel.isLoading.subscribe((value: boolean) => {
      // firestore calls can be almost instant, which causes to change the subscription value few times within one digest cycle
      // (as a result of quick Event.SYSTEM.LOADING broadcasts)
      // we need to force change detection whenever it happens, to avoid ExpressionChangedAfterItHasBeenCheck error in the view
      this.isLoading = value;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.isLoadingSubscription.unsubscribe();
  }

}
