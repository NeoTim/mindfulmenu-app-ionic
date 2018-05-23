import { Injectable, Injector } from '@angular/core';
import { TransitionService, StateService, Transition, Ng2StateDeclaration } from '@uirouter/angular';
import { Event } from './common/Event';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from 'angular-event-service/dist';
import { ToastrService } from 'ngx-toastr';
import { ApplicationModel } from './model/ApplicationModel';
import { HtmlUtil } from './util/HtmlUtil';
import { ApplicationState } from './data/local/ApplicationState';
import { ApplicationConfig } from './config/ApplicationConfig';
import { State } from './common/State';
import * as _ from 'lodash';

@Injectable()
export class ApplicationInit {

  private toastrService: ToastrService;

  private publicStates: string[] = [
    State.PRELIMINARY.AUTH.LOGIN,
    State.PRELIMINARY.ERROR.NOT_FOUND
  ];

  constructor(private eventsService: EventsService,
              private transitionService: TransitionService,
              private stateService: StateService,
              private applicationModel: ApplicationModel,
              private injector: Injector) {

    // avoid circular dependency issues
    setTimeout(() => {
      this.toastrService = this.injector.get(ToastrService);
    });


    this.configureTransitions();
    this.configureListeners();
  }

  configureTransitions() {
    this.transitionService.onBefore({}, (transition: Transition) => {
      const toState: Ng2StateDeclaration = transition.to();
      const toStateParams: any = transition.params('entering');

      if (!this.applicationModel.isLoggedIn && !_.includes(this.publicStates, toState.name)) {
        return this.stateService.target(State.PRELIMINARY.AUTH.LOGIN);
      }
      else {
        return true;
      }
    });

    this.transitionService.onSuccess({}, (transition: Transition) => {
      const toState = transition.to();
      const toStateParams = transition.params('entering');
      const fromState = transition.from();
      const fromStateParams = transition.params('exiting');

      if (this.applicationModel.goingToPreviousState) {
        this.applicationModel.goingToPreviousState = false;
      }
      else {
        if (fromState.name) {
          this.applicationModel.previousStateHistory.push(new ApplicationState(fromState, fromStateParams));
        }
      }

      this.applicationModel.currentState = new ApplicationState(toState, toStateParams);
      this.applicationModel.currentUrl = this.stateService.href(
        this.applicationModel.currentState.state,
        this.applicationModel.currentState.params,
        {absolute: true}
      );

      HtmlUtil.scrollToTop(null, true);

      return true;
    });
  }

  configureListeners() {
    this.eventsService.on(Event.SYSTEM.LOADING, (isLoading: boolean) => {
      this.applicationModel.isLoading.next(isLoading);
    });

    this.eventsService.on(Event.SYSTEM.GENERAL_ERROR, (error) => {
      let errorText: string;

      if (error instanceof HttpErrorResponse) {
        if (error.error && error.error.message) {
          errorText = error.error.message;
        }
        else {
          if (error.message && error.url) {
            errorText = error.message + '<br />' + error.url;
          }
          else if (error.message) {
            errorText = error.message;
          }
          else if (error.url) {
            errorText = error.url;
          }
        }
      }
      else {
        errorText = 'Something went wrong.';
      }

      this.toastrService.error(errorText, 'General error!');

      if (!ApplicationConfig.production) {
        console.log(error);
      }
    });

  }

}
