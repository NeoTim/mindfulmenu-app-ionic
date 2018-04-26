import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApplicationState } from '../data/local/ApplicationState';

@Injectable()
export class ApplicationModel {

  public goingToPreviousState: boolean = false;
  public previousStateHistory: ApplicationState[] = [];
  public currentState: ApplicationState;
  public currentUrl: string;

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

}




