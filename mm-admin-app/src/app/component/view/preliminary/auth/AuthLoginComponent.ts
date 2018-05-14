import { Component, OnInit } from '@angular/core';
import { State } from '../../../../common/State';

@Component({
    selector: 'preliminary-auth-login',
    templateUrl: 'AuthLoginComponent.html',
    styleUrls: ['AuthLoginComponent.scss']
})
export class AuthLoginComponent implements OnInit {

  constructor() {
    console.log("constructor");
  }

  ngOnInit() {
    console.log("on init");
  }
}
