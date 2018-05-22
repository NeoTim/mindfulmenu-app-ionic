import { Component, OnInit, ViewChild } from '@angular/core';
import { State } from '../../../../common/State';
import { StateService } from '@uirouter/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { ApplicationModel } from '../../../../model/ApplicationModel';

@Component({
    selector: 'auth-login',
    templateUrl: 'AuthLoginComponent.html',
    styleUrls: ['AuthLoginComponent.scss']
})
export class AuthLoginComponent implements OnInit {

  @ViewChild('loginForm')
  private loginForm: NgForm;

  public loginCredentials = {
    email: null,
    password: null
  };

  private readonly LOGIN: string     = 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=';
  private readonly PASSWORD: string  = 'ejGIAHBqBn4f7OTRoOrY36x230/gnNoN+enp1OpZm+U=';

  constructor(private stateService: StateService,
              public toastrService: ToastrService,
              public applicationModel: ApplicationModel) {
  }

  ngOnInit() {
  }

  submit() {
    if (
      (CryptoJS.SHA256(this.loginCredentials.email).toString(CryptoJS.enc.Base64) === this.LOGIN) &&
      (CryptoJS.SHA256(this.loginCredentials.password).toString(CryptoJS.enc.Base64) === this.PASSWORD)
    ) {
      this.applicationModel.isLoggedIn = true;
      this.stateService.go(State.MAIN.HOME);
    }
    else {
      this.applicationModel.isLoggedIn = false;
      this.toastrService.error('We didn\'t find an account with that email and password. Please try again.', 'Whoops...');
    }

  }
}
