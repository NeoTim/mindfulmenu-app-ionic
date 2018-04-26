import { Component, OnInit } from '@angular/core';
import { State } from '../../../../common/State';

@Component({
  selector: 'error-not-found',
  templateUrl: 'ErrorNotFoundComponent.html'
})
export class ErrorNotFoundComponent implements OnInit {

  public State: any = State.values();

  constructor() {
    console.log('created');
  }

  ngOnInit() {
  }
}
