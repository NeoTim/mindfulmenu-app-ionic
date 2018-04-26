import { Injectable } from '@angular/core';
import { ApplicationModel } from '../model/ApplicationModel';
import { StateService } from '@uirouter/core';
import { State } from '../common/State';

@Injectable()
export class StateUtil {

  constructor(private applicationModel: ApplicationModel,
              private stateService: StateService) {
  }

  public goBack() {
    const previousState = this.applicationModel.previousStateHistory.pop();

    if (previousState) {
      this.applicationModel.goingToPreviousState = true;
      this.stateService.go(previousState.state, previousState.params);
    }
    else {
      this.applicationModel.goingToPreviousState = true;
      this.goToHome();
    }
  }

  public reloadApplication() {
    window.location.reload();
  }

  public goToUrl(url, newWindow) {
    window.open(url, newWindow ? '_blank' : '_self');
  }

  public goToState(state, stateParameters) {
    this.stateService.go(state, stateParameters);
  }

  public goToHome() {
    this.stateService.go(State.MAIN.HOME);
  }

  public goToPageNotFound() {
    this.stateService.go(State.PRELIMINARY.ERROR.NOT_FOUND);
  }

}
