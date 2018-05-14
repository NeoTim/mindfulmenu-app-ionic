import { Component, OnInit, ViewChild } from '@angular/core';
import { State } from '../../../../common/State';
import { StateService } from '@uirouter/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'auth-login',
    templateUrl: 'AuthLoginComponent.html',
    styleUrls: ['AuthLoginComponent.scss']
})
export class AuthLoginComponent implements OnInit {

  @ViewChild('loginForm')
  private loginForm: NgForm;

  private loginCredentials = {
    email: null,
    password: null
  };

  constructor(private stateService: StateService,
      public toastrService: ToastrService) {
  }

  ngOnInit() {
  }

  submit() {
    if(this.loginCredentials.email == "admin" && this.loginCredentials.password == "MindfulMenu") {
      this.stateService.go(State.MAIN.HOME);
    } else {
      this.toastrService.error("We didn't find an account with that email and password. Please try again.", "Whoops...");
    }
    
  }
}
