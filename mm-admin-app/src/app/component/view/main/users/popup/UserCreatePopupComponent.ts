import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../../../../model/UserModel';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDTO } from '../../../../../data/dto/user/UserDTO';
import { ToastrService } from 'ngx-toastr';
import { AuthModel } from '../../../../../model/AuthModel';
import { FirebaseCredentialsDTO } from '../../../../../data/dto/auth/FirebaseCredentialsDTO';

@Component({
  selector: 'user-create-popup',
  templateUrl: 'UserCreatePopupComponent.html',
  styleUrls: ['UserCreatePopupComponent.scss']
})
export class UserCreatePopupComponent implements OnInit {

  @ViewChild('userForm')
  private userForm: NgForm;

  signupData = {
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordRepeat: '',
    isAdmin: false
  };

  constructor(public activeModal: NgbActiveModal,
              public toastrService: ToastrService,
              public authModel: AuthModel,
              public userModel: UserModel) {
  }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  save() {
    this.userForm.onSubmit(null);

    if (this.userForm.form.valid) {

      this.authModel.register(this.signupData.username, this.signupData.password)
        .then((credentials: FirebaseCredentialsDTO) => {

          let newUser: UserDTO = new UserDTO();
          newUser.firstName = this.signupData.firstName;
          newUser.lastName = this.signupData.lastName;
          newUser.email = credentials.email;
          newUser.favoriteMealIds = [];
          newUser.emailVerified = false;
          newUser.lastLoginDate = null;
          newUser.lastAutomaticUpdateDate = null;
          newUser.automaticUpdateEnabled = true;
          newUser.isAdmin =  this.signupData.isAdmin;
          newUser.isEnabled = false;

          this.userModel.createUser(newUser, credentials.uid)
            .then((createdUser: UserDTO) => {
              this.activeModal.close(createdUser);
            })
            .catch((error) => {});
        })
        .catch((error) => {
          if (error.code && ((error.code === 'auth/email-already-in-use'))) {
            this.toastrService.error('This email is already in use!', 'Error');
          }
          else if (error.code && ((error.code === 'auth/operation-not-allowed'))) {
            this.toastrService.error('Registration currently disabled.', 'Error');
          }
          else if (error.message) {
            this.toastrService.error(error.message, 'Error');
          }
          else {
            this.toastrService.error('User creation unsuccessful!', 'Error');
          }
        });
    }
  }
}
